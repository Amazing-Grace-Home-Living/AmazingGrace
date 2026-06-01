import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('rebellion skin integration', () => {
  it('loads the global skin from unified nav styles', () => {
    const css = fs.readFileSync('assets/css/unified-nav.css', 'utf8');
    expect(css).toContain("@import url('./rebellion-skin.css');");
  });

  it('uses the requested rebellion hero image on the 2027 story page', () => {
    const html = fs.readFileSync('stories/rebellion2027/index.html', 'utf8');
    expect(html).toContain('0ad97551-f128-4b35-b39e-d24f9d6b8eb0');
  });
});
