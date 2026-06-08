// Save and load settings for the extension options page

const apiKeyInput = document.getElementById("apiKey");
const hostUrlInput = document.getElementById("hostUrl");
const saveBtn = document.getElementById("save");
const statusDiv = document.getElementById("status");

// Load saved settings
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({
    apiKey: "",
    hostUrl: "https://amazing-grace-hl-bbeaa.web.app"
  }, (items) => {
    apiKeyInput.value = items.apiKey;
    hostUrlInput.value = items.hostUrl;
  });
});

// Save settings
saveBtn.addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();
  const hostUrl = hostUrlInput.value.trim();

  chrome.storage.sync.set({
    apiKey,
    hostUrl
  }, () => {
    statusDiv.className = "success";
    statusDiv.textContent = "CONFIGURATION SAVED";
    setTimeout(() => {
      statusDiv.textContent = "";
    }, 2000);
  });
});
