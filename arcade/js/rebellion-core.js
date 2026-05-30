/**
 * rebellion-core.js — Rebellion OS Shared State
 * Manages credits, season XP, certifications, inventory, cosmetics, and threat level.
 * localStorage-backed, GitHub Pages compatible.
 */

const REBELLION_KEY = "rebellion_state";

const DEFAULT_STATE = {
  credits: 500,
  seasonXP: 0,
  threat: 0,
  certifications: {},
  inventory: {},
  cosmetics: {
    owned: {},
    equipped: {
      uiTheme: null,
      towerSkin: null,
      starMatrixSkin: null,
      quantumStreamSkin: null,
      lookingGlassFilter: null,
    },
  },
  lore: {},
};

let rebellionState = { ...DEFAULT_STATE };

function loadRebellionState() {
  try {
    const raw = localStorage.getItem(REBELLION_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      rebellionState = {
        ...DEFAULT_STATE,
        ...saved,
        cosmetics: {
          owned: saved.cosmetics?.owned ?? {},
          equipped: { ...DEFAULT_STATE.cosmetics.equipped, ...(saved.cosmetics?.equipped ?? {}) },
        },
        inventory: saved.inventory ?? {},
        certifications: saved.certifications ?? {},
        lore: saved.lore ?? {},
      };
    }
  } catch (e) {
    console.warn("rebellion-core: failed to load state", e);
  }
}

function saveRebellionState() {
  try {
    localStorage.setItem(REBELLION_KEY, JSON.stringify(rebellionState));
  } catch (e) {
    console.warn("rebellion-core: failed to save state", e);
  }
}

/* ─── Credits ─── */

function addCredits(amount) {
  rebellionState.credits = (rebellionState.credits || 0) + amount;
  saveRebellionState();
  updateHUD();
}

function spendCredits(amount) {
  if ((rebellionState.credits || 0) < amount) return false;
  rebellionState.credits -= amount;
  saveRebellionState();
  updateHUD();
  return true;
}

/* ─── Inventory Items ─── */

function addItem(itemId, qty = 1) {
  rebellionState.inventory[itemId] = (rebellionState.inventory[itemId] || 0) + qty;
  saveRebellionState();
}

function spendItem(itemId, qty = 1) {
  if ((rebellionState.inventory[itemId] || 0) < qty) return false;
  rebellionState.inventory[itemId] -= qty;
  saveRebellionState();
  return true;
}

/* ─── Season XP ─── */

function addSeasonXP(amount) {
  rebellionState.seasonXP = (rebellionState.seasonXP || 0) + amount;
  saveRebellionState();
  updateHUD();
}

/* ─── Certifications / Stars ─── */

function setCertification(gameId, stars) {
  const current = rebellionState.certifications[gameId] || 0;
  if (stars > current) {
    rebellionState.certifications[gameId] = stars;
    saveRebellionState();
  }
}

/* ─── Threat Level ─── */

function getThreatTier() {
  const t = rebellionState.threat || 0;
  if (t >= 80) return 5;
  if (t >= 60) return 4;
  if (t >= 40) return 3;
  if (t >= 20) return 2;
  return 1;
}

function addThreat(amount) {
  rebellionState.threat = Math.min(100, (rebellionState.threat || 0) + amount);
  saveRebellionState();
}

/* ─── Lore ─── */

function unlockLore(loreId) {
  rebellionState.lore[loreId] = true;
  saveRebellionState();
}

/* ─── Cosmetics ─── */

function checkCosmeticUnlock(cosmetic) {
  const c = rebellionState.certifications;

  if (cosmetic.unlock.stars) {
    for (const [game, needed] of Object.entries(cosmetic.unlock.stars)) {
      if ((c[game] || 0) < needed) return false;
    }
  }

  if (cosmetic.unlock.items) {
    for (const [item, needed] of Object.entries(cosmetic.unlock.items)) {
      if ((rebellionState.inventory[item] || 0) < needed) return false;
    }
  }

  if (cosmetic.unlock.threatBelow !== undefined) {
    if ((rebellionState.threat || 0) >= cosmetic.unlock.threatBelow) return false;
  }

  return true;
}

function equipCosmetic(type, id) {
  rebellionState.cosmetics.equipped[type] = id;
  saveRebellionState();
  applyUITheme();
}

function applyUITheme() {
  const id = rebellionState.cosmetics.equipped.uiTheme;
  if (!id) return;

  switch (id) {
    case "theme_neon":
      document.documentElement.style.setProperty("--ui-bg", "#050014");
      document.documentElement.style.setProperty("--ui-accent", "#ff00ff");
      break;
    case "theme_synth":
      document.documentElement.style.setProperty("--ui-bg", "#0a0f1f");
      document.documentElement.style.setProperty("--ui-accent", "#ff8b3d");
      break;
  }
}

/* ─── HUD ─── */

function updateHUD() {
  const credEl = document.getElementById("rebel-credits");
  const xpEl = document.getElementById("rebel-xp");
  const threatEl = document.getElementById("rebel-threat");
  if (credEl) credEl.textContent = rebellionState.credits || 0;
  if (xpEl) xpEl.textContent = rebellionState.seasonXP || 0;
  if (threatEl) threatEl.textContent = rebellionState.threat || 0;
}
