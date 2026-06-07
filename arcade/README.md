# Sovereign Arcade Grid

The Sovereign Arcade Grid is a unified metaphysical simulation environment, hosting a variety of 2D and 3D modules ranging from agent telemetry visualization to sacred studies.

## Core Modules

- **Matrix of Conscience (3D)**: High-fidelity R3F isometric simulation sandbox.
- **Nexus Defense (2D)**: Tactical network integrity minigame.
- **Syndicate Siege**: Elite Rebellion OS tower defense.
- **Star Matrix**: Cosmic match-3 alignment engine.
- **Trinity Core**: soul-value calibration trial.
- **Lore Archive**: Classified historical data logs.
- **Seven Stars**: Ascension ladder virtue study.
- **Holy Bible Study**: Sacred scriptures interactive learning.

## Architecture

Most arcade modules follow a **Standalone Default** pattern:
- Entry point: `arcade/[module-name]/index.html`
- Logic: `arcade/[module-name]/main.tsx` (React) or `arcade/[module-name]/js/game.js` (Vanilla)
- Styling: Scoped CSS within the module directory.
