/**
 * tests/migrations.spec.js
 * Unit tests for legacy → Janus state migration mappings.
 */

import { describe, test, expect } from 'vitest';
import { migrateLegacyState } from '../src/migrations/migrateLegacyState.js';

describe('Legacy state migration', () => {
  test('maps old fields to new schema correctly', () => {
    const old = {
      corruption: 42,
      wisdom: 88,
      integrity: 75,
      community: 60
    };

    const migrated = migrateLegacyState(old);

    expect(migrated).toHaveProperty('scarletGrowth');
    expect(migrated).toHaveProperty('whiteClarity');
    expect(migrated).toHaveProperty('janus');
    expect(migrated).toHaveProperty('convergencePotential');

    expect(migrated.scarletGrowth).toBeCloseTo(0.42, 5);
    expect(migrated.whiteClarity).toBeCloseTo(0.88, 5);
    expect(migrated.janus.stability).toBeCloseTo(0.75, 5);
    expect(migrated.convergencePotential).toBeCloseTo(0.60, 5);
  });

  test('ignores missing legacy fields and uses defaults', () => {
    const old = { corruption: 10 }; // partial
    const migrated = migrateLegacyState(old);

    expect(migrated.scarletGrowth).toBeCloseTo(0.10, 5);
    expect(typeof migrated.whiteClarity).toBe('number');
    expect(typeof migrated.janus).toBe('object');
    expect(typeof migrated.convergencePotential).toBe('number');
  });
});
