const ALIGNMENT_MIN = -100;
const ALIGNMENT_MAX = 100;
const SYSTEM_MIN = 0;
const SYSTEM_MAX = 100;
export const TIMELINE_INTENSITY_DIVISOR = 12;
const CORRUPTION_EXILE_THRESHOLD = 80;
const FRACTAL_STORM_MUTATION = 'fractal-storm';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cloneHistory(history = {}) {
  return {
    previousEras: Array.isArray(history.previousEras) ? [...history.previousEras] : [],
    collapsedTimelines: Array.isArray(history.collapsedTimelines) ? [...history.collapsedTimelines] : [],
    extinctDynasties: Array.isArray(history.extinctDynasties) ? [...history.extinctDynasties] : [],
    apexVictories: Array.isArray(history.apexVictories) ? [...history.apexVictories] : [],
  };
}

function cloneSovereignAffinity(affinity = {}) {
  return {
    genesis: Number(affinity.genesis) || 0,
    hunt: Number(affinity.hunt) || 0,
  };
}

function cloneEmotions(emotions = {}) {
  return {
    fear: Number(emotions.fear) || 0,
    wonder: Number(emotions.wonder) || 0,
    rage: Number(emotions.rage) || 0,
    hope: Number(emotions.hope) || 0,
    hunger: Number(emotions.hunger) || 0,
    reverence: Number(emotions.reverence) || 0,
  };
}

function cloneApexPressure(apexPressure = {}) {
  return {
    bloomingBeast: { influence: Number(apexPressure.bloomingBeast?.influence) || 0 },
    genesisDevourer: { influence: Number(apexPressure.genesisDevourer?.influence) || 0 },
  };
}

function cloneSovereigns(sovereigns = []) {
  return sovereigns.map((sovereign) => ({ ...sovereign }));
}

export function createSovereign(overrides = {}) {
  return {
    name: overrides.name || 'Unnamed Sovereign',
    instinct: overrides.instinct || 'hunt',
    trauma: Number(overrides.trauma) || 0,
    loyalty: Number(overrides.loyalty) || 50,
    metamorphosisStage: Number(overrides.metamorphosisStage) || 1,
    desire: overrides.desire || 'preserve-order',
    ideologicalMemory: Array.isArray(overrides.ideologicalMemory) ? [...overrides.ideologicalMemory] : [],
    adaptation: Number(overrides.adaptation) || 0,
    corruption: Number(overrides.corruption) || 0,
    fear: Number(overrides.fear) || 0,
    status: overrides.status || 'active',
  };
}

export function createInitialIntelligentEngineState(overrides = {}) {
  return {
    worldAlignment: Number(overrides.worldAlignment) || 0,
    timelineInstability: Number(overrides.timelineInstability) || 0,
    factionTrust: Number(overrides.factionTrust) || 50,
    sovereignAffinity: cloneSovereignAffinity(overrides.sovereignAffinity),
    emotions: cloneEmotions(overrides.emotions),
    history: cloneHistory(overrides.history),
    apexPressure: cloneApexPressure(overrides.apexPressure),
    sovereigns: Array.isArray(overrides.sovereigns)
      ? cloneSovereigns(overrides.sovereigns)
      : [createSovereign({ name: 'Prime Sovereign', instinct: 'hunt' })],
    recentMutations: Array.isArray(overrides.recentMutations) ? [...overrides.recentMutations] : [],
    recentEvents: Array.isArray(overrides.recentEvents) ? [...overrides.recentEvents] : [],
  };
}

function calculateMemoryBias(history) {
  const collapseCount = history.collapsedTimelines.length;
  const huntEraCount = history.previousEras.filter((era) => era === 'hunt').length;
  const failedGenesisCount = history.previousEras.filter((era) => era === 'failed-genesis').length;

  return {
    instabilitySensitivity: collapseCount * 0.02,
    huntMomentum: huntEraCount * 0.015,
    genesisCorruption: failedGenesisCount * 0.02,
    ghostFactionPressure: history.extinctDynasties.length * 0.5,
  };
}

