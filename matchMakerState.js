/**
 * matchMakerState.js — Proxy for the canonical Match-3 engine.
 * (c) 2026 NicholaiMadias — MIT License
 */

import { findMatchesGrouped } from './js/matchmaker.js';
export * from './js/matchmaker.js';

// Legacy compatibility: return grouped matches by default
export { findMatchesGrouped as findMatches };
