import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Matrix of Conscience mobile optimization', () => {
  const matrixHTML = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

  it('has fluid grid container with relative units', () => {
    expect(matrixHTML).toContain('grid-template-columns: repeat(7, 1fr)');
    expect(matrixHTML).toContain('grid-template-rows: repeat(7, 1fr)');
    expect(matrixHTML).toContain('width: 100%');
    expect(matrixHTML).toContain('max-width: 450px');
  });

  it('uses aspect-ratio for square cells', () => {
    expect(matrixHTML).toContain('aspect-ratio: 1 / 1');
  });

  it('has responsive symbol sizing', () => {
    expect(matrixHTML).toContain('font-size: clamp(1.1rem, 4vw, 1.6rem)');
    expect(matrixHTML).not.toContain('.tile img,');
    expect(matrixHTML).not.toContain('.tile svg,');
    expect(matrixHTML).not.toContain('.tile .symbol {');
  });

  it('has mobile-optimized button styles', () => {
    expect(matrixHTML).toContain('width: calc(100% - 20px)');
    expect(matrixHTML).toContain('max-width: 300px');
    expect(matrixHTML).toContain('padding: 12px 0');
    expect(matrixHTML).toContain('font-size: 16px');
  });

  it('has mobile media query for scoreboard', () => {
    expect(matrixHTML).toContain('@media (max-width: 400px)');
    expect(matrixHTML).toContain('font-size: 14px');
  });

  it('does not use fixed pixel grid sizing in JavaScript', () => {
    // Should not have the old JavaScript that set fixed pixel dimensions
    expect(matrixHTML).not.toContain('gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`');
    expect(matrixHTML).not.toContain('gridElement.style.gridTemplateRows = `repeat(${gridSize}, 60px)`');
  });

  it('maintains original game features and structure', () => {
    expect(matrixHTML).toContain('Matrix of Conscience');
    expect(matrixHTML).toContain('M45 Seven Sisters Alignment');
    expect(matrixHTML).toContain('Stellar Points');
    expect(matrixHTML).toContain('High Score');
    expect(matrixHTML).toContain('Reset Calibration');
  });
});
