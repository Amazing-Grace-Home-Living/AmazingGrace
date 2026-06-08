// Background service worker for Antigravity Nexus Companion
chrome.runtime.onInstalled.addListener(() => {
  console.log("Antigravity Nexus Companion service worker registered.");
  
  // Set default configuration
  chrome.storage.sync.get(["hostUrl"], (result) => {
    if (!result.hostUrl) {
      chrome.storage.sync.set({
        hostUrl: "https://amazing-grace-hl-bbeaa.web.app"
      }, () => {
        console.log("Default host URL configured: https://amazing-grace-hl-bbeaa.web.app");
      });
    }
  });
});
