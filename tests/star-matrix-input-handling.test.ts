import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const html = fs.readFileSync('arcade/star-matrix/index.html', 'utf8');

describe('star matrix input handling', () => {
  it('uses unified pointer drag handlers on each star cell', () => {
    expect(html).toContain("cell.addEventListener('pointerdown', onPointerDown);");
    expect(html).toContain("cell.addEventListener('pointermove', onPointerMove);");
    expect(html).toContain("cell.addEventListener('pointerup', onPointerUp);");
    expect(html).toContain("cell.addEventListener('pointercancel', onPointerCancel);");
  });

  it('validates swaps as orthogonally adjacent and resets drag state', () => {
    expect(html).toContain('function attemptSwap(tileA, tileB) {');
    expect(html).toContain('if (![rowA, colA, rowB, colB].every(Number.isFinite)) return;');
    expect(html).toContain('Math.abs(rowA - rowB) === 1 && colA === colB');
    expect(html).toContain('Math.abs(colA - colB) === 1 && rowA === rowB');
    expect(html).toContain('if (!isAdjacent) return;');
    expect(html).toContain('smSwap(rowA, colA, rowB, colB);');
    expect(html).toContain('resetDragState();');
    expect(html).toContain("dragStartTile.classList.remove('selected');");
    expect(html).toContain("dragStartTile.setAttribute('aria-selected', 'false');");
  });

  it('tracks a single active pointer and restores swipe-neighbor fallback', () => {
    expect(html).toContain('let activePointerId = null;');
    expect(html).toContain('if (dragStartTile || activePointerId !== null) return;');
    expect(html).toContain('if (e.pointerId !== activePointerId) return;');
    expect(html).toContain('const dragEndTile = (elementAtPoint ? elementAtPoint.closest(\'.star-cell\') : null) || dragTargetTile || inferSwipeNeighbor(e);');
    expect(html).toContain('function inferSwipeNeighbor(e) {');
  });
});
