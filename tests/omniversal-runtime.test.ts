import { describe, expect, it } from 'vitest';

import {
  Timeline,
  createOmniversalRuntime,
  generateEvent,
  synthesizeNarrative,
} from '../js/omniversal-runtime.js';

describe('omniversal runtime', () => {
  it('creates timeline entities with persistent history containers', () => {
    const timeline = new Timeline();

    expect(timeline.instability).toBe(0);
    expect(timeline.factions).toEqual([]);
    expect(timeline.history).toEqual([]);
    expect(timeline.activeEvents).toEqual([]);
    expect(timeline.dominantEmotion).toBe('wonder');
    expect(timeline.veilState).toBe('veiled');
  });

  it('compiles event DNA metadata with normalized bounds', () => {
    const event = generateEvent({
      source: 'fear',
      severity: 120,
      apex: 'Blooming Beast',
      era: 'Seventh Bloom Collapse',
      affectedFactions: ['ghost-dynasty'],
      mutationRisk: 4,
      timelineId: 'alpha',
    });

    expect(event.source).toBe('fear');
    expect(event.severity).toBe(100);
    expect(event.apex).toBe('Blooming Beast');
    expect(event.era).toBe('Seventh Bloom Collapse');
    expect(event.affectedFactions).toEqual(['ghost-dynasty']);
    expect(event.mutationRisk).toBe(1);
    expect(event.timelineId).toBe('alpha');
  });

  it('integrates veil state into runtime rules and narrative synthesis', () => {
    const runtime = createOmniversalRuntime({
      metrics: {
        worldAlignment: 0,
        factionTrust: 50,
        timelineInstability: 80,
        sovereignAffinity: 0,
      },
    });

    runtime.triggerEvent('fear');
    const render = runtime.getRenderState();

    expect(render.veilState).toBe('unveiled');
    expect(render.signals.veilState).toContain('Unveiled state');
    expect(render.lastNarrative).toContain('During the');
    expect(render.timeline.activeEvents.length).toBeGreaterThan(0);

    const narrative = synthesizeNarrative(render.timeline.activeEvents.at(-1));
    expect(narrative).toContain('Veil of Janus');
  });

  it('supports locked metrics and lock-aware nudge messaging', () => {
    const runtime = createOmniversalRuntime();

    const lock = runtime.applyOverride('lock', {
      target: 'worldAlignment',
      now: 10,
    });
    expect(lock.status).toContain('locked');

    const blockedNudge = runtime.applyOverride('nudge', {
      target: 'worldAlignment',
      magnitude: 25,
      now: 20,
    });
    expect(blockedNudge.status).toContain('is locked');

    const render = runtime.getRenderState();
    expect(render.metrics.worldAlignment).toBe(0);
  });

  it('runs auto pulses only while wild mode is enabled', () => {
    const runtime = createOmniversalRuntime();

    const firstToggle = runtime.applyOverride('wild');
    expect(firstToggle.status).toContain('paused');
    expect(runtime.tick()).toBeNull();

    const secondToggle = runtime.applyOverride('wild');
    expect(secondToggle.status).toContain('running wild');
    const event = runtime.tick();
    expect(event).not.toBeNull();
    expect(event?.source).toBe('autoPulse');
  });
});
