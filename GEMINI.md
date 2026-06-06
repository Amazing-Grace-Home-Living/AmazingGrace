# Gemini CLI — Nexus Operations

## Game Maintenance
- **Star Matrix:** Match-3 puzzle using `js/matchmaker.js`.
  - Mapping: `heart` → `supernova`, `star` → `shooting`, `cross` → `gem`, `flame` → `rank`, `drop` → `cosmic`.
- **Janus Continuum:** The successor to the Matrix of Conscience. A dual-phase metaphysical engine.
  - Core: `arcade/janus/js/JanusWeaveCore.js`.
  - Physics: Identity Gravity, Recursive Momentum, Harmonic Inversion, Prophetic Causality.
  - UI: Psionic glyph dialogue and fractal rendering.
  - **State Migration:** Legacy Matrix states are auto-converted via `src/migrations/migrateLegacyState.js`.
    - `corruption` → `scarletGrowth` (Momentum)
    - `wisdom` → `whiteClarity` (Inversion)
    - `integrity` → `janusStability` (Gravity)
    - `community` → `convergencePotential` (Causality)
## Arcade Architecture (Standalone Default)
- **Standalone Subsystems**: All new Arcade games and Nexus interfaces must be built as standalone React applications using Vite, rather than inline vanilla JS scripts.
- **Entry Points**: Each subsystem must have its own `arcade/<subsystem-name>/index.html` and a `.tsx`/`.jsx` module entrypoint (e.g. `main.tsx`).
- **Module Enforced**: The `index.html` MUST use `<script type="module" src="./main.tsx"></script>` to load the app.
- **Vite Configuration**: Always register new subsystems in `vite.config.ts` under `build.rollupOptions.input`.
- **Global Context**: Utilize `ConscienceProvider` (or similar top-level providers) to synchronize global state across iframe/window boundaries.

## Workflows
- **Ella:** Unified operations for review suggestions and automated patches.
  - Marker: `<!-- ella:apply -->` in a review body triggers a full repo diff apply via `scripts/ella-auto-apply-review.js`.
- **System Auditing:** Professional PowerShell maintenance suite.
  - `SystemHealthAudit.ps1`: Monitors disk space and critical service states (WinRM, W32Time).
  - `RepositoryIndexer.ps1`: Generates structural Data Matrices (CSV) and JSON manifests of project assets.
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
