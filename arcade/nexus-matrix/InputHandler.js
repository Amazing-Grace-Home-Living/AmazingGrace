/**
 * InputHandler.js - Robust Mobile Touch Handler
 * (c) 2026 NicholaiMadias — MIT License
 * 
 * Specifically designed to resolve Safari/iOS gesture interference.
 */

export class InputHandler {
  /**
   * @param {HTMLElement} element - The grid container to listen on.
   * @param {Function} onSwap - Callback (r1, c1, r2, c2)
   */
  constructor(element, onSwap) {
    this.el = element;
    this.onSwap = onSwap;
    this.startX = 0;
    this.startY = 0;
    this.threshold = 25; // Min pixels to trigger a swap
    this.isTracking = false;

    this.init();
  }

  init() {
    this.el.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
    this.el.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
    this.el.addEventListener('touchend', this.handleEnd.bind(this), { passive: false });
    
    // Also support mouse for desktop testing
    this.el.addEventListener('mousedown', this.handleMouseDown.bind(this));
  }

  handleStart(e) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.isTracking = true;
    
    // Prevent default to stop scrolling/bouncing while playing
    if (e.cancelable) e.preventDefault();
  }

  handleMove(e) {
    if (!this.isTracking) return;
    if (e.cancelable) e.preventDefault(); // Lock viewport
  }

  handleEnd(e) {
    if (!this.isTracking) return;
    this.isTracking = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;

    const target = this.getTileAt(this.startX, this.startY);
    if (!target) return;

    let r2 = target.r;
    let c2 = target.c;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > this.threshold) {
        c2 += deltaX > 0 ? 1 : -1;
      }
    } else {
      if (Math.abs(deltaY) > this.threshold) {
        r2 += deltaY > 0 ? 1 : -1;
      }
    }

    if (r2 !== target.r || c2 !== target.c) {
      this.onSwap(target.r, target.c, r2, c2);
    }
  }

  handleMouseDown(e) {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.isTracking = true;

    const onMouseMove = (me) => {
        if (!this.isTracking) return;
    };

    const onMouseUp = (ue) => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        
        if (!this.isTracking) return;
        this.isTracking = false;

        const deltaX = ue.clientX - this.startX;
        const deltaY = ue.clientY - this.startY;

        const target = this.getTileAt(this.startX, this.startY);
        if (!target) return;

        let r2 = target.r;
        let c2 = target.c;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > this.threshold) {
                c2 += deltaX > 0 ? 1 : -1;
            }
        } else {
            if (Math.abs(deltaY) > this.threshold) {
                r2 += deltaY > 0 ? 1 : -1;
            }
        }

        if (r2 !== target.r || c2 !== target.c) {
            this.onSwap(target.r, target.c, r2, c2);
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  getTileAt(x, y) {
    const el = document.elementFromPoint(x, y);
    const cell = el?.closest('.star-cell');
    if (!cell) return null;
    return {
      r: parseInt(cell.dataset.row, 10),
      c: parseInt(cell.dataset.col, 10)
    };
  }
}
