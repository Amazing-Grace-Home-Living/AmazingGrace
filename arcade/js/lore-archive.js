loadRebellionState();

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

  return true;
}

function decryptFile(element, text) {
  element.style.display = 'block';
  element.textContent = '';

  let i = 0;
  const interval = setInterval(() => {
    element.textContent = text.slice(0, i);
    i += 1;

    if (i > text.length) {
      clearInterval(interval);
    }
  }, 15);
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
      fileEl.addEventListener('click', () => decryptFile(content, file.content));
    }

    filesRoot.appendChild(fileEl);
  });

  updateHUD();

  const status = document.getElementById('syndicate-ai');
  if (status) {
    status.innerHTML = `
      <div>Syndicate AI: Tracking Archive breach attempts...</div>
      <div>Unlocked files: ${unlockedCount}/${LORE_FILES.length}</div>
      ${status.innerHTML}
    `;
  }
}

renderLoreArchive();
