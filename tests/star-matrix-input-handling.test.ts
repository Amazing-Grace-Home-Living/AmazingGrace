import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('star matrix input handling', () => {
  it('uses unified pointer drag handlers on each star cell', () => {
    const html = fs.readFileSync('arcade/star-matrix/index.html', 'utf8');

    expect(html).toContain("cell.addEventListener('pointerdown', onPointerDown);");
    expect(html).toContain("cell.addEventListener('pointermove', onPointerMove);");
    expect(html).toContain("cell.addEventListener('pointerup', onPointerUp);");
    expect(html).toContain("cell.addEventListener('pointercancel', onPointerCancel);");
  });

  it('validates swaps as orthogonally adjacent and resets drag state', () => {
    const html = fs.readFileSync('arcade/star-matrix/index.html', 'utf8');

    expect(html).toContain('function attemptSwap(tileA, tileB) {');
    expect(html).toContain('Math.abs(rowA - rowB) === 1 && colA === colB');
    expect(html).toContain('Math.abs(colA - colB) === 1 && rowA === rowB');
    expect(html).toContain('resetDragState();');
    expect(html).toContain("dragStartTile.classList.remove('selected');");
  });
});
