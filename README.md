# WatchMate 🎥💬

A Chrome extension that enables real-time chat functionality for YouTube videos, allowing users to chat with others watching the same video simultaneously.

## Features

- **Real-time Chat**: Connect with other viewers watching the same YouTube video
- **Automatic Video Detection**: Automatically detects the current YouTube video and creates a dedicated chat room
- **Simple Interface**: Clean, minimal chat interface that overlays on YouTube pages
- **Instant Messaging**: Send and receive messages in real-time using Ably's messaging service

## How It Works

WatchMate creates a unique chat room for each YouTube video using the video ID. When you visit a YouTube video page, the extension:

1. Extracts the video ID from the URL
2. Connects to a dedicated Ably channel for that video
3. Displays a chat interface overlay on the page
4. Enables real-time messaging with other viewers
