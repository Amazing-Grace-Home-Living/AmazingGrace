import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('nexus arcade integrations', () => {
  it('boots the arcade hub with the shared connector and rewards Seven Stars unlocks', () => {
    const html = fs.readFileSync('arcade/index.html', 'utf8');

    expect(html).toContain("import { bootstrapArcadeModule } from './js/nexus-connector.js'");
    expect(html).toContain("module: 'SEVEN_STARS'");
    expect(html).toContain("moduleId: 'ARCADE_HUB'");
  });

  it('connects matrix and star routes to the shared event bus', () => {
    const matrixHtml = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    const starHtml = fs.readFileSync('arcade/star-matrix/index.html', 'utf8');

    expect(matrixHtml).toContain("module: 'MATRIX_OF_CONSCIENCE'");
    expect(matrixHtml).toContain("import { bootstrapArcadeModule } from '../js/nexus-connector.js'");
    expect(starHtml).toContain("module: 'STAR_MATRIX'");
    expect(starHtml).toContain("window.NexusArcadeBridge?.recordScore('STAR_MATRIX', score)");
  });

  it('wires React and quiz modules into the same nexus connector', () => {
    const bibleStudyHtml = fs.readFileSync('arcade/bible-study/index.html', 'utf8');
    const quickClickMain = fs.readFileSync('src/arcade/quick-click/main.tsx', 'utf8');
    const quickClickApp = fs.readFileSync('src/arcade/quick-click/QuickClickApp.tsx', 'utf8');

    expect(bibleStudyHtml).toContain("module: 'BIBLE_STUDY'");
    expect(quickClickMain).toContain("moduleId: 'QUICK_CLICK'");
    expect(quickClickApp).toContain("module: 'QUICK_CLICK'");
  });
});
