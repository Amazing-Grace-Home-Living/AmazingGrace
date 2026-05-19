import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('homepage navigation', () => {
  const src = fs.readFileSync('index.html', 'utf8');

  it('uses a consistent HTML nav (no hamburger toggle script)', () => {
    expect(src).toContain('./assets/css/unified-nav.css');
    expect(src).not.toContain('class="menu-toggle"');
    expect(src).not.toContain('// Mobile nav toggle');
    expect(src).toContain('>Listings<');
  });
});
