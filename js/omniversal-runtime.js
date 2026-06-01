const AFFINITY_ALIGNMENT_THRESHOLD = 20;
const HIGH_THRESHOLD = 65;
const LOW_THRESHOLD = 35;
const LOCK_DURATION_MS = 30000;
const CO_APEX_BEAST_WEIGHT = 0.55;
const CO_APEX_DEVOURER_WEIGHT = 0.45;
const MAX_ACTIVE_EVENTS = 20;
const MAX_HISTORY_ENTRIES = 120;

const DEFAULT_MIN_MAX = {
  worldAlignment: [-100, 100],
  factionTrust: [0, 100],
  timelineInstability: [0, 100],
  sovereignAffinity: [-100, 100],
};

export const coApexGravity = {
  bloomingBeast: { worldAlignment: 1.1, factionTrust: -0.5, timelineInstability: 0.8, sovereignAffinity: 0.9 },
  genesisDevourer: { worldAlignment: -1.1, factionTrust: 0.7, timelineInstability: -0.5, sovereignAffinity: -0.9 },
};

function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}

function randomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}

function createId() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeVeilState(metrics) {
  return metrics.timelineInstability >= HIGH_THRESHOLD ? 'unveiled' : 'veiled';
}

function getVeilSystemEffects(veilState) {
  if (veilState === 'unveiled') {
    return {
      instabilityMultiplier: 1.25,
      eventRiskMultiplier: 1.4,
      trustResilience: 0.85,
    };
  }
  return {
    instabilityMultiplier: 0.85,
    eventRiskMultiplier: 0.9,
    trustResilience: 1.1,
  };
}

export class Timeline {
  constructor(overrides = {}) {
    this.id = overrides.id || 'primary';
    this.instability = Number(overrides.instability) || 0;
    this.factions = Array.isArray(overrides.factions) ? [...overrides.factions] : [];
    this.history = Array.isArray(overrides.history) ? [...overrides.history] : [];
    this.activeEvents = Array.isArray(overrides.activeEvents) ? [...overrides.activeEvents] : [];
    this.dominantEmotion = overrides.dominantEmotion || 'wonder';
    this.veilState = overrides.veilState || 'veiled';
  }
}

export function createWorldState(overrides = {}) {
  const metrics = {
    worldAlignment: Number(overrides.metrics?.worldAlignment ?? 0),
    factionTrust: Number(overrides.metrics?.factionTrust ?? 50),
    timelineInstability: Number(overrides.metrics?.timelineInstability ?? 50),
    sovereignAffinity: Number(overrides.metrics?.sovereignAffinity ?? 0),
  };

  const bindings = {
    worldAlignment: { apex: 'none', timeline: 'free' },
    factionTrust: { apex: 'none', timeline: 'free' },
    timelineInstability: { apex: 'none', timeline: 'free' },
    sovereignAffinity: { apex: 'none', timeline: 'free' },
    ...(overrides.bindings || {}),
  };

  const timeline = overrides.timeline instanceof Timeline
    ? overrides.timeline
    : new Timeline({
      ...overrides.timeline,
      instability: Number(overrides.timeline?.instability ?? metrics.timelineInstability),
      veilState: normalizeVeilState(metrics),
    });

  return {
    metrics,
    minMax: DEFAULT_MIN_MAX,
    locks: { ...(overrides.locks || {}) },
    bindings,
    autoUpdateEnabled: overrides.autoUpdateEnabled !== false,
    timeline,
    lastEvent: null,
    lastNarrative: 'Awaiting synthesis pulse...',
  };
}

export function generateEvent({
  source,
  severity,
  apex,
  era,
  affectedFactions = [],
  mutationRisk,
  timelineId = 'primary',
  dominantEmotion = 'wonder',
  createdAt = Date.now(),
}) {
  return {
    id: createId(),
    source: source || 'ambientPressure',
    severity: clamp(Number(severity) || 0, [0, 100]),
    apex: apex || 'Blooming Beast',
    era: era || 'Dawn Concord',
    affectedFactions: Array.isArray(affectedFactions) ? [...affectedFactions] : [],
    mutationRisk: clamp(Number(mutationRisk) || 0, [0, 1]),
    timelineId,
    dominantEmotion,
    createdAt,
  };
}

