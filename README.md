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

## Installation

### For Development

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd WatchMate
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the WatchMate directory

5. The extension should now appear in your extensions list and be active

### For Users

1. Download the extension from the Chrome Web Store (when published)
2. Install the extension
3. Visit any YouTube video page
4. The chat interface will automatically appear

## Usage

1. **Activate**: The extension automatically activates when you visit a YouTube video page
2. **Chat**: A chat box will appear in the bottom-right corner of the page
3. **Send Messages**: Type your message and press Enter to send
4. **View Messages**: See messages from other viewers in real-time

## Project Structure

```
WatchMate/
├── manifest.json          # Chrome extension manifest
├── content-script.js      # Content script that injects the chat functionality
├── injected.js           # Main chat logic and UI
├── ably.min.js          # Ably real-time messaging library
├── popup.html           # Extension popup interface
├── icon.png            # Extension icon
└── README.md           # This file
```

## Technical Details

### Dependencies

- **Ably Realtime**: Real-time messaging service for chat functionality
- **Chrome Extension APIs**: For browser integration

### Key Components

- **Content Script**: Injects the necessary scripts into YouTube pages
- **Injected Script**: Handles the chat UI and Ably integration
- **Ably Integration**: Manages real-time messaging channels

### Architecture

The extension uses a three-tier injection system:
1. `content-script.js` loads first and injects the Ably library
2. Once Ably is loaded, it injects `injected.js`
3. `injected.js` creates the chat interface and handles messaging

## Configuration

### Ably API Key

The extension currently uses a hardcoded Ably API key. For production use, you should:

1. Replace the API key in `injected.js` with your own Ably key
2. Consider implementing a more secure key management system

```javascript
// In injected.js, line 8
const ably = new Ably.Realtime({
    key: "YOUR_ABLY_API_KEY_HERE",
    clientId: clientId,
});
```

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of JavaScript and Chrome Extensions

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the WatchMate extension
4. Test your changes on YouTube video pages

### Building for Production

1. Update the version in `manifest.json`
2. Replace the Ably API key with a production key
3. Test thoroughly on different YouTube pages
4. Package the extension for distribution

## Browser Compatibility

- **Chrome**: Full support (manifest v3)
- **Edge**: Compatible (Chromium-based)
- **Firefox**: May require manifest v2 conversion
- **Safari**: Not supported (different extension format)

## Privacy & Security

- **No Personal Data**: The extension doesn't collect or store personal information
- **Anonymous Chat**: Users are identified by randomly generated IDs
- **Video-Specific**: Chat rooms are isolated by video ID
- **Real-time Only**: Messages are not stored permanently

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/rohit2026y/WatchMate/issues) page
2. Create a new issue with detailed information
3. Include browser version, extension version, and steps to reproduce

## Roadmap

- [ ] User authentication
- [ ] Message history
- [ ] Emoji support
- [ ] File sharing
- [ ] Voice messages
- [ ] Custom themes
- [ ] Moderation tools

---

**Note**: This extension is for educational and entertainment purposes. Please respect YouTube's terms of service and community guidelines when using the chat feature. 