function updateApexPressure(apexPressure, emotions) {
  const bloomingBeastInfluence = clamp(
    apexPressure.bloomingBeast.influence + emotions.fear * 0.2 + emotions.hunger * 0.15,
    SYSTEM_MIN,
    SYSTEM_MAX,
  );

  const genesisDevourerInfluence = clamp(
    apexPressure.genesisDevourer.influence + emotions.wonder * 0.3 + emotions.rage * 0.1,
    SYSTEM_MIN,
    SYSTEM_MAX,
  );

  return {
    bloomingBeast: { influence: bloomingBeastInfluence },
    genesisDevourer: { influence: genesisDevourerInfluence },
  };
}

function evolveSovereigns(sovereigns, emotions, mutationNames) {
  return sovereigns.map((sovereign) => {
    const next = { ...sovereign };
    next.fear = clamp((next.fear || 0) + emotions.fear * 0.05, SYSTEM_MIN, SYSTEM_MAX);
    next.corruption = clamp((next.corruption || 0) + emotions.rage * 0.05, SYSTEM_MIN, SYSTEM_MAX);

    if (mutationNames.includes('dynasty-schism')) {
      next.loyalty = clamp((next.loyalty || 0) - 15, SYSTEM_MIN, SYSTEM_MAX);
      next.trauma = clamp((next.trauma || 0) + 10, SYSTEM_MIN, SYSTEM_MAX);
    }

    if (mutationNames.includes('predator-era-awakened')) {
      next.metamorphosisStage = (next.metamorphosisStage || 1) + 1;
      next.instinct = 'hunt';
    }

    if (next.corruption > CORRUPTION_EXILE_THRESHOLD) {
      next.status = 'exiled';
    }

    return next;
  });
}

function triggerMutations(state, timestamp) {
  const mutations = [];

  if (state.timelineInstability > 80) {
    mutations.push({
      name: FRACTAL_STORM_MUTATION,
      at: timestamp,
      detail: 'The Crimson Spiral Hunt begins across collapsing timelines.',
    });
  }

  if (state.factionTrust < 20) {
    mutations.push({
      name: 'dynasty-schism',
      at: timestamp,
      detail: 'A dynasty fractures into rival ghost factions.',
    });
  }

  if (state.sovereignAffinity.hunt > 70 && state.worldAlignment > 60) {
    mutations.push({
      name: 'predator-era-awakened',
      at: timestamp,
      detail: 'Predator Era awakened by converging hunt affinity and world alignment.',
    });
  }

  return mutations;
}

function determineEventSource(firstMutation) {
  if (!firstMutation) {
    return 'ambientPressure';
  }

  if (firstMutation.name === FRACTAL_STORM_MUTATION) {
    return 'timelineInstability';
  }

  return 'sovereignMutation';
}

export function generateAutonomousEvent({ source, intensity, emotion, dominantApex }) {
  const normalizedIntensity = Math.max(0, Math.round(Number(intensity) || 0));

  if (source === 'timelineInstability') {
    return {
      source,
      intensity: normalizedIntensity,
      emotion,
      dominantApex,
      headline: `The Crimson Spiral Hunt begins across ${Math.max(1, Math.round(normalizedIntensity / TIMELINE_INTENSITY_DIVISOR))} collapsing timelines.`,
    };
  }

  if (source === 'sovereignMutation') {
    return {
      source,
      intensity: normalizedIntensity,
      emotion,
      dominantApex,
      headline: 'A forgotten Sovereign blooms inside the fracture gardens.',
    };
  }

  return {
    source,
    intensity: normalizedIntensity,
    emotion,
    dominantApex,
    headline: `${dominantApex} reshapes reality as ${emotion} pressure crests at ${normalizedIntensity}.`,
  };
}

