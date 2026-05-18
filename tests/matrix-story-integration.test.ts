import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('matrix story integration', () => {
  it('keeps the matrix story page narrative-first with a launch CTA', () => {
    const html = fs.readFileSync('stories/matrix.html', 'utf8');

    const storyIndex = html.indexOf('<article class="story-panel">');
    const gameIndex = html.indexOf('<section id="calibration-game"');

    expect(storyIndex).toBeGreaterThanOrEqual(0);
    expect(gameIndex).toBeGreaterThan(storyIndex);
    expect(html).toContain('id="enter-matrix"');
    expect(html).toContain('Enter the Matrix');
    expect(html).toContain('max-width: 740px;');
    expect(html).toContain('line-height: 1.78;');
  });

  it('supports pointer drag gestures and keeps arcade path alignment', () => {
    const html = fs.readFileSync('stories/matrix.html', 'utf8');

    expect(html).toContain("tile.addEventListener('pointerdown', onPointerDown);");
    expect(html).toContain("sourceTile.addEventListener('pointermove', onPointerMove);");
    expect(html).toContain("sourceTile.addEventListener('pointerup', onPointerUp);");
    expect(html).toContain('../arcade/matrix-of-conscience/');
    expect(html).toContain('amazinggracehl.org');
  });

  it('keeps story library matrix entry on a preview-safe relative path', () => {
    const libraryJson = JSON.parse(fs.readFileSync('stories/library.json', 'utf8'));
    const matrixEntry = libraryJson.entries.find((entry: { slug?: string; path?: string }) => entry.slug === 'matrix-of-conscience');

    expect(matrixEntry).toBeDefined();
    expect(matrixEntry.path).toBe('./matrix.html');
  });
});
