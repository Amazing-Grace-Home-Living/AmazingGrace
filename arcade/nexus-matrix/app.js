/**
 * app.js - Unified Nexus Matrix Controller
 * (c) 2026 NicholaiMadias — MIT License
 */

import {
  createInitialGrid,
  applySwap,
  findMatchesGrouped,
  applyGravity,
  canSwap as engineCanSwap
} from '../../js/matchmaker.js';
import { InputHandler } from './InputHandler.js';

const MODES = {
  STARS: 'stars',
  CONSCIENCE: 'conscience',
  CLASSIC: 'classic',
  SPIDER: 'spider'
};

const THEMES = {
  [MODES.STARS]: {
    title: 'Star Matrix',
    target: 1000,
    moves: 30,
    mapping: { heart: '🌟', star: '💫', cross: '💎', flame: '⭐', drop: '🔴' },
    bg: 'radial-gradient(circle at 50% 20%, #1a0533 0%, #020617 70%)',
    accent: '#bc13fe',
    music: 'star_bg',
    sfxChain: 'star_chain'
  },
  [MODES.CONSCIENCE]: {
    title: 'Matrix of Conscience',
    target: 2500,
    moves: 45,
    mapping: { heart: '💙', star: '✨', cross: '🛡️', flame: '🔥', drop: '💧' },
    bg: 'radial-gradient(circle at 50% 20%, #051a33 0%, #020617 70%)',
    accent: '#00f2ff'
  },
  [MODES.CLASSIC]: {
    title: 'Janus Weave',
    target: 5000,
    moves: 60,
    mapping: { heart: '⚪', star: '✨', cross: '💎', flame: '🔴', drop: '💠' },
    bg: 'radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 70%)',
    accent: '#7effd8'
  },
  [MODES.SPIDER]: {
    title: 'Spider Protocol',
    target: 1500,
    moves: 20,
    mapping: { heart: '🕷️', star: '🕸️', cross: '☣️', flame: '⚠️', drop: '💀' },
    bg: 'radial-gradient(circle at 50% 20%, #1a0000 0%, #020617 70%)',
    accent: '#ff0040'
  }
};

class NexusMatrix {
  constructor() {
    this.mode = new URLSearchParams(window.location.search).get('mode') || MODES.STARS;
    this.theme = THEMES[this.mode] || THEMES[MODES.STARS];
    
    this.board = [];
    this.score = 0;
    this.moves = this.theme.moves;
    this.combo = 1;
    this.isProcessing = false;
    this.gameOver = false;
    this.assistant = false;
    
    this.audio = null;

    this.init();
  }

  init() {
    this.board = createInitialGrid();
    this.renderInitialUI();
    this.input = new InputHandler(document.getElementById('sm-grid'), this.handleSwap.bind(this));
    this.updateHUD();
    this.wireEvents();
    this.initAudio();
    this.log(`System initialized. Mode: ${this.theme.title.toUpperCase()}`);
  }

