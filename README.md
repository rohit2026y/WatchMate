WatchMate 🎥💬
WatchMate is a Chrome extension that brings real-time chat to any YouTube video. It overlays a simple and clean chat interface on the YouTube page, allowing viewers to chat with others watching the same video simultaneously.

Features
Real-time Chat: Instantly send and receive messages with other viewers on the same video page.

Username System: Choose a persistent username that identifies you across all chats. Your messages are styled differently so you can easily spot them.

Automatic Room Creation: A unique and dedicated chat room is automatically created for each YouTube video.

Secure Authentication: Uses a secure token-based authentication model. Your API keys are never exposed on the client-side.

Simple & Clean UI: A modern, intuitive chat interface that overlays neatly onto YouTube without being intrusive.

How It Works
WatchMate uses a secure, decoupled architecture to provide real-time messaging.

Client-Side Extension: The Chrome extension is injected onto a YouTube video page. It detects the unique video ID to identify the chat room.

Auth Server Request: Instead of containing a secret API key, the extension calls a separate, secure backend server (the Auth Server) to request permission to chat.

Token Generation: The Auth Server, which holds the secret Ably API key, validates the request and asks the Ably service to generate a short-lived, temporary access token.

Direct Ably Connection: The Auth Server sends this token back to the extension. The extension then uses the token to establish a direct, secure connection to Ably's real-time network.

Real-time Messaging: Once connected, all messages are sent and received directly through Ably's infrastructure, ensuring low latency and reliability.

This model ensures that the secret API key is never exposed, making the application secure and scalable.

Tech Stack
Frontend (Extension):

HTML5, CSS3, JavaScript (ES6+)

Chrome Extension Manifest V3

Real-time Messaging:

Ably (for WebSocket communication, presence, and pub/sub messaging)

Backend (Authentication):

Node.js

Express.js (for the local server)

CORS

Local Setup and Installation
To run this project on your local machine, you will need to run two components: the Auth Server and the Chrome Extension.

Prerequisites
Node.js (which includes npm)

Google Chrome

An Ably account and API key.

Step 1: Clone the Repository
git clone [https://github.com/rohit2026y/watchmate.git](https://github.com/rohit2026y/watchmate.git)
cd watchmate

Step 2: Set Up the Authentication Server
The server's job is to securely provide authentication tokens to the extension.

Navigate to the server directory:

cd auth-server

Install dependencies:

npm install

Run the server:
You must provide your secret Ably API key as an environment variable when starting the server. Replace YOUR_SECRET_ABLY_KEY with your actual key.

ABLY_API_KEY='YOUR_SECRET_ABLY_KEY' node auth-server-local.js

The terminal should display: WatchMate Auth Server is running locally on http://localhost:3001. Keep this terminal window open.

Step 3: Load the Chrome Extension
Open Google Chrome and navigate to chrome://extensions.

Enable "Developer mode" using the toggle switch in the top-right corner.

Click the "Load unpacked" button.

Select the root watchmate folder (the one that contains manifest.json).

The "WatchMate 🎥💬 (Local Test)" extension should now appear in your list of extensions.

Step 4: Test It!
Make sure your local auth server is still running.

Navigate to any video on YouTube.

A modal should pop up asking you to enter a username.

Once you enter a username, the chat window will appear and connect to the chat room for that video.

Open the same YouTube video in a different Chrome window or profile to chat with yourself and test the real-time functionality.

Future Features
User Presence: Show a live count of users currently in the chat.

Live Reactions: Allow users to send floating emoji reactions over the video.

Typing Indicators: Show when another user is typing a message.

GIFs & Emojis: Integrate an emoji picker and GIF search.

Moderation Tools: Implement basic profanity filters and a user reporting system.

License
This project is licensed under the MIT License - see the [LICENSE](