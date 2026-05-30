import { describe, expect, it } from 'vitest';

import {
  TIMELINE_INTENSITY_DIVISOR,
  createInitialIntelligentEngineState,
  createSovereign,
  generateAutonomousEvent,
  runIntelligentEngineCycle,
} from '../js/intelligent-engine.js';

describe('intelligent engine', () => {
  it('starts with memory residue and emotional physics fields', () => {
    const state = createInitialIntelligentEngineState();

    expect(state.history.previousEras).toEqual([]);
    expect(state.history.collapsedTimelines).toEqual([]);
    expect(state.history.extinctDynasties).toEqual([]);
    expect(state.history.apexVictories).toEqual([]);

    expect(state.emotions).toEqual({
      fear: 0,
      wonder: 0,
      rage: 0,
      hope: 0,
      hunger: 0,
      reverence: 0,
    });
  });

  it('preserves explicit zero overrides for defaulted numeric fields', () => {
    const sovereign = createSovereign({ loyalty: 0, metamorphosisStage: 0 });
    const state = createInitialIntelligentEngineState({ factionTrust: 0 });

    expect(sovereign.loyalty).toBe(0);
    expect(sovereign.metamorphosisStage).toBe(0);
    expect(state.factionTrust).toBe(0);
  });

  it('applies weighted drift in micro-cycles with deltaTime', () => {
    const currentState = createInitialIntelligentEngineState({ worldAlignment: 10 });

    const oneTick = runIntelligentEngineCycle(
      currentState,
      { sovereignPressure: 4, factionConflict: 3, apexInfluence: 2, stabilityResistance: 1 },
      1,
    );

    const halfTick = runIntelligentEngineCycle(
      currentState,
      { sovereignPressure: 4, factionConflict: 3, apexInfluence: 2, stabilityResistance: 1 },
      0.5,
    );

    expect(oneTick.state.worldAlignment).toBeCloseTo(18, 5);
    expect(halfTick.state.worldAlignment).toBeCloseTo(14, 5);
  });

  it('triggers mutation thresholds and records history residue', () => {
    const currentState = createInitialIntelligentEngineState({
      worldAlignment: 70,
      timelineInstability: 85,
      factionTrust: 15,
      sovereignAffinity: { hunt: 75 },
      emotions: { fear: 5, rage: 5 },
    });

    const result = runIntelligentEngineCycle(currentState, { factionConflict: 10 }, 1, 42);
    const mutationNames = result.mutations.map((mutation) => mutation.name);

    expect(mutationNames).toContain('fractal-storm');
    expect(mutationNames).toContain('dynasty-schism');
    expect(mutationNames).toContain('predator-era-awakened');

    expect(result.state.history.collapsedTimelines).toHaveLength(1);
    expect(result.state.history.extinctDynasties).toHaveLength(1);
    expect(result.state.history.previousEras).toContain('hunt');
  });

  it('uses memory residue to increase instability sensitivity over repeated collapses', () => {
    const noHistory = createInitialIntelligentEngineState({ timelineInstability: 10 });
    const scarred = createInitialIntelligentEngineState({
      timelineInstability: 10,
      history: {
        collapsedTimelines: [{ at: 1 }, { at: 2 }, { at: 3 }],
      },
    });

    const base = runIntelligentEngineCycle(noHistory, {}, 1);
    const biased = runIntelligentEngineCycle(scarred, {}, 1);

    expect(biased.state.timelineInstability).toBeGreaterThan(base.state.timelineInstability);
  });

  it('lets apex pressure evolve through emotional influence and generates autonomous events', () => {
    const currentState = createInitialIntelligentEngineState({
      emotions: { fear: 30, wonder: 20, hunger: 10 },
      apexPressure: {
        bloomingBeast: { influence: 5 },
        genesisDevourer: { influence: 5 },
      },
    });

    const result = runIntelligentEngineCycle(currentState, {}, 1);
    const halfTickResult = runIntelligentEngineCycle(currentState, {}, 0.5);

    expect(result.state.apexPressure.bloomingBeast.influence).toBeGreaterThan(5);
    expect(result.state.apexPressure.genesisDevourer.influence).toBeGreaterThan(5);
    expect(halfTickResult.state.apexPressure.bloomingBeast.influence).toBeLessThan(
      result.state.apexPressure.bloomingBeast.influence,
    );
    expect(halfTickResult.state.apexPressure.genesisDevourer.influence).toBeLessThan(
      result.state.apexPressure.genesisDevourer.influence,
    );
    expect(result.event.headline.length).toBeGreaterThan(0);
  });

  it('supports living sovereign adaptation and direct generated events', () => {
    const sovereign = createSovereign({ name: 'Atlas', corruption: 79 });
    const currentState = createInitialIntelligentEngineState({
      sovereigns: [sovereign],
      worldAlignment: 70,
      sovereignAffinity: { hunt: 80 },
      emotions: { rage: 30 },
    });

    const result = runIntelligentEngineCycle(currentState, {}, 1);
    expect(result.state.sovereigns[0].metamorphosisStage).toBeGreaterThan(1);
    expect(result.state.sovereigns[0].status).toBe('exiled');

    const generated = generateAutonomousEvent({
      source: 'timelineInstability',
      intensity: 82,
      emotion: 'fear',
      dominantApex: 'Blooming Beast',
    });
    const expectedTimelineCount = Math.max(1, Math.round(82 / TIMELINE_INTENSITY_DIVISOR));

    expect(generated.headline).toContain('Crimson Spiral Hunt');
    expect(generated.headline).toContain(`${expectedTimelineCount} collapsing timelines`);
  });
});
