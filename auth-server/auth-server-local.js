// auth-server-local.js
// This is a simple Express server to run on your local machine for testing.

const express = require('express');
const Ably = require('ably');
const cors =require('cors');

const app = express();
const PORT = 3001; // The port our local server will run on

// IMPORTANT: Your secret Ably API Key.
// For local testing, we'll read it from an environment variable.
const ABLY_API_KEY = process.env.ABLY_API_KEY;

if (!ABLY_API_KEY) {
    console.error("---------------------------------------------------------------------");
    console.error("FATAL: ABLY_API_KEY environment variable not set.");
    console.error("Please start the server using the command:");
    console.error("ABLY_API_KEY='your_real_api_key' node auth-server-local.js");
    console.error("---------------------------------------------------------------------");
    process.exit(1); // Exit if the key is not provided
}

// Use CORS to allow requests from the YouTube domain
// This is crucial for the extension to be able to contact the server.
app.use(cors({ origin: 'https://www.youtube.com' }));

// This is the endpoint your Chrome extension will call.
app.get('/auth', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Received auth request...`);
    
    const ably = new Ably.Rest({ key: ABLY_API_KEY });

    const tokenParams = {
        capability: { '*': ['subscribe', 'publish'] },
    };

    ably.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
        if (err) {
            console.error("Error creating token request:", err);
            return res.status(500).send('Error creating Ably token request');
        }
        console.log(`[${new Date().toLocaleTimeString()}] Successfully created token. Sending to client.`);
        res.json(tokenRequest);
    });
});

app.listen(PORT, () => {
    console.log(`WatchMate Auth Server is running locally on http://localhost:${PORT}`);
    console.log("Waiting for requests from the extension...");
});
