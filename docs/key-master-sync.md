# Key Master Sync

This document describes the Google Apps Script (`scripts/keyMaster`) that was used
to synchronise Key Master secret files into the Amazing-Grace repository.

The script was not executable in the repository context and has been archived here
for reference only. It should be run from a Google Apps Script project, not from
this repository.

## Script Overview

The `syncToAmazingGrace()` function:

1. Fetches a GitHub Personal Access Token (PAT) from the Key Master deployment
   at the configured `keyMasterUrl`.
2. Retrieves the contents of `Code.gs` and `keyMaster.gs` from the bound Apps
   Script project.
3. Pushes each file to `NicholaiMadias/Amazing-Grace/scripts/` via the GitHub
   Contents API, creating or updating as appropriate.

## Configuration

| Variable | Description |
|---|---|
| `repoOwner` | `NicholaiMadias` |
| `repoName` | `Amazing-Grace` |
| `branch` | `main` |
| `keyMasterUrl` | Google Apps Script deployment URL that returns the PAT for key `GH_PAT_NEXUS` |

## Usage

1. Open the bound Google Apps Script project for the Key Master deployment.
2. Run `syncToAmazingGrace()` manually or schedule it as a time-driven trigger.
3. Verify the sync in the Apps Script execution log.

> **Security note:** The PAT retrieved from Key Master must have `contents:write`
> scope for the target repository. Never hard-code tokens in script source.

## Original Source

```javascript
/**
 * Syncs Key Master files to the Amazing-Grace repository.
 */
function syncToAmazingGrace() {
  const repoOwner = "NicholaiMadias";
  const repoName = "Amazing-Grace";
  const branch = "main";
  const keyMasterUrl = "https://script.google.com/macros/s/AKfycbzWEsHB_RfrnHr2z83vHlpaZrXbaCxhtYHb4b0Afbo01Wqwe0oXlWPatHwsRiQWLz0/exec";

  // 1. Get the PAT from your Version 5 Deployment
  const secretResponse = UrlFetchApp.fetch(`${keyMasterUrl}?keyId=GH_PAT_NEXUS`);
  const githubToken = secretResponse.getContentText().trim();

  // 2. Prepare the files to push
  const files = [
    { name: "Code.gs", content: Scripts.getResource("Code").getContent() },
    { name: "keyMaster.gs", content: Scripts.getResource("keyMaster").getContent() }
  ];

  files.forEach(file => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/scripts/${file.name}`;

    // Check if the file exists to get its 'sha' (required for updates)
    let sha = "";
    try {
      const checkRes = UrlFetchApp.fetch(url, {
        "headers": { "Authorization": "token " + githubToken }
      });
      sha = JSON.parse(checkRes.getContentText()).sha;
    } catch (e) { /* File doesn't exist yet, proceeding as new */ }

    const payload = {
      "message": "⚡ Automated Sync: Key Master v5 update",
      "content": Utilities.base64Encode(file.content),
      "branch": branch,
      "sha": sha
    };

    const options = {
      "method": "put",
      "contentType": "application/json",
      "headers": { "Authorization": "token " + githubToken },
      "payload": JSON.stringify(payload)
    };

    try {
      UrlFetchApp.fetch(url, options);
      Logger.log(`✅ Synced ${file.name} to Amazing-Grace/scripts/`);
    } catch (e) {
      Logger.log(`❌ Failed ${file.name}: ` + e.message);
    }
  });
}
```
