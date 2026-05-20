import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('matrix alignment integration', () => {
  it('embeds the M45 Alignment grid and controls in the matrix route', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(html).toContain('Matrix of Conscience');
    expect(html).toContain('M45 Seven Sisters Alignment');
    expect(html).toContain('id="grid"');
    expect(html).toContain('Reset Calibration');
  });

  it('supports sequence alignment and scoring for M45 matches', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(html).toContain('function handleSelection(r, c, tileElement)');
    expect(html).toContain('function checkAndClearMatches()');
    expect(html).toContain('function cascadeTiles()');
    expect(html).toContain('matrix_high_score');
  });
});
