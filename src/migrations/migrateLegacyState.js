/**
 * migrateLegacyState.js
 * Convert legacy Matrix of Conscience save fields to Janus-Weave schema.
 *
 * ES module version.
 */

/**
 * Migrate legacy save state into the Janus-Weave schema.
 *
 * Legacy -> New mapping:
 * - corruption        -> scarletGrowth (0..1)
 * - wisdom            -> whiteClarity (0..1)
 * - integrity         -> janus.stability (0..1)
 * - community         -> convergencePotential (0..1)
 *
 * Any missing legacy fields are replaced with sensible defaults.
 *
 * @param {Object} legacy - The legacy save object.
 * @param {number} [legacy.corruption] - 0..100
 * @param {number} [legacy.wisdom] - 0..100
 * @param {number} [legacy.integrity] - 0..100
 * @param {number} [legacy.community] - 0..100
 * @returns {Object} migrated - New Janus-Weave compatible state.
 * @returns {number} migrated.scarletGrowth - 0..1
 * @returns {number} migrated.whiteClarity - 0..1
 * @returns {Object} migrated.janus - Janus substate
 * @returns {number} migrated.janus.stability - 0..1
 * @returns {number} migrated.convergencePotential - 0..1
 */
export function migrateLegacyState(legacy = {}) {
  const clamp01 = (v) => {
    if (typeof v !== 'number' || Number.isNaN(v)) return 0;
    return Math.max(0, Math.min(1, v / 100));
  };

  const scarletGrowth = clamp01(legacy.corruption);
  const whiteClarity = clamp01(legacy.wisdom);
  const janusStability = clamp01(legacy.integrity);
  const convergencePotential = clamp01(legacy.community);

  return {
    scarletGrowth,
    whiteClarity,
    janus: {
      stability: janusStability,
      // preserved / computed fields for backward compatibility
      lastMigrationAt: Date.now()
    },
    convergencePotential
  };
}
