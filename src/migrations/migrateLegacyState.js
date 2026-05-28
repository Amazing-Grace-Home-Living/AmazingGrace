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

  return {
    scarletGrowth: state.corruption / 100,
    whiteClarity: state.wisdom / 100,
    janus: {
      stability: state.integrity / 100
    },
    convergencePotential: state.community / 100
  };
}
