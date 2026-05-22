/**
 * arcade/matchMakerState.js — Proxy for the canonical Match-3 engine.
 * (c) 2026 NicholaiMadias — MIT License
 */

import {
  createInitialGrid as createGrid,
  canSwap,
  applySwap,
  findMatchesGrouped,
  applyGravity
} from '../js/matchmaker.js';

// Legacy compatibility for arcade UI
export const GRID_SIZE = 7;
export { createGrid as createInitialGrid };
export { canSwap };
export function swapGems(grid, r1, c1, r2, c2) {
  return applySwap(grid, r1, c1, r2, c2);
}
export { findMatchesGrouped as findMatches };
export { applyGravity };
