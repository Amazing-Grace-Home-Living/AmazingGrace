export type ScarletLatticeStats = {
  integrity?: number;
  community?: number;
};

type Glyph = {
  text: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
};

export type ScarletLatticeController = {
  updateStats: (stats: ScarletLatticeStats) => void;
  speak: (message: string) => void;
  birth: () => void;
  destroy: () => void;
};

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function toFiniteNumber(value: unknown, fallback: number) {
  return Number.isFinite(value) ? (value as number) : fallback;
}

export function mountScarletLattice(canvas: HTMLCanvasElement): ScarletLatticeController | null {
  const maybeCtx = canvas.getContext('2d');
  if (!maybeCtx) return null;
  const sCtx: CanvasRenderingContext2D = maybeCtx;

  let destroyed = false;
  let raf = 0;
  let st = 0;
  let birthed = false;

  let width = 0;
  let height = 0;
  let dpr = 1;

  /** Mutable, short-lived glyphs rendered on the same canvas layer. */
  const glyphs: Glyph[] = [];

  function resizeScarlet() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnGlyphRed(message: string, x: number, y: number) {
    const text = String(message || '').trim();
    if (!text) return;

    glyphs.push({
      text,
      x,
      y,
      life: 160,
      maxLife: 160,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.9 - Math.random() * 0.6,
    });

    // Cap glyph list to avoid runaway memory.
    while (glyphs.length > 18) glyphs.shift();
  }

  function speakScarlet(message: string) {
    spawnGlyphRed(message, width / 2, height / 2);
  }

  function updateScarletLattice(stats: ScarletLatticeStats) {
    const integrity = toFiniteNumber(stats.integrity, 0);
    const community = toFiniteNumber(stats.community, 0);

    const growth = Math.max(0, 1 - integrity / 150);
    const spread = Math.max(0, 1 - community / 150);

    window.scarletGrowth = growth;
    window.scarletSpread = spread;

    const shouldAutoCollapse = growth > 0.05 || spread > 0.05;
    window.fateCollapse = Boolean(window.fateCollapse) || shouldAutoCollapse;

    if (growth > 0.6) {
      window.latticeDistortion = (window.latticeDistortion ?? 0) + growth * 2;
    }
    if (spread > 0.5) {
      window.weaveStability = (window.weaveStability ?? 1) - spread * 0.3;
    }

    if (!birthed && (growth > 0.9 || (growth > 0.8 && spread > 0.8))) {
      birthed = true;
      birthScarletLattice();
    }
  }

  function birthScarletLattice() {
    window.fateCollapse = true;
    canvas.style.opacity = '1';

    speakScarlet('THE GOLDEN WEAVE HAS FAILED');
    speakScarlet('I WILL SPIN A NEW WEB');

    window.collapseShockwave?.();
  }

  function drawGlyphs() {
    if (glyphs.length === 0) return;

    sCtx.save();
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.font = '700 14px system-ui, -apple-system, Segoe UI, sans-serif';

    for (let i = glyphs.length - 1; i >= 0; i -= 1) {
      const glyph = glyphs[i];
      glyph.life -= 1;
      glyph.x += glyph.vx;
      glyph.y += glyph.vy;
      glyph.vy += 0.012;

      const t = glyph.life / glyph.maxLife;
      const alpha = clamp01(t) * 0.85;

      sCtx.fillStyle = `rgba(255, 0, 80, ${alpha})`;
      sCtx.shadowColor = 'rgba(255, 0, 80, 0.65)';
      sCtx.shadowBlur = 10;
      sCtx.fillText(glyph.text, glyph.x, glyph.y);

      if (glyph.life <= 0) glyphs.splice(i, 1);
    }
    sCtx.restore();
  }

  function drawScarletNode(x: number, y: number, r: number, depth: number, growth: number) {
    if (depth <= 0) return;

    const pulse = Math.sin(st * 4) * 0.1;
    const alpha = clamp01(0.25 + pulse + growth * 0.15);

    sCtx.beginPath();
    sCtx.strokeStyle = `rgba(255, 0, 80, ${alpha})`;
    sCtx.lineWidth = 2 + depth * 0.5;
    sCtx.arc(x, y, r, 0, Math.PI * 2);
    sCtx.stroke();

    const angleStep = Math.PI / 3;
    for (let i = 0; i < 6; i += 1) {
      const nx = x + Math.cos(i * angleStep + st) * r;
      const ny = y + Math.sin(i * angleStep + st) * r;

      drawScarletNode(nx, ny, r * 0.45, depth - 1, growth);

      sCtx.beginPath();
      sCtx.moveTo(x, y);
      sCtx.lineTo(nx, ny);
      sCtx.stroke();
    }
  }

  function draw() {
    if (destroyed) return;
    raf = window.requestAnimationFrame(draw);

    if (!window.fateCollapse) {
      canvas.style.opacity = '0';
      if (glyphs.length > 0) glyphs.length = 0;
      sCtx.clearRect(0, 0, width, height);
      return;
    }

    st += 0.01;

    const growth = toFiniteNumber(window.scarletGrowth, 0);
    const spread = toFiniteNumber(window.scarletSpread, 0);

    // Ensure the layer is visible once Fate Collapse is active.
    canvas.style.opacity = '1';

    sCtx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const depth = 2 + Math.floor(growth * 3);
    const radius = 180 + spread * 120;

    drawScarletNode(cx, cy, radius, depth, growth);
    drawGlyphs();
  }

  // Expose convenience hooks for other engines/pages (safe no-ops if unused).
  window.spawnGlyphRed = spawnGlyphRed;
  window.speakScarlet = speakScarlet;
  window.updateScarletLattice = updateScarletLattice;
  window.birthScarletLattice = birthScarletLattice;

  resizeScarlet();
  window.addEventListener('resize', resizeScarlet);
  raf = window.requestAnimationFrame(draw);

  return {
    updateStats: updateScarletLattice,
    speak: speakScarlet,
    birth: birthScarletLattice,
    destroy: () => {
      destroyed = true;
      window.removeEventListener('resize', resizeScarlet);
      window.cancelAnimationFrame(raf);
      glyphs.length = 0;
    },
  };
}
