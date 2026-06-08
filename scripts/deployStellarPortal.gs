/**
 * Amazing Grace One-Click Deployer
 */
function deployStellarPortal() {
  const filePath = 'index.html';
  const commitMessage = 'feat: deploy unified stellar glass portal';
  
  const portalHtml = getPortalContent();
  Logger.log('Initiating deployment of index.html to Amazing-Grace-Official...');
  
  const result = githubCommitFile_(filePath, portalHtml, commitMessage);
  
  if (result && result.success) {
    Logger.log('✔ SUCCESS! Stellar Glass Portal has been deployed live.');
    Logger.log('HTML URL: ' + result.url);
    Logger.log('Commit SHA: ' + result.sha);
  } else if (result) {
    Logger.log('❌ DEPLOYMENT FAILED: ' + result.error);
    if (result.data) {
      Logger.log('Raw response metadata: ' + JSON.stringify(result.data));
    }
  }
}

/**
 * Handles HTTP GET requests to trigger deployment via URL
 */
function doGet(e) {
  try {
    deployStellarPortal();
    return ContentService.createTextOutput("✔ SUCCESS! Stellar Glass Portal has been deployed live.");
  } catch (err) {
    return ContentService.createTextOutput("❌ DEPLOYMENT FAILED: " + err.message);
  }
}

/**
 * Hardened GitHub API Committer
 */
function githubCommitFile_(repoPath, content, commitMessage) {
  const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const REPO_OWNER = "NicholaiMadias"; // Hardcode
  const REPO_NAME = "Amazing-Grace-Official"; // Hardcode
  const BRANCH = "main";
  
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN script property is missing or not configured.");
  }

  const url = "https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME + "/contents/" + repoPath;
  
  // 1. Check if file exists to get current SHA
  let fileSha = null;
  
  const getOptions = {
    "method": "get",
    "headers": {
      "Authorization": "Bearer " + GITHUB_TOKEN,
      "Accept": "application/vnd.github.v3+json"
    },
    "muteHttpExceptions": true
  };
  
  Logger.log("Fetching current file status: " + url);
  const getResponse = UrlFetchApp.fetch(url + "?ref=" + BRANCH, getOptions);
  const getCode = getResponse.getResponseCode();
  
  if (getCode === 200) {
    const fileData = JSON.parse(getResponse.getContentText());
    fileSha = fileData.sha;
    Logger.log("Existing file found. SHA: " + fileSha);
  } else if (getCode === 404) {
    Logger.log("No existing file found. Creating a new one.");
  } else {
    throw new Error("Failed to check file existence. Status: " + getCode + ", Response: " + getResponse.getContentText());
  }

  // 2. Prepare the payload
  const payload = {
    "message": commitMessage,
    "content": Utilities.base64Encode(Utilities.newBlob(content).getBytes()), // UTF-8 safe encoding
    "branch": BRANCH
  };
  
  if (fileSha) {
    payload["sha"] = fileSha;
  }
  
  const options = {
    "method": "put",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + GITHUB_TOKEN,
      "Accept": "application/vnd.github.v3+json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  Logger.log("Submitting commit payload to GitHub...");
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseData = JSON.parse(response.getContentText());

  if (responseCode === 200 || responseCode === 201) {
    return {
      success: true,
      url: responseData.content.html_url,
      sha: responseData.commit.sha
    };
  } else {
    return {
      success: false,
      error: responseData.message,
      data: responseData
    };
  }
}

/**
 * Returns the HTML content of the Stellar Glass Portal redirect card
 */
function getPortalContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus HUD Redirect</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #030712;
      color: #f3f4f6;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    
    .redirect-card {
      background-color: #111827;
      border: 1px solid #1f2937;
      border-radius: 0.75rem;
      padding: 2.5rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 10;
    }
    
    .btn {
      display: inline-block;
      margin-top: 1.5rem;
      background-color: #3b82f6;
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="redirect-card">
    <h1 style="color: #60a5fa; margin: 0 0 1rem; letter-spacing: 2px;">NEXUS HUD INTEGRATION COMPLETE</h1>
    <p style="color: #94a3b8; margin: 0; max-width: 400px; line-height: 1.6;">The sub-modules have been successfully migrated into the central Matrix.</p>
    <a href="./arcade/" class="btn">Enter the Unified Matrix</a>
  </div>
</body>
</html>`;
}
