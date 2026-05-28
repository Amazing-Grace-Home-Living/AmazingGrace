/**
 * migrateLegacyState.js
 * (c) 2026 NicholaiMadias — MIT License
 * 
 * Maps legacy Matrix of Conscience stats to the new Janus-Weave Duality Engine schema.
 */

export function migrateLegacyState(oldState = {}) {
  const defaults = {
    corruption: 0,
    wisdom: 0,
    integrity: 0,
    community: 0
  };

  const state = { ...defaults, ...oldState };
  /**
   * Convert legacy percent-like values (0-100) into normalized decimals (0-1).
   * Invalid inputs return 0 and valid values are clamped to bounds.
   * @param {unknown} value
   * @returns {number}
   */
  const percentToNormalizedDecimal = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const normalized = numeric / 100;
    return Math.min(1, Math.max(0, normalized));
  };

  return {
    scarletGrowth: percentToNormalizedDecimal(state.corruption),
    whiteClarity: percentToNormalizedDecimal(state.wisdom),
    janus: {
      stability: percentToNormalizedDecimal(state.integrity)
    },
    convergencePotential: percentToNormalizedDecimal(state.community)
  };
}