export function synthesizeNarrative(event) {
  const stage = event.severity >= HIGH_THRESHOLD ? 'Seventh Bloom Collapse' : 'Veil Concord';
  const breach = event.apex === 'Blooming Beast' ? 'Scarlet Weaver pierced the Veil of Janus' : 'Genesis Choir rewove the Janus lattice';
  return `During the ${stage}, ${breach} as ${event.source} surged through timeline ${event.timelineId}.`;
}

function createSignalMap(metrics, veilState) {
  return {
    worldAlignment: metrics.worldAlignment > AFFINITY_ALIGNMENT_THRESHOLD
      ? 'Hunt dominance: harsher and instinctual'
      : metrics.worldAlignment < -AFFINITY_ALIGNMENT_THRESHOLD
        ? 'Genesis dominance: fertile and expansive'
        : 'Balanced heartbeat',
    factionTrust: metrics.factionTrust >= HIGH_THRESHOLD
      ? 'High trust: dynasties unify'
      : metrics.factionTrust <= LOW_THRESHOLD
        ? 'Low trust: dynasties fracture'
        : 'Mixed trust: volatility',
    timelineInstability: metrics.timelineInstability >= HIGH_THRESHOLD
      ? 'High instability: fractal storms'
      : metrics.timelineInstability <= LOW_THRESHOLD
        ? 'Low instability: stable dual-flow web'
        : 'Temporal tension field',
    sovereignAffinity: metrics.sovereignAffinity >= AFFINITY_ALIGNMENT_THRESHOLD
      ? 'Hunt affinity: predatory sovereigns'
      : metrics.sovereignAffinity <= -AFFINITY_ALIGNMENT_THRESHOLD
        ? 'Genesis affinity: creative sovereigns'
        : 'Balanced affinity: hybrid sovereigns',
    veilState: veilState === 'unveiled'
      ? 'Unveiled state: hidden entities surface'
      : 'Veiled state: timelines constrained',
  };
}

