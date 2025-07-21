// This script is injected into YouTube watch pages.

console.log("WatchMate content script loaded (Local Test Mode).");

// This now points to the server running on your Mac.
const AUTH_SERVER_URL = 'http://localhost:3001/auth';

let ably;
let channel;
let videoId;
let myUsername = null;

/**
 * --- Username Management ---
 */

// Function to get the username from storage or prompt the user for it.
function initializeUser() {
    chrome.storage.sync.get('watchmate_username', (data) => {
        if (data.watchmate_username) {
            myUsername = data.watchmate_username;
            console.log(`WatchMate: Welcome back, ${myUsername}`);
            // If the chat UI is already there, enable the input
            const input = document.getElementById('watchmate-message-input');
            if (input) input.disabled = false;
        } else {
            promptForUsername();
        }
    });
}

// Creates a modal overlay to ask for a username.
function promptForUsername() {
    // Disable chat input until username is set
    const input = document.getElementById('watchmate-message-input');
    if (input) input.disabled = true;

    const modal = document.createElement('div');
    modal.id = 'watchmate-username-modal';
    modal.innerHTML = `
        <div id="watchmate-username-modal-content">
            <h2>Welcome to WatchMate!</h2>
            <p>Please choose a username to start chatting.</p>
            <input type="text" id="watchmate-username-input" placeholder="Enter your username" maxlength="15">
            <button id="watchmate-username-submit">Start Chatting</button>
        </div>
    `;
    document.body.appendChild(modal);

    const usernameInput = document.getElementById('watchmate-username-input');
    const submitButton = document.getElementById('watchmate-username-submit');

    submitButton.addEventListener('click', saveUsername);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveUsername();
        }
    });
}

// Saves the chosen username and removes the modal.
function saveUsername() {
    const usernameInput = document.getElementById('watchmate-username-input');
    const chosenUsername = usernameInput.value.trim();
    if (chosenUsername) {
        myUsername = chosenUsername;
        chrome.storage.sync.set({ watchmate_username: myUsername }, () => {
            console.log(`WatchMate: Username set to ${myUsername}`);
            const modal = document.getElementById('watchmate-username-modal');
            if (modal) modal.remove();
            // Re-enable chat input
            const input = document.getElementById('watchmate-message-input');
            if (input) input.disabled = false;
            input.focus();
        });
    }
}


/**
 * --- Core Chat Functions ---
 */

function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
}

function createChatUI() {
    if (document.getElementById('watchmate-chat-container')) return;
    const chatContainer = document.createElement('div');
    chatContainer.id = 'watchmate-chat-container';
    chatContainer.innerHTML = `
        <div id="watchmate-header">
            <h3>WatchMate Chat 🎥💬</h3>
            <button id="watchmate-toggle-btn">-</button>
        </div>
        <div id="watchmate-body">
            <div id="watchmate-messages"></div>
            <div id="watchmate-input-area">
                <input type="text" id="watchmate-message-input" placeholder="Choose a username to chat..." disabled>
                <button id="watchmate-send-btn">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);
    document.getElementById('watchmate-send-btn').addEventListener('click', sendMessage);
    document.getElementById('watchmate-message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    const body = document.getElementById('watchmate-body');
    const toggleBtn = document.getElementById('watchmate-toggle-btn');
    toggleBtn.addEventListener('click', () => {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'flex' : 'none';
        toggleBtn.textContent = isHidden ? '-' : '+';
    });
}

function displayMessage(data) {
    const messagesDiv = document.getElementById('watchmate-messages');
    if (!messagesDiv) return;
    const msgElement = document.createElement('div');
    msgElement.classList.add('watchmate-message-wrapper');

    // Check if the message is from the current user
    if (data.username === myUsername) {
        msgElement.classList.add('my-message');
    }

    msgElement.innerHTML = `
        <div class="watchmate-username">${data.username || 'Anonymous'}</div>
        <div class="watchmate-message">${data.text}</div>
    `;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('watchmate-message-input');
    if (!input || input.disabled) return;
    const messageText = input.value.trim();
    if (messageText && channel && myUsername) {
        // Now we send the username along with the text
        channel.publish('message', { text: messageText, username: myUsername });
        input.value = '';
    }
}

function initializeAbly() {
    if (!videoId) {
        console.error("WatchMate: Video ID not found.");
        return;
    }
    
    ably = new Ably.Realtime({ authUrl: AUTH_SERVER_URL, authMethod: 'GET' });
    ably.connection.on('connected', () => console.log('WatchMate: Successfully connected to Ably via LOCAL server!'));
    ably.connection.on('failed', (error) => console.error('WatchMate: Ably connection failed.', error));
    channel = ably.channels.get(`watchmate-chat-${videoId}`);
    channel.subscribe('message', (message) => displayMessage(message.data));
}

function cleanup() {
    const oldChat = document.getElementById('watchmate-chat-container');
    if (oldChat) oldChat.remove();
    const oldModal = document.getElementById('watchmate-username-modal');
    if (oldModal) oldModal.remove();
    if (channel) channel.detach();
    if (ably && ably.connection.state === 'connected') ably.close();
}

function initializeApp() {
    cleanup();
    videoId = getVideoId();
    if (videoId) {
        createChatUI();
        initializeAbly();
        initializeUser(); // Get or prompt for username
    }
}

let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        initializeApp();
    }
}).observe(document.body, { subtree: true, childList: true });

initializeApp();
