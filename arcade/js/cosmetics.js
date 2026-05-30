/**
 * cosmetics.js — Rebellion OS Cosmetic Definitions
 * Defines all unlockable cosmetics and their unlock conditions.
 */

const COSMETICS = [
  {
    id: "theme_neon",
    type: "uiTheme",
    name: "Neon Flux",
    unlock: { stars: { starMatrix: 2 } },
  },
  {
    id: "theme_synth",
    type: "uiTheme",
    name: "Synthwave Horizon",
    unlock: { threatBelow: 40 },
  },
  {
    id: "tower_quantum",
    type: "towerSkin",
    name: "Quantum Turret",
    unlock: { items: { quantumCore: 2 } },
  },
  {
    id: "tower_spectral",
    type: "towerSkin",
    name: "Spectral Prism Tower",
    unlock: { items: { spectralKey: 2 } },
  },
  {
    id: "tower_ultra",
    type: "towerSkin",
    name: "Ultra Siege Cannon",
    unlock: { stars: { syndicateSiege: 3 } },
  },
  {
    id: "sm_runes",
    type: "starMatrixSkin",
    name: "Runic Symbols",
    unlock: { stars: { starMatrix: 3 } },
  },
  {
    id: "qsstreamblue",
    type: "quantumStreamSkin",
    name: "Azure Stream",
    unlock: { stars: { quantumShift: 2 } },
  },
  {
    id: "lgfilterpurple",
    type: "lookingGlassFilter",
    name: "Violet Spectral Filter",
    unlock: { stars: { lookingGlass: 2 } },
  },
];
