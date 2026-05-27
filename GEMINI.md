# Gemini CLI — Nexus Operations

## Game Maintenance
- **Star Matrix:** Match-3 puzzle using `js/matchmaker.js`.
  - Mapping: `heart` → `supernova`, `star` → `shooting`, `cross` → `gem`, `flame` → `rank`, `drop` → `cosmic`.
- **Matrix of Conscience:** Advanced Match-3 with Seven Calibration Levels.

## Workflows
- **Ella:** Unified operations for review suggestions and automated patches.
  - Marker: `<!-- ella:apply -->` in a review body triggers a full repo diff apply via `scripts/ella-auto-apply-review.js`.
  - Marker: ` ```suggestion` in a comment applies inline suggestions.
- **Firebase:** Build, validate, and deploy to Hosting.
  - Automatically triggered on push to `main`.
- **Sync Secrets:** repository_dispatch `key_rotation_event` updates GitHub secrets via `sync-secrets-from-matrix.yml`.

## Firebase Configuration
- Root: `.`
- Project: `amazing-grace-hl-bbeaa`
- Backend: `limitlessnexus` (App Hosting)

## Key Master Integration
- Secrets: `SOVEREIGN_API_KEY`, `GOOGLE_GENAI_API_KEY`, `keyMaster`.
- Sync tool: `npm run sync-key -- [FeatureName] [SecretValue]`.

## Debugging Checklist
1. Check `js/matchmaker.js` for core engine logic (pure functions).
2. Check `index.html` (within game directory) for theme-specific mapping and UI wiring.
3. Ensure ES module imports are relative and correct.
4. Verify `isProcessing` flag is reset correctly to avoid UI soft-locks.
5. In module scripts, use `addEventListener` for DOM events as functions are not global.
