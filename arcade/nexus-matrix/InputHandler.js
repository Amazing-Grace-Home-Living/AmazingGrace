/**
 * InputHandler.js - Mobile-optimized touch/pointer handler for Nexus Matrix.
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
    
    this.init();
  }

  init() {
    // We use pointer events for universal support, 
    // but ensure e.preventDefault() is used to block scrolling on mobile.
    this.gridEl.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.gridEl.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.gridEl.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.gridEl.addEventListener('pointercancel', this.handlePointerCancel.bind(this));
    
    // Prevent context menu to avoid interfering with long-press
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
    
    tile.classList.add('selected');
    tile.setPointerCapture(e.pointerId);
  }

  handlePointerMove(e) {
    if (e.pointerId !== this.activePointerId || !this.startTile) return;
    
    // Ensure we prevent default behavior to lock viewport
    if (e.cancelable) e.preventDefault();

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const threshold = 30; // pixels

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
        this.reset();
      }
    }
  }

  handlePointerUp(e) {
    if (e.pointerId !== this.activePointerId) return;
    this.reset();
  }

  handlePointerCancel(e) {
    if (e.pointerId !== this.activePointerId) return;
    this.reset();
  }

  reset() {
    if (this.startTile) {
      this.startTile.classList.remove('selected');
      if (this.activePointerId !== null) {
        try { this.startTile.releasePointerCapture(this.activePointerId); } catch(e) {}
      }
    }
    this.activePointerId = null;
    this.startTile = null;
  }
}
