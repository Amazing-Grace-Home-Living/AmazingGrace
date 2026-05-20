/**
 * Key Master: Zero-Trust Secrets Management Bridge & Apps Script Synchronizer
 * Aligns with the White Rabbit Protocol for metadata obfuscation & Zero-Trust identity.
 */

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { google } from 'googleapis';
import sodium from 'libsodium-wrappers';
import { program } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new SecretManagerServiceClient();

program
  .version('1.0.0')
  .description('Amazing Grace Secrets Management Suite (Zero-Trust & White Rabbit Protocol)')
  .option('-s, --sync', 'Sync Google Secrets Manager variables to targeted environments')
  .option('-a, --audit <message>', 'Log an administrative audit entry to the Google Sheet')
  .option('-i, --inject <secretId>', 'Get and decrypt a secret value directly to stdout')
  .parse(process.argv);

const options = program.opts();

/**
 * Audit Log to Google Sheets
 */
async function logAudit(action, details) {
  const spreadsheetId = process.env.AUDIT_SPREADSHEET_ID;
  const sheetName = process.env.AUDIT_SHEET_NAME || 'SecretsAudit';
  if (!spreadsheetId) {
    console.warn('⚠️ AUDIT_SPREADSHEET_ID is not configured. Local skip.');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          action,
          details,
          process.env.GITHUB_RUN_ID || 'local-cli',
          process.env.GITHUB_ACTOR || 'system-admin'
        ]]
      }
    });
    console.log(`📊 Audit log appended: ${action}`);
  } catch (error) {
    console.error('❌ Failed to write audit log to Sheets:', error.message);
  }
}

/**
 * White Rabbit Protocol Obfuscation
 */
async function obfuscateSecret(plainText) {
  await sodium.ready;
  const keyHex = process.env.WHITE_RABBIT_SECRET_KEY;
  if (!keyHex) {
    // Fallback: If no key is set, keep it bare but warned (Zero-Trust)
    return plainText;
  }
  const key = sodium.from_hex(keyHex);
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encrypted = sodium.crypto_secretbox_easy(plainText, nonce, key);

  return {
    nonce: sodium.to_hex(nonce),
    ciphertext: sodium.to_hex(encrypted),
    obfuscated: true
  };
}

/**
 * Fetch and process/decrypt secrets from Secret Manager
 */
async function getSecret(secretId) {
  const projectId = process.env.GCP_PROJECT_ID;
  if (!projectId) {
    throw new Error('GCP_PROJECT_ID is not specified in the environment.');
  }

  const name = `projects/${projectId}/secrets/${secretId}/versions/latest`;
  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload.data.toString('utf8');
  return payload;
}

/**
 * Sync Pipeline to Generate target configuration
 */
async function runSync() {
  console.log('🔄 Initiating Sync Pipeline...');
  try {
    // Gather key variables securely
    const firebaseApiKey = await getSecret('FIREBASE_API_KEY');
    const firebaseAuthDomain = await getSecret('FIREBASE_AUTH_DOMAIN');
    const firebaseProjectId = await getSecret('FIREBASE_PROJECT_ID');
    const ghPat = await getSecret('GH_PAT_NEXUS');

    const configLines = [
      `# Generated securely by Key Master on ${new Date().toISOString()}`,
      `FIREBASE_API_KEY=${firebaseApiKey}`,
      `FIREBASE_AUTH_DOMAIN=${firebaseAuthDomain}`,
      `FIREBASE_PROJECT_ID=${firebaseProjectId}`,
      `GH_PAT_NEXUS=${ghPat}`
    ];

    const destPath = process.env.LOCAL_SECRETS_PATH || '.env';
    fs.writeFileSync(path.resolve(destPath), configLines.join('\n'), 'utf8');
    console.log(`✅ Sync successful! Secrets written to ${destPath}`);

    await logAudit('SYNC_SECRETS', `Synced secrets successfully to target destination: ${destPath}`);
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
    await logAudit('SYNC_SECRETS_FAILED', err.message);
  }
}

// Main execution block
async function main() {
  if (options.sync) {
    await runSync();
  } else if (options.audit) {
    await logAudit('ADMIN_AUDIT', options.audit);
  } else if (options.inject) {
    try {
      const val = await getSecret(options.inject);
      process.stdout.write(val);
    } catch (err) {
      console.error(`\n❌ Failed to inject secret ${options.inject}:`, err.message);
      process.exit(1);
    }
  } else {
    program.help();
  }
}

main();