export function createOmniversalRuntime(initialState = {}) {
  const worldState = createWorldState(initialState);

  function isLocked(key, now = Date.now()) {
    return typeof worldState.locks[key] === 'number' && worldState.locks[key] > now;
  }

  function updateVeilState() {
    worldState.timeline.veilState = normalizeVeilState(worldState.metrics);
    worldState.timeline.instability = worldState.metrics.timelineInstability;
  }

  function updateMetric(key, delta, reason, { force = false, now = Date.now() } = {}) {
    if (!force && isLocked(key, now)) {
      worldState.lastEvent = `${reason} (blocked: ${key} is locked)`;
      return false;
    }

    worldState.metrics[key] = clamp(worldState.metrics[key] + delta, worldState.minMax[key]);
    worldState.lastEvent = reason;
    updateVeilState();
    return true;
  }

  function applyFeedbackLoop() {
    const veilEffects = getVeilSystemEffects(worldState.timeline.veilState);
    const metrics = worldState.metrics;
    updateMetric('factionTrust', ((metrics.worldAlignment < 0 ? 0.6 : -0.6) + (metrics.sovereignAffinity > 0 ? -0.3 : 0.3)) * veilEffects.trustResilience, 'Feedback loop: alignment reshapes trust');
    updateMetric('timelineInstability', (((50 - metrics.factionTrust) / 100) * 1.8) * veilEffects.instabilityMultiplier, 'Feedback loop: trust reshapes timeline');
    updateMetric('sovereignAffinity', ((metrics.timelineInstability - 50) / 100) * 2, 'Feedback loop: timeline reshapes affinity');
    updateMetric('worldAlignment', (metrics.sovereignAffinity / 100) * 1.4, 'Feedback loop: affinity reshapes alignment');
  }

  function applyBindings() {
    for (const key of Object.keys(worldState.bindings)) {
      const binding = worldState.bindings[key];
      if (binding.apex !== 'none') {
        updateMetric(key, coApexGravity[binding.apex][key] * 0.6, `Bound Co‑Apex gravity applied to ${key}`);
      }
      if (binding.timeline === 'bloom') updateMetric(key, key === 'timelineInstability' ? -0.8 : 0.5, `Timeline bloom influences ${key}`);
      if (binding.timeline === 'fracture') updateMetric(key, key === 'timelineInstability' ? 1.2 : -0.4, `Timeline fracture influences ${key}`);
      if (binding.timeline === 'collapse') updateMetric(key, key === 'timelineInstability' ? 1.6 : -0.6, `Timeline collapse influences ${key}`);
    }
  }

  function applyCoApexGravity() {
    for (const key of Object.keys(worldState.metrics)) {
      const influence = (coApexGravity.bloomingBeast[key] * CO_APEX_BEAST_WEIGHT) + (coApexGravity.genesisDevourer[key] * CO_APEX_DEVOURER_WEIGHT);
      updateMetric(key, influence * 0.25, `Co‑Apex gravity oscillation: ${key}`);
    }
  }

  function compileEvent(source) {
    const metrics = worldState.metrics;
    const veilEffects = getVeilSystemEffects(worldState.timeline.veilState);
    const severity = Math.max(
      Math.abs(metrics.worldAlignment),
      metrics.factionTrust,
      metrics.timelineInstability,
      Math.abs(metrics.sovereignAffinity),
    );
    const apex = metrics.sovereignAffinity >= 0 ? 'Blooming Beast' : 'Genesis Devourer';
    const event = generateEvent({
      source,
      severity,
      apex,
      era: worldState.timeline.history.at(-1)?.era || 'Dawn Concord',
      affectedFactions: worldState.timeline.factions,
      mutationRisk: (metrics.timelineInstability / 100) * veilEffects.eventRiskMultiplier,
      timelineId: worldState.timeline.id,
    });

    worldState.timeline.activeEvents = [...worldState.timeline.activeEvents, event].slice(-MAX_ACTIVE_EVENTS);
    worldState.timeline.history = [...worldState.timeline.history, {
      at: event.createdAt,
      era: event.era,
      source: event.source,
      id: event.id,
    }].slice(-MAX_HISTORY_ENTRIES);

    worldState.lastNarrative = synthesizeNarrative(event);
    worldState.lastEvent = `${source} triggered.`;
    return event;
  }

  function triggerEvent(eventKey) {
    const handlers = {
      predator: () => {
        updateMetric('worldAlignment', 12, 'Predator event: Hunt rises');
        updateMetric('factionTrust', -5, 'Predator event: trust fractures');
      },
      creation: () => {
        updateMetric('worldAlignment', -12, 'Creation burst: Genesis rises');
        updateMetric('timelineInstability', -4, 'Creation burst: time blooms');
      },
      'co-apex': () => {
        updateMetric('worldAlignment', 3, 'Co‑Apex intervention: Blooming Beast surges');
        updateMetric('sovereignAffinity', -3, 'Co‑Apex intervention: Genesis Devourer answers');
      },
      timeline: () => {
        updateMetric('timelineInstability', 9, 'Timeline behavior spike: temporal split');
        updateMetric('sovereignAffinity', 3, 'Timeline behavior spike: affinity drift');
      },
      sovereign: () => {
        updateMetric('sovereignAffinity', randomSign() * 8, 'Sovereign action: allegiance shift');
      },
      faction: () => {
        updateMetric('factionTrust', randomSign() * 10, 'Faction victory: trust field altered');
      },
      fear: () => {
        updateMetric('timelineInstability', 10, 'Fear rises: time accelerates');
        updateMetric('factionTrust', -4, 'Fear rises: trust destabilizes');
      },
      singularity: () => {
        updateMetric('timelineInstability', 14, 'Singularities stir: temporal rupture');
        updateMetric('sovereignAffinity', 4, 'Singularities stir: sovereign drift');
      },
      emotional: () => {
        updateMetric('factionTrust', randomSign() * 7, 'Emotional physics spike: social field reweaves');
        updateMetric('sovereignAffinity', randomSign() * 7, 'Emotional physics spike: soul gravity shifts');
      },
      era: () => {
        updateMetric('sovereignAffinity', randomSign() * 9, 'New era begins: sovereign allegiance recalibrates');
        updateMetric('worldAlignment', randomSign() * 5, 'New era begins: world alignment tide turns');
      },
    };

    if (handlers[eventKey]) {
      handlers[eventKey]();
      return compileEvent(eventKey);
    }

    return null;
  }

  function applyOverride(action, {
    target = 'worldAlignment',
    magnitude = 0,
    apex = 'none',
    timelineMode = 'free',
    now = Date.now(),
  } = {}) {
    if (!Object.hasOwn(worldState.metrics, target)) {
      return { status: 'Invalid override target.' };
    }

    if (action === 'nudge') {
      const updated = updateMetric(target, magnitude, `Architect nudge on ${target}`, { now });
      return { status: updated ? `Architect nudged ${target} by ${magnitude}.` : `${target} is locked.` };
    }

    if (action === 'force') {
      worldState.metrics[target] = clamp(magnitude, worldState.minMax[target]);
      updateVeilState();
      return { status: `Architect force-shifted ${target} to ${Math.round(worldState.metrics[target])}.` };
    }

    if (action === 'lock') {
      worldState.locks[target] = now + LOCK_DURATION_MS;
      return { status: `${target} locked for 30 seconds.` };
    }

    if (action === 'chaos') {
      for (const key of Object.keys(worldState.metrics)) {
        if (isLocked(key, now)) continue;
        const [min, max] = worldState.minMax[key];
        worldState.metrics[key] = Math.random() * (max - min) + min;
      }
      updateVeilState();
      return { status: 'Architect unleashed controlled chaos.' };
    }

    if (action === 'bindApex') {
      worldState.bindings[target].apex = apex;
      return { status: `${target} bound to ${worldState.bindings[target].apex}.` };
    }

    if (action === 'bindTimeline') {
      worldState.bindings[target].timeline = timelineMode;
      return { status: `${target} tied to timeline mode: ${worldState.bindings[target].timeline}.` };
    }

    if (action === 'wild') {
      worldState.autoUpdateEnabled = !worldState.autoUpdateEnabled;
      return { status: worldState.autoUpdateEnabled ? 'System running wild.' : 'System pulse paused for manual control.' };
    }

    return { status: 'Unknown override action.' };
  }

  function tick() {
    if (!worldState.autoUpdateEnabled) return null;
    applyCoApexGravity();
    applyBindings();
    applyFeedbackLoop();
    return compileEvent('autoPulse');
  }

  function getRenderState() {
    updateVeilState();
    const metrics = worldState.metrics;
    return {
      metrics: {
        worldAlignment: Math.round(metrics.worldAlignment),
        factionTrust: Math.round(metrics.factionTrust),
        timelineInstability: Math.round(metrics.timelineInstability),
        sovereignAffinity: Math.round(metrics.sovereignAffinity),
      },
      signals: createSignalMap(metrics, worldState.timeline.veilState),
      lastEvent: worldState.lastEvent,
      lastNarrative: worldState.lastNarrative,
      autoUpdateEnabled: worldState.autoUpdateEnabled,
      veilState: worldState.timeline.veilState,
      timeline: worldState.timeline,
    };
  }

  return {
    applyFeedbackLoop,
    applyBindings,
    applyCoApexGravity,
    triggerEvent,
    applyOverride,
    tick,
    getRenderState,
    coApexGravity,
  };
}
