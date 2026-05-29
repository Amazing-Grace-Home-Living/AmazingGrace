import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const matrixHtml = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
const starHtml = fs.readFileSync('arcade/star-matrix/index.html', 'utf8');

describe('M45 arcade match resolution', () => {
  it('uses the canonical matchmaker API for matrix of conscience swaps', () => {
    expect(matrixHtml).toContain("import { GRID_SIZE, createInitialGrid, applySwap, findMatches, applyMatches, applyGravity } from '../../js/matchmaker.js';");
    expect(matrixHtml).toContain('function areAdjacentTiles(tileA, tileB) {');
    expect(matrixHtml).toContain('const swappedGrid = applySwap(gridData, start.row, start.col, end.row, end.col);');
    expect(matrixHtml).toContain('const { resolvedGrid, clearedCells } = resolveBoard(swappedGrid);');
    expect(matrixHtml).toContain('if (clearedCells === 0) return;');
  });

  it('reverts invalid swaps in star matrix after canonical match detection', () => {
    expect(starHtml).toContain("import { GRID_SIZE, createInitialGrid, applySwap, findMatches, applyMatches, applyGravity } from '../../js/matchmaker.js';");
    expect(starHtml).toContain('function resolveBoard(nextGrid) {');
    expect(starHtml).toContain('const { resolvedGrid, clearedCells } = resolveBoard(grid);');
    expect(starHtml).toContain('if (clearedCells === 0) {');
    expect(starHtml).toContain('smSwap(rowA, colA, rowB, colB);');
  });
});
