(function rebellionCoreBootstrap(global) {
  const STORAGE_KEY = 'rebellion_core_state_v1';
  const defaultState = {
    certifications: {
      starMatrix: 0,
      lookingGlass: 0,
      quantumShift: 0,
      syndicateSiege: 0
    },
    dailyMissions: {
      completed: 0,
      streak: 0
    },
    threat: 100,
    inventory: {
      quantumCore: 0,
      rebellionKey: 0
    }
  };

  function mergeDeep(base, incoming) {
    if (!incoming || typeof incoming !== 'object') {
      return base;
    }

    const merged = { ...base };
    for (const [key, value] of Object.entries(incoming)) {
      const baseValue = base[key];
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        baseValue &&
        typeof baseValue === 'object' &&
        !Array.isArray(baseValue)
      ) {
        merged[key] = mergeDeep(baseValue, value);
      } else {
        merged[key] = value;
      }
    }

    return merged;
  }

  function loadRebellionState() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      global.rebellionState = mergeDeep(defaultState, parsed);
    } catch {
      global.rebellionState = { ...defaultState };
    }

    return global.rebellionState;
  }

  function saveRebellionState() {
    if (!global.rebellionState) {
      return;
    }

    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(global.rebellionState));
    } catch {
      // best-effort persistence
    }
  }

  function updateHUD() {
    const root = global.document && global.document.getElementById('syndicate-ai');
    if (!root || !global.rebellionState) {
      return;
    }

    const { certifications = {}, dailyMissions = {}, threat = 100, inventory = {} } = global.rebellionState;

    root.innerHTML = [
      `<div>Threat Level: ${threat}</div>`,
      `<div>Daily Missions: ${dailyMissions.completed || 0} completed</div>`,
      `<div>Inventory: ${Object.keys(inventory).length ? 'synced' : 'empty'}</div>`,
      `<div>Stars — Matrix:${certifications.starMatrix || 0} Looking Glass:${certifications.lookingGlass || 0} Quantum Shift:${certifications.quantumShift || 0} Siege:${certifications.syndicateSiege || 0}</div>`
    ].join('');
  }

  global.loadRebellionState = loadRebellionState;
  global.saveRebellionState = saveRebellionState;
  global.updateHUD = updateHUD;

  if (!global.rebellionState) {
    loadRebellionState();
  }
})(window);
