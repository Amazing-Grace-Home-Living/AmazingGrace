loadRebellionState();
const activeDecryptions = new Map();

function formatUnlockHint(requirements = {}) {
  const hints = [];

  if (requirements.stars) {
    for (const [game, needed] of Object.entries(requirements.stars)) {
      hints.push(`${game} ★${needed}`);
    }
  }

  if (requirements.items) {
    for (const [item, needed] of Object.entries(requirements.items)) {
      hints.push(`${item} x${needed}`);
    }
  }

  if (typeof requirements.threatBelow === 'number') {
    hints.push(`Threat < ${requirements.threatBelow}`);
  }

  if (requirements.bossMutation) {
    hints.push(`Boss mutation: ${requirements.bossMutation}`);
  }

  if (requirements.bossMemoryActive) {
    hints.push('Boss memory active');
  }

  if (requirements.emotionMilestone) {
    hints.push(`Emotion: ${requirements.emotionMilestone}`);
  }

  if (requirements.emotionMax) {
    hints.push('Emotion maxed');
  }

  if (requirements.redemptionPath) {
    hints.push(`Path: ${requirements.redemptionPath}`);
  }

  if (requirements.reincarnationPath) {
    hints.push(`Reincarnation: ${requirements.reincarnationPath}`);
  }

  if (requirements.phaseBreak) {
    hints.push('Phase break recorded');
  }

  return hints.join(' • ');
}

function checkLoreUnlock(requirements = {}) {
  const state = window.rebellionState || {};
  const certs = state.certifications || {};
  const inventory = state.inventory || {};

  if (requirements.stars) {
    for (const [game, needed] of Object.entries(requirements.stars)) {
      if ((certs[game] || 0) < needed) {
        return false;
      }
    }
  }

  if (requirements.items) {
    for (const [item, needed] of Object.entries(requirements.items)) {
      if ((inventory[item] || 0) < needed) {
        return false;
      }
    }
  }

  if (typeof requirements.threatBelow === 'number' && (state.threat || 0) >= requirements.threatBelow) {
    return false;
  }

  if (requirements.bossMutation) {
    const mutations = state.bossMutations || [];
    if (!mutations.includes(requirements.bossMutation)) return false;
  }

  if (requirements.bossMemoryActive && !state.bossMemoryActive) {
    return false;
  }

  if (requirements.emotionMilestone) {
    const history = state.bossEmotionHistory || [];
    if (!history.includes(requirements.emotionMilestone)) return false;
  }

  if (requirements.emotionMax && !state.emotionMax) {
    return false;
  }

  if (requirements.redemptionPath) {
    if (state.redemptionPath !== requirements.redemptionPath) return false;
  }

  if (requirements.reincarnationPath) {
    if (state.reincarnationPath !== requirements.reincarnationPath) return false;
  }

  if (requirements.phaseBreak && !state.phaseBreak) {
    return false;
  }

  return true;
}

function decryptFile(fileId, element, text) {
  const existingInterval = activeDecryptions.get(fileId);
  if (existingInterval) {
    clearInterval(existingInterval);
  }

  element.style.display = 'block';
  element.textContent = '';

  let i = 0;
  const intervalId = setInterval(() => {
    element.textContent = text.slice(0, i);
    i += 1;

    if (i > text.length) {
      clearInterval(intervalId);
      activeDecryptions.delete(fileId);
    }
  }, 15);

  activeDecryptions.set(fileId, intervalId);
}

function unlockAllArchives() {
  const state = window.rebellionState || {};
  state.certifications = {
    starMatrix: 3,
    lookingGlass: 3,
    quantumShift: 3,
    syndicateSiege: 3
  };
  state.threat = 0;
  state.inventory = {
    quantumCore: 1,
    rebellionKey: 1
  };
  state.bossMutations = ['dataOverload', 'spectralEcho', 'quantumFlux', 'armorRegen', 'hybrid', 'prime', 'cataclysmic'];
  state.bossMemory = {
    matchSpeed: 100,
    perfectAlignments: 100,
    hazardDodges: 100,
    towerDamage: 1000,
    weakpointsClearedQuickly: true,
    preferredGame: 'starMatrix'
  };
  state.bossMemoryActive = true;
  state.bossEmotion = { anger: 100, fear: 100, obsession: 100, despair: 100, respect: 100 };
  state.emotionMilestone = 'obsession';
  state.emotionMax = true;
  state.bossRedemption = { light: 100, dark: 0 };
  state.redemptionPath = 'REDEMPTION';
  state.bossReincarnation = { level: 3, deaths: 2, lastDeath: Date.now(), path: 'ascended' };
  state.reincarnationPath = 'ascended';
  state.phaseBreak = true;
  saveRebellionState();
  renderLoreArchive();
}

function renderLoreArchive() {
  const filesRoot = document.getElementById('la-files');
  if (!filesRoot) {
    return;
  }

  filesRoot.innerHTML = '';
  let unlockedCount = 0;

  LORE_FILES.forEach((file) => {
    const unlocked = checkLoreUnlock(file.unlock);
    if (unlocked) {
      unlockedCount += 1;
    }

    const fileEl = document.createElement('article');
    fileEl.className = `la-file${unlocked ? '' : ' la-locked'}`;

    const title = document.createElement('strong');
    title.textContent = file.title;

    const decryptLabel = document.createElement('div');
    decryptLabel.className = 'la-decrypt';
    decryptLabel.textContent = unlocked
      ? 'Click to decrypt transmission'
      : `LOCKED // ${formatUnlockHint(file.unlock)}`;

    const content = document.createElement('div');
    content.className = 'la-content';
    content.id = file.id;

    fileEl.append(title, decryptLabel, content);

    if (unlocked) {
      const runDecrypt = () => decryptFile(file.id, content, file.content);
      fileEl.setAttribute('role', 'button');
      fileEl.setAttribute('tabindex', '0');
      fileEl.addEventListener('click', runDecrypt);
      fileEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          runDecrypt();
        }
      });
    }

    filesRoot.appendChild(fileEl);
  });

  updateHUD();

  const status = document.getElementById('syndicate-ai');
  if (status) {
    status.textContent = '';
    const aiLine = document.createElement('div');
    aiLine.textContent = 'Syndicate AI: Tracking Archive breach attempts...';
    const unlockedLine = document.createElement('div');
    unlockedLine.textContent = `Unlocked files: ${unlockedCount}/${LORE_FILES.length}`;
    status.append(aiLine, unlockedLine);
  }
}

const unlockAllButton = document.getElementById('la-unlock-all');
if (unlockAllButton) {
  unlockAllButton.addEventListener('click', () => {
    if (window.confirm('Override all security protocols and unlock every archive?')) {
      unlockAllArchives();
    }
  });
}

renderLoreArchive();
