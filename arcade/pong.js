const STORAGE_KEY = 'amazingGracePongSettings';

let WINNING_SCORE = 5;
let BALL_SPEED = 6;
let ENABLE_SOUND = false;
let ENABLE_POWERUPS = true;

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const paddleWidth = 14;
const basePaddleHeight = 90;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;
let paddleHeightState = { player: basePaddleHeight, ai: basePaddleHeight };
let playerY = (canvas.height - basePaddleHeight) / 2;
let aiY = (canvas.height - basePaddleHeight) / 2;
const ballSize = 16;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;
let ballTrail = [];
let rallyCount = 0;
let playerScore = 0;
let aiScore = 0;
let paused = false;
let gameOver = false;
let twoPlayer = false;
let theme = 'dark';

let powerups = [];
const powerupTypes = [
  { type: 'big-paddle', color: '#38bdf8', label: 'BIG' },
  { type: 'fast-ball', color: '#fb7185', label: 'FAST' },
  { type: 'small-paddle', color: '#c084fc', label: 'SMALL' },
  { type: 'ghost-ball', color: '#2dd4bf', label: 'GHOST' },
  { type: 'reverse', color: '#f59e0b', label: 'REV' }
];
let activePowerup = null;
let powerupTimeout = null;
let ghostBall = false;
let reverseControls = false;

