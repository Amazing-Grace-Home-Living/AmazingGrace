import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Tri-Weave Bundle cleanup', () => {
  const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

  it('removes the Tri-Weave engine from the legacy redirect page', () => {
    expect(html).not.toContain('id="weave-canvas"');
    expect(html).not.toContain('function drawTriWeaveStrand(');
    expect(html).not.toContain('function drawTriWeaveBundle(');
    expect(html).not.toContain('function updateThreadWeave(');
    expect(html).not.toContain('function triWeavePulse(');
    expect(html).not.toContain('window.updateThreadWeave = updateThreadWeave');
  });
});
