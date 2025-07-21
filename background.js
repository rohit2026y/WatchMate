// background.js

// This script runs in the background of the extension.
// For this version, its main job is to listen for the extension's installation
// and potentially set up any initial configurations.

chrome.runtime.onInstalled.addListener(() => {
  console.log('WatchMate extension installed.');
  // You could set default values in chrome.storage here if needed.
  // For example:
  // chrome.storage.sync.set({ enabled: true });
});

// Listen for messages from content scripts if needed for more complex features.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabId") {
        sendResponse({ tabId: sender.tab.id });
    }
    // Return true to indicate you wish to send a response asynchronously
    return true; 
});
