# 🔑 Key Master - Zero-Trust Secrets Management Suite

Welcome to **Key Master**, the authoritative solution for managing tokens, Firebase credentials, passwords, and secrets across the Amazing Grace project ecosystem.

Key Master aligns perfectly with our Zero-Trust Identity model, utilizes the **White Rabbit Protocol** for cryptographically obfuscating metadata and payload transmission, and bridges Google Secrets Manager, GitHub Actions pipelines, Google Sheets (for auditable logs), and your local environments securely.

---

## Architectural Principles

1. **Zero-Trust Identity**: Credentials are never hardcoded, persisted as raw secrets in the repository, or distributed in plain text.
2. **White Rabbit Protocol Obfuscation**: Cryptographic structures mask runtime configuration metadata during handshakes using asymmetric/symmetric authenticated packaging (`libsodium`).
3. **Dual Apps-Script/Node Bridge**: Built natively to interact both with automated background pipelines (Node/GitHub Actions) and directly on client environments such as Google Sheets scripts.
4. **Single Source of Truth**: Driven centralized via Google Secret Manager, synced to Edge configurations (Netlify, Cloudflare, GitHub secrets).

---

## Workspace Layout
```
key-master/
├── package.json          # Dependencies and script routines
├── index.js              # Command Line Interface / background automation script
├── .env.example          # Sample environment template
└── README.md             # This structural manual
```

---

## Getting Started

### 1. Installation
Install secure cryptographic and synchronization dependencies:
```bash
cd key-master
npm install
```

### 2. Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Ensure that your `GCP_PROJECT_ID` matches your Google Cloud Platform project name and specify the `WHITE_RABBIT_SECRET_KEY` hex for metadata signing.

### 3. Usage & Synchronization Methods

Our background tool can run in several modes depending on the delivery phase:

*   **Secure Synchronize** (Pull latest Cloud secrets into specified environment):
	```bash
	npm run sync
	```
	This securely connects with Google Secret Manager, fetches variables such as `FIREBASE_API_KEY`, and generates the target secure transient profile (like `.env`).

*   **Interactive / Inline Secret Injection**:
	```bash
	node index.js --inject FIREBASE_API_KEY
	```

*   **Auditable Tracking Logging**:
	Add structural audits directly to your centralized Sheets tracking ledger:
	```bash
	npm run audit -- "Rotated production deployment secrets"
	```

---

## Integration Reference

### 1. GitHub Actions (CI/CD Pipeline)
Integrate Key Master natively in your workflows to dynamic inject configuration:
```yaml
- name: Inject Secrets via Key Master
  run: |
	cd key-master
	npm ci
	node index.js --sync
  env:
	GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
	GCP_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GCP_SA_KEY }}
	WHITE_RABBIT_SECRET_KEY: ${{ secrets.WHITE_RABBIT_SECRET_KEY }}
```

### 2. Google Apps Script Cross-Sync
In your Google App Scripts spreadsheet project, reference/include the `scripts/GitHub_token.gs` and `scripts/keyMaster` templates to securely cross-authenticate spreadsheet events to GitHub and update pipeline targets.