const scoreboard = document.getElementById('scoreboard-container');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const modeBtn = document.getElementById('mode-btn');
const themeBtn = document.getElementById('theme-btn');
const settingsBtn = document.getElementById('settings-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const modal = document.getElementById('settings-modal');
const closeModal = document.getElementById('close-modal');
const winScoreInput = document.getElementById('win-score-input');
const ballSpeedInput = document.getElementById('ball-speed-input');
const ballSpeedLabel = document.getElementById('ball-speed-label');
const soundToggle = document.getElementById('sound-toggle');
const powerupToggle = document.getElementById('powerup-toggle');
const applySettingsBtn = document.getElementById('apply-settings-btn');

function saveGameData() {
  const data = {
    playerScore,
    aiScore,
    twoPlayer,
    theme,
    WINNING_SCORE,
    BALL_SPEED,
    ENABLE_SOUND,
    ENABLE_POWERUPS
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadGameData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  try {
    const parsed = JSON.parse(data);
    playerScore = typeof parsed.playerScore === 'number' ? parsed.playerScore : 0;
    aiScore = typeof parsed.aiScore === 'number' ? parsed.aiScore : 0;
    twoPlayer = Boolean(parsed.twoPlayer);
    theme = parsed.theme === 'light' ? 'light' : 'dark';
    WINNING_SCORE = typeof parsed.WINNING_SCORE === 'number' ? parsed.WINNING_SCORE : 5;
    BALL_SPEED = typeof parsed.BALL_SPEED === 'number' ? parsed.BALL_SPEED : 6;
    ENABLE_SOUND = Boolean(parsed.ENABLE_SOUND);
    ENABLE_POWERUPS = parsed.ENABLE_POWERUPS !== false;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function applyTheme() {
  document.body.classList.toggle('light', theme === 'light');
  themeBtn.textContent = theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function updateScoreboard() {
  document.getElementById('player-score').textContent = String(playerScore);
  document.getElementById('ai-score').textContent = String(aiScore);
  saveGameData();
}

function animateScore(who) {
  scoreboard.style.transform = who === 'player'
    ? 'scale(1.08) rotate(-2deg)'
    : 'scale(1.08) rotate(2deg)';
  setTimeout(() => {
    scoreboard.style.transform = '';
  }, 220);
}

function playBeep(frequency, duration) {
  if (!ENABLE_SOUND || typeof window.AudioContext === 'undefined') return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.03;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration / 1000);
  oscillator.onended = () => audioContext.close();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = theme === 'dark' ? '#e2e8f0' : '#334155';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  if (ENABLE_POWERUPS) {
    for (const powerup of powerups) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = powerup.color;
      ctx.lineWidth = 3;
      ctx.arc(powerup.x + powerup.size / 2, powerup.y + powerup.size / 2, powerup.size / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = powerup.color;
      ctx.textAlign = 'center';
      ctx.fillText(powerup.label, powerup.x + powerup.size / 2, powerup.y + powerup.size / 2 + 5);
      ctx.restore();
    }
  }

  const trailLength = 14;
  for (let i = Math.max(0, ballTrail.length - trailLength); i < ballTrail.length; i += 1) {
    const alpha = 0.1 + 0.2 * ((i - Math.max(0, ballTrail.length - trailLength)) / trailLength);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(ballTrail[i].x + ballSize / 2, ballTrail[i].y + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = ghostBall ? '#a7f3d0' : '#fde68a';
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = ghostBall ? '#99f6e4' : '#fde68a';
  ctx.shadowColor = ghostBall ? '#2dd4bf' : '#fde68a';
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = theme === 'dark' ? '#f8fafc' : '#0f172a';
  ctx.fillRect(playerX, playerY, paddleWidth, paddleHeightState.player);
  ctx.fillRect(aiX, aiY, paddleWidth, paddleHeightState.ai);

  if (reverseControls) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('⇄', canvas.width / 2 - 14, 34);
    ctx.restore();
  }
}

function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  const speed = BALL_SPEED + 1.2 * Math.min(6, rallyCount / 3);
  const angle = (Math.random() - 0.5) * 0.6;
  ballSpeedX = speed * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * Math.sin(angle);
  ballTrail = [];
  rallyCount = 0;
  ghostBall = false;
  reverseControls = false;
  if (!gameOver && ENABLE_POWERUPS && Math.random() < 0.18) {
    spawnPowerup();
  }
}

function spawnPowerup() {
  const powerup = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
  const x = canvas.width / 4 + Math.random() * canvas.width / 2 - 20;
  const y = 40 + Math.random() * (canvas.height - 80);
  powerups.push({ ...powerup, x, y, size: 38 });
}

function activatePowerup(powerup, player) {
  activePowerup = { ...powerup, player };
  if (powerupTimeout) clearTimeout(powerupTimeout);

  switch (powerup.type) {
    case 'big-paddle':
      paddleHeightState[player] = 140;
      break;
    case 'small-paddle':
      paddleHeightState[player] = 50;
      break;
    case 'fast-ball':
      ballSpeedX *= 1.6;
      ballSpeedY *= 1.6;
      break;
    case 'ghost-ball':
      ghostBall = true;
      break;
    case 'reverse':
      reverseControls = true;
      break;
    default:
      break;
  }

  powerupTimeout = setTimeout(() => {
    paddleHeightState = { player: basePaddleHeight, ai: basePaddleHeight };
    if (powerup.type === 'fast-ball') {
      ballSpeedX /= 1.6;
      ballSpeedY /= 1.6;
    }
    ghostBall = false;
    reverseControls = false;
    activePowerup = null;
  }, 5000);
}

function paddleHitAnim(side) {
  const original = side === 'player' ? playerY : aiY;
  let frame = 0;

  function animate() {
    if (frame < 6) {
      const offset = (frame % 2 === 0 ? 8 : -8) * (1 - frame / 10);
      if (side === 'player') {
        playerY = clamp(original + offset, 0, canvas.height - paddleHeightState.player);
      } else {
        aiY = clamp(original + offset, 0, canvas.height - paddleHeightState.ai);
      }
      frame += 1;
      setTimeout(animate, 12);
    } else if (side === 'player') {
      playerY = clamp(original, 0, canvas.height - paddleHeightState.player);
    } else {
      aiY = clamp(original, 0, canvas.height - paddleHeightState.ai);
    }
  }

  animate();
}

function update() {
  if (paused || gameOver) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;
  ballTrail.push({ x: ballX, y: ballY });
  if (ballTrail.length > 21) ballTrail.shift();

  if (ballY < 0) {
    ballY = 0;
    ballSpeedY *= -1;
    playBeep(240, 40);
  }
  if (ballY + ballSize > canvas.height) {
    ballY = canvas.height - ballSize;
    ballSpeedY *= -1;
    playBeep(240, 40);
  }

  if (ENABLE_POWERUPS) {
    for (let i = 0; i < powerups.length; i += 1) {
      const powerup = powerups[i];
      const ballCenterX = ballX + ballSize / 2;
      const ballCenterY = ballY + ballSize / 2;
      const powerupCenterX = powerup.x + powerup.size / 2;
      const powerupCenterY = powerup.y + powerup.size / 2;
      if (Math.hypot(ballCenterX - powerupCenterX, ballCenterY - powerupCenterY) < ballSize / 2 + powerup.size / 2) {
        activatePowerup(powerup, ballSpeedX < 0 ? 'player' : 'ai');
        powerups.splice(i, 1);
        break;
      }
    }
  }

  if (!ghostBall && ballX <= playerX + paddleWidth && ballY + ballSize > playerY && ballY < playerY + paddleHeightState.player) {
    ballX = playerX + paddleWidth;
    ballSpeedX *= -1.1;
    const collidePoint = ballY + ballSize / 2 - (playerY + paddleHeightState.player / 2);
    ballSpeedY = collidePoint * 0.22 + (Math.random() - 0.5) * 2;
    rallyCount += 1;
    playBeep(520, 45);
    paddleHitAnim('player');
  }

  if (!ghostBall && ballX + ballSize >= aiX && ballY + ballSize > aiY && ballY < aiY + paddleHeightState.ai) {
    ballX = aiX - ballSize;
    ballSpeedX *= -1.1;
    const collidePoint = ballY + ballSize / 2 - (aiY + paddleHeightState.ai / 2);
    ballSpeedY = collidePoint * 0.22 + (Math.random() - 0.5) * 2;
    rallyCount += 1;
    playBeep(520, 45);
    paddleHitAnim('ai');
  }

  if (ballX < 0) {
    aiScore += 1;
    updateScoreboard();
    animateScore('ai');
    playBeep(180, 120);
    powerups = [];
    resetBall();
  }

  if (ballX + ballSize > canvas.width) {
    playerScore += 1;
    updateScoreboard();
    animateScore('player');
    playBeep(680, 120);
    powerups = [];
    resetBall();
  }

  if (!twoPlayer) {
    const aiCenter = aiY + paddleHeightState.ai / 2;
    const ballCenter = ballY + ballSize / 2;
    if (aiCenter < ballCenter - 18) aiY += Math.min(8, ballCenter - aiCenter);
    else if (aiCenter > ballCenter + 18) aiY -= Math.min(8, aiCenter - ballCenter);
    aiY = clamp(aiY, 0, canvas.height - paddleHeightState.ai);
  }

  if (playerScore >= WINNING_SCORE || aiScore >= WINNING_SCORE) {
    gameOver = true;
    message.textContent = playerScore > aiScore
      ? (twoPlayer ? 'Player 1 Wins! 🎉' : 'You Win! 🎉')
      : (twoPlayer ? 'Player 2 Wins! 🎉' : 'AI Wins!');
    restartBtn.hidden = false;
    ballSpeedX = 0;
    ballSpeedY = 0;
  }
}

const keys = {};

function paddleKeyboardMove() {
  if (reverseControls) {
    if (keys.w || keys.arrowup) playerY = clamp(playerY + 12, 0, canvas.height - paddleHeightState.player);
    if (keys.s || keys.arrowdown) playerY = clamp(playerY - 12, 0, canvas.height - paddleHeightState.player);
  } else {
    if (keys.w) playerY = clamp(playerY - 12, 0, canvas.height - paddleHeightState.player);
    if (keys.s) playerY = clamp(playerY + 12, 0, canvas.height - paddleHeightState.player);
  }

  if (twoPlayer) {
    if (reverseControls) {
      if (keys.arrowup) aiY = clamp(aiY + 12, 0, canvas.height - paddleHeightState.ai);
      if (keys.arrowdown) aiY = clamp(aiY - 12, 0, canvas.height - paddleHeightState.ai);
    } else {
      if (keys.arrowup) aiY = clamp(aiY - 12, 0, canvas.height - paddleHeightState.ai);
      if (keys.arrowdown) aiY = clamp(aiY + 12, 0, canvas.height - paddleHeightState.ai);
    }
  }
}

function positionFromPointer(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

canvas.addEventListener('mousemove', (event) => {
  if (paused || gameOver) return;
  const pointer = positionFromPointer(event.clientX, event.clientY);
  if (twoPlayer) {
    if (pointer.x < canvas.width / 2) {
      playerY = clamp(pointer.y - paddleHeightState.player / 2, 0, canvas.height - paddleHeightState.player);
    } else {
      aiY = clamp(pointer.y - paddleHeightState.ai / 2, 0, canvas.height - paddleHeightState.ai);
    }
  } else {
    playerY = clamp(pointer.y - paddleHeightState.player / 2, 0, canvas.height - paddleHeightState.player);
  }
});

canvas.addEventListener('touchmove', (event) => {
  if (paused || gameOver) return;
  for (const touch of event.touches) {
    const pointer = positionFromPointer(touch.clientX, touch.clientY);
    if (twoPlayer) {
      if (pointer.x < canvas.width / 2) {
        playerY = clamp(pointer.y - paddleHeightState.player / 2, 0, canvas.height - paddleHeightState.player);
      } else {
        aiY = clamp(pointer.y - paddleHeightState.ai / 2, 0, canvas.height - paddleHeightState.ai);
      }
    } else {
      playerY = clamp(pointer.y - paddleHeightState.player / 2, 0, canvas.height - paddleHeightState.player);
    }
  }
  event.preventDefault();
}, { passive: false });

window.addEventListener('keydown', (event) => {
  keys[event.key.toLowerCase()] = true;
  if (event.key === ' ' || event.key.toLowerCase() === 'p') {
    paused = !paused;
    message.textContent = paused ? 'Paused' : '';
    event.preventDefault();
  }
  if (event.key.toLowerCase() === 'r' && gameOver) restartGame();
});

window.addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false;
});

canvas.addEventListener('click', () => {
  if (gameOver) return;
  paused = !paused;
  message.textContent = paused ? 'Paused' : '';
});

function openModal() {
  winScoreInput.value = String(WINNING_SCORE);
  ballSpeedInput.value = String(BALL_SPEED);
  ballSpeedLabel.textContent = String(BALL_SPEED);
  soundToggle.checked = ENABLE_SOUND;
  powerupToggle.checked = ENABLE_POWERUPS;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
}

function closeModalDialog() {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
}

function restartGame() {
  playerScore = 0;
  aiScore = 0;
  playerY = (canvas.height - basePaddleHeight) / 2;
  aiY = (canvas.height - basePaddleHeight) / 2;
  paddleHeightState = { player: basePaddleHeight, ai: basePaddleHeight };
  message.textContent = '';
  restartBtn.hidden = true;
  paused = false;
  gameOver = false;
  rallyCount = 0;
  powerups = [];
  activePowerup = null;
  ghostBall = false;
  reverseControls = false;
  if (powerupTimeout) clearTimeout(powerupTimeout);
  powerupTimeout = null;
  updateScoreboard();
  resetBall();
}

modeBtn.addEventListener('click', () => {
  twoPlayer = !twoPlayer;
  modeBtn.textContent = twoPlayer ? 'Switch to AI Mode' : 'Switch to 2 Player Mode';
  message.textContent = twoPlayer
    ? '2 Player Mode: P1=W/S, P2=↑/↓, or split touch controls.'
    : 'AI Mode: Control the left paddle with mouse, touch, or W/S.';
  restartGame();
  saveGameData();
});

themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveGameData();
});

settingsBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalDialog);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModalDialog();
});
ballSpeedInput.addEventListener('input', () => {
  ballSpeedLabel.textContent = ballSpeedInput.value;
});
applySettingsBtn.addEventListener('click', () => {
  WINNING_SCORE = parseInt(winScoreInput.value, 10) || 5;
  BALL_SPEED = parseInt(ballSpeedInput.value, 10) || 6;
  ENABLE_SOUND = soundToggle.checked;
  ENABLE_POWERUPS = powerupToggle.checked;
  closeModalDialog();
  restartGame();
  saveGameData();
});

fullscreenBtn.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await canvas.requestFullscreen();
    }
  } catch {
    message.textContent = 'Fullscreen is unavailable on this device.';
  }
});

restartBtn.addEventListener('click', restartGame);

function gameLoop() {
  paddleKeyboardMove();
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function init() {
  loadGameData();
  applyTheme();
  closeModalDialog();
  modeBtn.textContent = twoPlayer ? 'Switch to AI Mode' : 'Switch to 2 Player Mode';
  updateScoreboard();
  resetBall();
  message.textContent = `First to ${WINNING_SCORE} wins. Tap the canvas or press Space/P to pause.`;
}

init();
gameLoop();
