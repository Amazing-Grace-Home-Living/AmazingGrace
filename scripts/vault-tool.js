Javascript
import https from 'https';

/**
 * Syncs a new secret version to the Key Matrix via the Nexus Relay.
 * @param {string} feature - The feature ID (Gemini, Firebase, Master).
 * @param {string} secretValue - The raw sensitive key string.
 */
async function syncSecretToMatrix(feature, secretValue) {
  const relayUrl = process.env.NEXUS_RELAY_URL; // Your Apps Script Web App URL
  const authKey = process.env.VAULT_ACCESS_KEY; // Managed via your local system keychain

  if (!relayUrl || !authKey) {
    console.error("Error: NEXUS_RELAY_URL or VAULT_ACCESS_KEY environment variables are not set.");
    process.exit(1);
  }

  const payload = JSON.stringify({
    action: 'update_matrix',
    feature: feature,
    value: secretValue,
    authKey: authKey, // Passing as payload property to ensure delivery to Apps Script
    timestamp: new Date().toISOString()
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(relayUrl, options, (res) => {
    console.log(`Vault Sync Status: ${res.statusCode}`);
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      console.log('Response:', responseData);
    });
  });

  req.on('error', (e) => console.error(`Vault Sync Failure: ${e.message}`));
  req.write(payload);
  req.end();
}

// Execution logic for the CLI using process.argv
const feature = process.argv[2];
const key = process.argv[3];

if (feature && key) {
  console.log(`Locking ${feature} secret into the Vault...`);
  syncSecretToMatrix(feature, key);
} else {
  console.error("Usage: npm run sync-key -- [FeatureName] [SecretValue]");
}
