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
  const toNormalizedPercent = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const normalized = numeric / 100;
    return Math.min(1, Math.max(0, normalized));
  };

  return {
    scarletGrowth: toNormalizedPercent(state.corruption),
    whiteClarity: toNormalizedPercent(state.wisdom),
    janus: {
      stability: toNormalizedPercent(state.integrity)
    },
    convergencePotential: toNormalizedPercent(state.community)
  };
}
