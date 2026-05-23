/**
 * match-maker-ui.js — Game UI Layer for Match Maker
 * Renders the 7×7 grid, handles input (click, touch, keyboard),
 * animates cascades, manages levels, and updates the HUD + Conscience bars.
 * (c) 2026 NicholaiMadias — MIT License
 */

import { GRID_SIZE, createInitialGrid, canSwap, applySwap, findMatches, clearMatches, applyGravity } from './matchMakerState.js';
import { onLevelComplete } from './badges.js';
import { saveGame, loadGame } from './saveSystem.js';
import { getLevelConfig, checkLevelUp, MAX_LEVEL } from './levelSystem.js';
import { updateDailyProgress, checkDailyCompletion } from './daily.js';
import { unlockStar } from './sevenStars.js';
import {
  createInitialState,
  applyPatternOutcome,
  loadState as loadPatternState,
  saveState as persistPatternState,
} from './match-maker/engine/index.js';

const COLS = GRID_SIZE;
const ROWS = GRID_SIZE;
const CASCADE_DELAY = 200;
const BASE_POINTS = 50;
const CHAIN_BONUS = 25;
const CONSCIENCE_KEYS = ['empathy', 'justice', 'wisdom', 'growth'];

const GEM_DISPLAY = {
  heart: { emoji: '❤', cls: 'gem-heart', label: 'Empathy' },
  star:  { emoji: '⭐', cls: 'gem-star',  label: 'Justice' },
  cross: { emoji: '✝', cls: 'gem-cross', label: 'Wisdom'  },
  flame: { emoji: '🔥', cls: 'gem-flame', label: 'Growth'  },
  drop:  { emoji: '💧', cls: 'gem-drop',  label: 'Grace'   },
};

let grid = [];
let score = 0;
let level = 1;
let moves = 0;
let totalClears = 0;
let combo = 0;
let explosions = 0;
let selected = null;
let locked = false;
let conscience = { empathy: 0, justice: 0, wisdom: 0, growth: 0 };
let progressionState = createInitialState();

const dom = {
  board:  null,
  score:  null,
  level:  null,
  moves:  null,
  clears: null,
  bars:   {},
};

function cacheDom() {
  dom.board  = document.getElementById('matchmaker-board');
  dom.score  = document.getElementById('score-val');
  dom.level  = document.getElementById('level-val');
  dom.moves  = document.getElementById('moves-val');
  dom.clears = document.getElementById('clears-val');
  CONSCIENCE_KEYS.forEach(key => {
    dom.bars[key] = document.getElementById(`bar-${key}`);
  });
}

function updateHUD() {
  if (dom.score)  dom.score.textContent  = score;
  if (dom.level)  dom.level.textContent  = level;
  if (dom.moves)  dom.moves.textContent  = moves;
  if (dom.clears) dom.clears.textContent = totalClears;

  CONSCIENCE_KEYS.forEach(key => {
    if (dom.bars[key]) {
      dom.bars[key].style.width = `${Math.min(100, conscience[key])}%`;
    }
  });
}

function renderBoard() {
  if (!dom.board) return;
  dom.board.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'gem-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      const gemType = grid[r]?.[c];
      const info    = GEM_DISPLAY[gemType] || { emoji: '?', cls: '', label: gemType };
      cell.innerHTML = `<span class="gem-icon ${info.cls}">${info.emoji}</span>`;
      cell.title     = info.label;

      if (selected && selected.r === r && selected.c === c) {
        cell.classList.add('selected');
      }

      cell.addEventListener('click', () => handleCellClick(r, c));
      dom.board.appendChild(cell);
    }
  }
}

async function handleCellClick(r, c) {
  if (locked || moves <= 0) return;

  if (!selected) {
    selected = { r, c };
    renderBoard();
    return;
  }

  if (selected.r === r && selected.c === c) {
    selected = null;
    renderBoard();
    return;
  }

  if (canSwap(grid, selected.r, selected.c, r, c)) {
    const r1 = selected.r, c1 = selected.c;
    selected = null;
    moves--;
    await executeMove(r1, c1, r, c);
  } else {
    selected = { r, c };
    renderBoard();
  }
}

