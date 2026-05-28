/**
 * InputHandler.js - Mobile-optimized touch/pointer handler for Nexus Matrix.
 * Supports both drag-and-drop and click-to-swap.
 * (c) 2026 NicholaiMadias — MIT License
 */

export class InputHandler {
  constructor(gridEl, onSwap) {
    this.gridEl = gridEl;
    this.onSwap = onSwap;
    this.activePointerId = null;
    this.startTile = null;
    this.startX = 0;
    this.startY = 0;
    this.selectedCoord = null; // { r, c } for click-to-swap
    this.swappedViaDrag = false;

    this.init();
  }

  init() {
    this.gridEl.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.gridEl.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.gridEl.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.gridEl.addEventListener('pointercancel', this.handlePointerCancel.bind(this));
    this.gridEl.addEventListener('contextmenu', e => e.preventDefault());
  }

  handlePointerDown(e) {
    if (this.activePointerId !== null) return;
    const tile = e.target.closest('.star-cell');
    if (!tile) return;

    this.activePointerId = e.pointerId;
    this.startTile = tile;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.swappedViaDrag = false;

    tile.setPointerCapture(e.pointerId);
  }

  handlePointerMove(e) {
    if (e.pointerId !== this.activePointerId || !this.startTile) return;
    if (e.cancelable) e.preventDefault();

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const threshold = 30;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      const r1 = parseInt(this.startTile.dataset.row);
      const c1 = parseInt(this.startTile.dataset.col);
      let r2 = r1, c2 = c1;

      if (Math.abs(dx) > Math.abs(dy)) {
        c2 += dx > 0 ? 1 : -1;
      } else {
        r2 += dy > 0 ? 1 : -1;
      }

      if (r2 >= 0 && r2 < 7 && c2 >= 0 && c2 < 7) {
        this.onSwap(r1, c1, r2, c2);
        this.swappedViaDrag = true;
        this.selectedCoord = null; // Reset click selection on drag
        this.reset();
      }
    }
  }

  handlePointerUp(e) {
    if (e.pointerId !== this.activePointerId) return;

    if (!this.swappedViaDrag && this.startTile) {
      const r = parseInt(this.startTile.dataset.row);
      const c = parseInt(this.startTile.dataset.col);
      this.handleTap(r, c);
    }

    this.reset();
  }

  handlePointerCancel(e) {
    if (e.pointerId !== this.activePointerId) return;
    this.reset();
  }

  handleTap(r, c) {
    if (!this.selectedCoord) {
      this.selectedCoord = { r, c };
    } else if (this.selectedCoord.r === r && this.selectedCoord.c === c) {
      this.selectedCoord = null;
    } else {
      const r1 = this.selectedCoord.r;
      const c1 = this.selectedCoord.c;
      const isAdjacent = (Math.abs(r1 - r) === 1 && c1 === c) || (Math.abs(c1 - c) === 1 && r1 === r);

      if (isAdjacent) {
        this.onSwap(r1, c1, r, c);
        this.selectedCoord = null;
      } else {
        this.selectedCoord = { r, c };
      }
    }
    this.updateSelectionClasses();
  }

  updateSelectionClasses() {
    this.gridEl.querySelectorAll('.star-cell').forEach(cell => {
      const r = parseInt(cell.dataset.row);
      const c = parseInt(cell.dataset.col);
      const isSelected = this.selectedCoord && this.selectedCoord.r === r && this.selectedCoord.c === c;
      cell.classList.toggle('selected', !!isSelected);
    });
  }

  reset() {
    if (this.startTile && this.activePointerId !== null) {
      try { this.startTile.releasePointerCapture(this.activePointerId); } catch(e) {}
    }
    this.activePointerId = null;
    this.startTile = null;
    // We don't clear selectedCoord here as it's for click-to-swap persistence
    this.updateSelectionClasses();
  }
}
