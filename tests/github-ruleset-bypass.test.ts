import { describe, expect, it } from 'vitest';

import { KNOWN_APP_IDS, normalizeBypassMode } from '../scripts/github-ruleset-bypass.js';

describe('github ruleset bypass tool', () => {
  it('ships a known mapping for the github-actions app id', () => {
    expect(KNOWN_APP_IDS['github-actions']).toBe(15368);
  });

  it('normalizes bypass modes', () => {
    expect(normalizeBypassMode('always')).toBe('always');
    expect(normalizeBypassMode('pull_request')).toBe('pull_request');
    expect(normalizeBypassMode('pull-request')).toBe('pull_request');
  });
});