async function executeMove(r1, c1, r2, c2) {
  locked = true;
  grid = applySwap(grid, r1, c1, r2, c2);
  renderBoard();

  const matches = findMatches(grid);
  if (matches.length === 0) {
    // Revert
    setTimeout(() => {
      grid = applySwap(grid, r1, c1, r2, c2);
      locked = false;
      renderBoard();
    }, 300);
    return;
  }

  await processCascade(1);
}

async function processCascade(chain) {
  const matches = findMatches(grid);
  if (matches.length === 0) {
    locked = false;
    finalizeMove();
    return;
  }

  const clearedCells = matches.flat();
  const points = (clearedCells.length * BASE_POINTS) + (chain > 1 ? (chain * CHAIN_BONUS) : 0);

  score += points;
  totalClears += clearedCells.length;
  if (chain > combo) combo = chain;

  // Track patterns for progression engine
  progressionState = applyPatternOutcome(progressionState, {
    count: clearedCells.length,
    chain,
    type: inferPatternType(matches, chain),
  });
  savePatternState(progressionState);

  bumpConscience(clearedCells);
  highlightMatched(matches);
  afterScoring();
  updateHUD();

  setTimeout(() => {
    const matchedCells = matches.flat();
    grid = clearMatches(grid, matchedCells);
    grid = applyGravity(grid);
    renderBoard();
    setTimeout(() => processCascade(chain + 1), CASCADE_DELAY);
  }, CASCADE_DELAY);
}

function inferPatternType(matches, chain) {
  if (chain >= 3) return 'break';
  if (matches.some(m => m.length >= 5)) return 'break';
  return 'ladder';
}

function bumpConscience(cells) {
  cells.forEach(cell => {
    const gem = grid[cell.r][cell.c];
    if (gem === 'heart') conscience.empathy += 1;
    if (gem === 'star')  conscience.justice += 1;
    if (gem === 'cross') conscience.wisdom  += 1;
    if (gem === 'flame') conscience.growth  += 1;
  });
}

function highlightMatched(matches) {
  const cells = dom.board?.querySelectorAll('.gem-cell') || [];
  matches.forEach(group => {
    group.forEach(({ r, c }) => {
      const idx = r * COLS + c;
      if (cells[idx]) cells[idx].classList.add('matched');
    });
  });
}

function initLevel() {
  const cfg = getLevelConfig(level);
  moves = cfg.moves;
  updateHUD();
}

function afterScoring() {
  if (!checkLevelUp(score, level)) return;

  const completedLevel = level;

  if (completedLevel < MAX_LEVEL) {
    level = completedLevel + 1;
    initLevel();
  }

  onLevelComplete(completedLevel, score, null, null);

  document.dispatchEvent(new CustomEvent('matchmaker-level-complete', {
    detail: { score, level: completedLevel }
  }));

  if (completedLevel === MAX_LEVEL) {
    document.dispatchEvent(new CustomEvent('matchmakerComplete', {
      detail: { score, level: completedLevel }
    }));
  }
}

function finalizeMove() {
  updateDailyProgress('score', score);
  updateDailyProgress('level', level);
  updateDailyProgress('clears', totalClears);

  const dailyDone = checkDailyCompletion({ score, level, clears: totalClears });
  if (dailyDone) {
    unlockStar('silver');
  }

  if (level >= 3) unlockStar('gold');
  if (score >= 1000) unlockStar('sapphire');
  if (totalClears >= 50) unlockStar('emerald');
  if (combo >= 5) unlockStar('ruby');
  if (explosions >= 10) unlockStar('amethyst');

  saveState();
}

function saveState() {
  saveGame('slot1', {
    grid, score, level, totalClears, combo, explosions, conscience
  });
}

function loadState() {
  const data = loadGame('slot1');
  if (!data) return false;
  grid = data.grid;
  score = data.score;
  level = data.level;
  totalClears = data.totalClears;
  combo = data.combo;
  explosions = data.explosions;
  conscience = data.conscience;
  return true;
}

export function initMatchMaker() {
  cacheDom();
  grid         = createInitialGrid();
  score        = 0;
  level        = 1;
  totalClears  = 0;
  combo        = 0;
  explosions   = 0;
  selected     = null;
  locked       = false;
  conscience   = { empathy: 0, justice: 0, wisdom: 0, growth: 0 };
  progressionState = createInitialState();

  loadPatternState((storedState) => {
    progressionState = storedState;
    initLevel();
    if (!loadState()) {
      renderBoard();
    } else {
      updateHUD();
      renderBoard();
    }
  });
}
