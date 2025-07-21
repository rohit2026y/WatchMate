// This script is injected into YouTube watch pages.

console.log("WatchMate content script loaded (Local Test Mode).");

// This now points to the server running on your Mac.
const AUTH_SERVER_URL = 'http://localhost:3001/auth';

let ably;
let channel;
let videoId;

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
                <input type="text" id="watchmate-message-input" placeholder="Say something...">
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
    msgElement.classList.add('watchmate-message');
    msgElement.textContent = data.text;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('watchmate-message-input');
    if (!input) return;
    const messageText = input.value.trim();
    if (messageText && channel) {
        channel.publish('message', { text: messageText });
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
    if (channel) channel.detach();
    if (ably && ably.connection.state === 'connected') ably.close();
}

function initializeApp() {
    cleanup();
    videoId = getVideoId();
    if (videoId) {
        createChatUI();
        initializeAbly();
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
