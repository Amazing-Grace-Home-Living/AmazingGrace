# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration, deployment, and automated operations.

## Workflows

### 1. Deploy (`deploy.yml`)
**Purpose:** Builds and deploys the site to GitHub Pages.

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Validation Steps:**
- Runs all tests with `npm test -- --passWithNoTests`
- TypeScript type checking with `npm run typecheck`
- Verifies critical pages exist (index, arcade, stories, manifest)
- Checks for placeholder content (lorem ipsum, todo, placeholder text)
- Validates all internal navigation and asset links

**Deployment:** GitHub Pages via `actions/deploy-pages@v5`

### 2. Firebase (`firebase.yml`)
**Purpose:** Builds, validates, and deploys to Firebase Hosting.

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Validation Steps:** Same as deploy.yml workflow

**Deployment:** Firebase Hosting (amazing-grace-hl-bbeaa project)

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT_AMAZING_GRACE_HL_BBEAA` - Firebase service account credentials

**Note:** If this secret is missing, the deployment will fail with error:
```
Error: Input required and not supplied: firebaseServiceAccount
```

To obtain this secret:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the `amazing-grace-hl-bbeaa` project
3. Go to Project Settings → Service Accounts
4. Generate a new private key (JSON)
5. Add the JSON content as a GitHub repository secret with the name above

### 3. Ella — Unified Operations (`ella.yml`)
**Purpose:** Automated PR review suggestion application.

**Triggers:**
- Pull request review submitted
- Manual workflow dispatch

**Features:**
- Automatically applies code suggestions from PR reviews
- Looks for ` ```suggestion` code blocks in review comments
- Commits and pushes changes back to the PR branch

### 4. Sync Secrets from Matrix (`sync-secrets-from-matrix.yml`)
**Purpose:** Updates GitHub Actions secrets via repository_dispatch events.

**Trigger:** `key_rotation_event` repository_dispatch

## Workflow Philosophy

### Validation Strategy
Both deployment workflows (GitHub Pages and Firebase) use identical validation steps to ensure:
- **Quality:** All tests pass and TypeScript compiles without errors
- **Completeness:** Critical pages are built and present
- **Professionalism:** No placeholder content makes it to production
- **Integrity:** All internal links resolve correctly

### Link Validation
The `scripts/validate-dist-links.mjs` script:
- Walks all HTML files in `dist/`
- Extracts `href` and `src` attributes
- Verifies each internal reference resolves (as file or directory with index.html)
- Handles relative and absolute paths
- Checks HTML files, JS, CSS, images, audio, video, and other assets
- **Blocks deployment** if broken links are found

This prevents "broken games" and other navigation issues from reaching production.

### Arcade Game Protection
While we don't have game-specific integration tests yet, the link validation step catches:
- Missing game assets (images, audio, scripts)
- Broken navigation links within games
- Missing game entry points

**Future Enhancement:** Add smoke tests that verify each arcade game loads without errors.

## Maintenance

### Adding New Games
When adding a new arcade game:
1. Add the game's `index.html` to `vite.config.ts` rollupOptions.input
2. Ensure all game assets use relative paths (`./` or `../`)
3. Test locally with `npm run build` and `node scripts/validate-dist-links.mjs`
4. Games should not reference external assets that aren't in the repository

### Updating Workflows
When modifying workflows:
- Keep validation steps in sync between `deploy.yml` and `firebase.yml`
- Test changes in a PR before merging to main
- Document any new required secrets or environment variables

### Troubleshooting

**Firebase deployment fails:**
- Check that `FIREBASE_SERVICE_ACCOUNT_AMAZING_GRACE_HL_BBEAA` secret is set
- Verify the secret contains valid JSON credentials
- Ensure the service account has Firebase Hosting permissions

**Link validation fails:**
- Run `npm run build && node scripts/validate-dist-links.mjs` locally
- Check the error output for specific broken references
- Common causes: missing vite.config.ts entry, incorrect relative paths, external dependencies

**Tests fail:**
- Run `npm test` locally to reproduce
- Check for environment-specific issues (paths, timezones, etc.)
- Ensure all dependencies are in package.json

## Related Documentation
- [Firebase Configuration](../../README.md#firebase-configuration)
- [Build Configuration](../../vite.config.ts)
- [Arcade Structure](../../arcade/README.md)
