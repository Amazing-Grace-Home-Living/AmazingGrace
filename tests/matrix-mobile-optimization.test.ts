import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Matrix of Conscience mobile optimization', () => {
  const matrixHTML = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

  it('has fluid grid container with relative units', () => {
    expect(matrixHTML).toContain('grid-template-columns: repeat(7, 1fr)');
    expect(matrixHTML).toContain('width: 100%');
    expect(matrixHTML).toContain('box-sizing: border-box');
  });

  it('keeps the game shell responsive to avoid clipping on narrow screens', () => {
    expect(matrixHTML).toContain('@media (max-width: 768px)');
    expect(matrixHTML).toContain('flex-direction: column');
    expect(matrixHTML).toContain('overflow-y: auto');
  });

  it('uses aspect-ratio for square cells', () => {
    expect(matrixHTML).toContain('aspect-ratio: 1');
  });

  it('has responsive touch handling', () => {
    expect(matrixHTML).toContain('touch-action: none');
  });

  it('has mobile-optimized layout wrapping', () => {
    expect(matrixHTML).toContain('#sidebar');
    expect(matrixHTML).toContain('#main');
  });

  it('does not use fixed pixel grid sizing in JavaScript', () => {
    expect(matrixHTML).not.toContain('gridTemplateColumns = `repeat(${gridSize}, 60px)`');
    expect(matrixHTML).not.toContain('gridTemplateRows = `repeat(${gridSize}, 60px)`');
  });

  it('maintains original game features and structure', () => {
    expect(matrixHTML).toContain('Matrix of Conscience');
    expect(matrixHTML).toContain('NEXUS MATRIX');
    expect(matrixHTML).toContain('AMAZING GRACE');
    expect(matrixHTML).toContain('CONSCIENCE_INIT');
    expect(matrixHTML).toContain('Duality Core Status');
  });
});