  initAudio() {
    if (window.AudioManager) {
        this.audio = new window.AudioManager();
        // Register requested tracks
        this.audio.registerTrack('star_bg', '../../assets/music/m64slide.mid');
        this.audio.registerSFX('star_chain', '../../assets/audio/storm.mp3');
        
        // Start music if applicable
        if (this.theme.music) {
            this.audio.playMusic(this.theme.music);
        }
        
        // Mount UI to sidebar if container exists
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            const audioUI = document.createElement('div');
            audioUI.id = 'audio-controls';
            audioUI.style.marginTop = '12px';
            sidebar.insertBefore(audioUI, sidebar.querySelector('.store-panel'));
            this.audio.mountToggleUI('#audio-controls');
        }
    }
  }

  log(msg) {
    const logEl = document.getElementById('log-text');
    if (logEl) {
        logEl.innerHTML += `<br>> ${msg}`;
        const consoleEl = document.getElementById('console');
        if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  }

  renderInitialUI() {
    document.title = `${this.theme.title} | Nexus Arcade`;
    document.body.style.background = this.theme.bg;
    
    document.querySelectorAll('.routine').forEach(el => {
        el.classList.toggle('active', el.dataset.mode === this.mode);
    });

    this.renderBoard();
  }

  wireEvents() {
    document.querySelectorAll('.routine').forEach(el => {
        el.addEventListener('click', () => {
            const newMode = el.dataset.mode;
            window.location.search = `?mode=${newMode}`;
        });
    });

    document.getElementById('buy-guide')?.addEventListener('click', () => this.buy('guide'));
    document.getElementById('buy-burst')?.addEventListener('click', () => this.buy('burst'));
    document.getElementById('run-promo')?.addEventListener('click', () => this.redeem());
    document.getElementById('overlay-btn')?.addEventListener('click', () => window.location.reload());
  }

  renderBoard() {
    const grid = document.getElementById('sm-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const kind = typeof this.board[r][c] === 'string' ? this.board[r][c] : this.board[r][c].kind;
        const emoji = this.theme.mapping[kind] || '❓';
        
        const cell = document.createElement('div');
        cell.className = 'star-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.dataset.type = kind;
        cell.textContent = emoji;
        grid.appendChild(cell);
      }
    }
    if (this.input) this.input.updateSelectionClasses();
  }

  updateHUD() {
    const scoreEl = document.getElementById('sm-score');
    const targetEl = document.getElementById('sm-target');
    const comboEl = document.getElementById('sm-combo');
    const movesEl = document.getElementById('sm-moves');

    if (scoreEl) scoreEl.textContent = this.score;
    if (targetEl) targetEl.textContent = this.theme.target;
    if (comboEl) comboEl.textContent = `x${this.combo}`;
    if (movesEl) movesEl.textContent = this.moves;
  }

  async handleSwap(r1, c1, r2, c2) {
    if (this.isProcessing || this.gameOver || this.moves <= 0) return;
    if (!engineCanSwap(null, r1, c1, r2, c2)) return;

    this.isProcessing = true;
    this.board = applySwap(this.board, r1, c1, r2, c2);
    this.renderBoard();
    if (this.audio) this.audio.playSFX('click');

    const matches = findMatchesGrouped(this.board);
    if (matches.length === 0) {
      setTimeout(() => {
        this.board = applySwap(this.board, r1, c1, r2, c2);
        this.renderBoard();
        this.isProcessing = false;
      }, 300);
      return;
    }

    this.moves--;
    this.updateHUD();
    await this.resolveMatches();
  }

  async resolveMatches() {
    const matches = findMatchesGrouped(this.board);
    if (matches.length === 0) {
      this.combo = 1;
      this.updateHUD();
      this.isProcessing = false;
      this.checkEndState();
      return;
    }

    const cleared = matches.flat();
    const pts = cleared.length * 10 * this.combo;
    this.score += pts;
    
    if (this.audio) {
        if (this.combo > 1 || cleared.length >= 4) {
            this.audio.playSFX('star_chain'); // Use storm.mp3 for chain reactions
        } else {
            this.audio.playSFX('success');
        }
    }

    if (cleared.length >= 4) {
        this.combo++;
        this.log(`COMBO INCREASED: x${this.combo}`);
    }
    this.updateHUD();

    cleared.forEach(({ r, c }) => {
      const cell = document.querySelector(`.star-cell[data-row="${r}"][data-col="${c}"]`);
      cell?.classList.add('matched');
    });

    await new Promise(r => setTimeout(r, 400));

    cleared.forEach(({ r, c }) => { this.board[r][c] = null; });
    this.board = applyGravity(this.board);
    this.renderBoard();

    setTimeout(() => this.resolveMatches(), 300);
  }

  checkEndState() {
    if (this.score >= this.theme.target && !this.gameOver) {
        this.gameOver = true;
        if (this.audio) this.audio.playSFX('victory');
        this.showOverlay('MISSION COMPLETE', 'The matrix has been successfully aligned.');
    } else if (this.moves <= 0 && !this.gameOver) {
        this.gameOver = true;
        if (this.audio) this.audio.playSFX('defeat');
        this.showOverlay('SYSTEM FAILURE', 'Maximum moves exceeded. Matrix destabilized.', true);
    }
  }

  showOverlay(title, desc, isFailure = false) {
    const overlay = document.getElementById('sm-overlay');
    const titleEl = document.getElementById('overlay-title');
    const descEl = document.getElementById('overlay-desc');
    
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (overlay) {
        overlay.style.borderColor = isFailure ? 'var(--danger)' : 'var(--accent2)';
        overlay.classList.add('active');
    }
  }

  buy(item) {
    if (item === 'guide' && this.score >= 1000 && !this.assistant) {
        this.score -= 1000;
        this.assistant = true;
        this.log('Spirit Guide deployed.');
        if (this.audio) this.audio.playSFX('powerup');
        const btn = document.getElementById('buy-guide');
        if (btn) { btn.textContent = 'ACTIVE'; btn.disabled = true; }
    } else if (item === 'burst' && this.score >= 500) {
        this.score -= 500;
        this.log('Power Burst activated. Board clearing...');
        if (this.audio) this.audio.playSFX('whoosh');
        this.score += 250;
    }
    this.updateHUD();
  }

  redeem() {
    const code = document.getElementById('promo-code')?.value?.toUpperCase();
    if (code === 'NIMBUS') {
        this.score += 1000;
        this.log('Code NIMBUS accepted. +1000 Score.');
        if (this.audio) this.audio.playSFX('success');
    } else if (code === 'GRACE') {
        this.moves += 10;
        this.log('Code GRACE accepted. +10 Moves.');
        if (this.audio) this.audio.playSFX('powerup');
    }
    this.updateHUD();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new NexusMatrix();
});