export function runIntelligentEngineCycle(currentState, pressures = {}, deltaTime = 1, now = Date.now()) {
  const safeDeltaTime = Math.max(0, Number(deltaTime) || 0);
  const state = createInitialIntelligentEngineState(currentState);
  const historyBias = calculateMemoryBias(state.history);

  const sovereignPressure = Number(pressures.sovereignPressure) || 0;
  const factionConflict = Number(pressures.factionConflict) || 0;
  const apexInfluence = Number(pressures.apexInfluence) || 0;
  const stabilityResistance = Number(pressures.stabilityResistance) || 0;

  const emotions = state.emotions;
  const emotionalAlignmentBoost = (emotions.wonder + emotions.reverence - emotions.rage - emotions.fear) * 0.02;

  state.worldAlignment = clamp(
    state.worldAlignment + (
      sovereignPressure +
      factionConflict +
      apexInfluence -
      stabilityResistance +
      emotionalAlignmentBoost
    ) * safeDeltaTime,
    ALIGNMENT_MIN,
    ALIGNMENT_MAX,
  );

  state.timelineInstability = clamp(
    state.timelineInstability + (
      factionConflict +
      apexInfluence * 0.25 +
      emotions.fear * 0.2 +
      emotions.rage * 0.25 -
      emotions.hope * 0.2 +
      historyBias.instabilitySensitivity
    ) * safeDeltaTime,
    SYSTEM_MIN,
    SYSTEM_MAX,
  );

  state.factionTrust = clamp(
    state.factionTrust + (
      emotions.hope * 0.25 +
      emotions.reverence * 0.15 -
      factionConflict * 0.4 -
      emotions.fear * 0.15 -
      historyBias.ghostFactionPressure * 0.02
    ) * safeDeltaTime,
    SYSTEM_MIN,
    SYSTEM_MAX,
  );

  state.sovereignAffinity.hunt = clamp(
    state.sovereignAffinity.hunt + (
      emotions.hunger * 0.35 +
      Math.max(0, state.worldAlignment) * 0.05 +
      historyBias.huntMomentum
    ) * safeDeltaTime,
    SYSTEM_MIN,
    SYSTEM_MAX,
  );

  state.sovereignAffinity.genesis = clamp(
    state.sovereignAffinity.genesis + (
      emotions.wonder * 0.3 +
      emotions.hope * 0.2 -
      historyBias.genesisCorruption * 2
    ) * safeDeltaTime,
    SYSTEM_MIN,
    SYSTEM_MAX,
  );

  state.apexPressure = updateApexPressure(state.apexPressure, emotions);

  const dominantApex =
    state.apexPressure.bloomingBeast.influence >= state.apexPressure.genesisDevourer.influence
      ? 'Blooming Beast'
      : 'Genesis Devourer';

  const mutations = triggerMutations(state, now);
  const mutationNames = mutations.map((mutation) => mutation.name);
  state.sovereigns = evolveSovereigns(state.sovereigns, emotions, mutationNames);

  if (mutationNames.includes(FRACTAL_STORM_MUTATION)) {
    state.history.collapsedTimelines.push({ at: now, instability: state.timelineInstability });
  }

  if (mutationNames.includes('dynasty-schism')) {
    state.history.extinctDynasties.push({ at: now, reason: 'trust-collapse' });
  }

  if (mutationNames.includes('predator-era-awakened')) {
    state.history.previousEras.push('hunt');
    state.history.apexVictories.push({ at: now, apex: dominantApex });
  }

  const firstMutation = mutations[0];
  const eventSource = determineEventSource(firstMutation);

  const intensity = Math.max(
    state.timelineInstability,
    state.apexPressure.bloomingBeast.influence,
    state.apexPressure.genesisDevourer.influence,
  );

  const dominantEmotionEntry = Object.entries(emotions).reduce(
    (winner, [name, value]) => (value > winner.value ? { name, value } : winner),
    { name: 'wonder', value: 0 },
  );
  const dominantEmotion = dominantEmotionEntry.value > 0 ? dominantEmotionEntry.name : 'wonder';

  const generatedEvent = generateAutonomousEvent({
    source: eventSource,
    intensity,
    emotion: dominantEmotion,
    dominantApex,
  });

  state.recentMutations = [...state.recentMutations, ...mutations].slice(-20);
  state.recentEvents = [...state.recentEvents, generatedEvent].slice(-20);

  return {
    state,
    mutations,
    event: generatedEvent,
    dominantApex,
  };
}
