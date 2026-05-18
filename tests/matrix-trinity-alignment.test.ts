import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('matrix trinity alignment integration', () => {
  it('embeds the Trinity Alignment training button and fullscreen view in the matrix route', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(html).toContain('[ALL] TRINITY_ALIGNMENT (MATCH-3)');
    expect(html).toContain('id="trinity-view"');
    expect(html).toContain('TERMINATE ALIGNMENT');
    expect(html).toContain('MATCH 3 → L/R TELEMETRY // MATCH 4+ → E/S TELEMETRY');
  });

  it('supports drag-and-drop swap gestures and telemetry awards for Trinity matches', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(html).toContain("button.addEventListener('pointerdown', beginTrinityPointerDrag);");
    expect(html).toContain("button.addEventListener('dragstart', beginTrinityHtmlDrag);");
    expect(html).toContain('function awardTrinityTelemetry(run, chain)');
    expect(html).toContain("const resourcePool = size >= 4 ? ['e', 's'] : ['l', 'r'];");
    expect(html).toContain("window.openTrinity = function()");
    expect(html).toContain("window.closeTrinity = function()");
  });
});
