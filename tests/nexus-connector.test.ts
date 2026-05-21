import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateCreditsTotal,
  createNexusConnector,
  normalizeModuleId,
  normalizeTransaction,
  readCreditsTotal,
} from '../arcade/js/nexus-connector.js';

function createStorage() {
  const store = new Map<string, string>();
  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('nexus connector', () => {
  let storage: ReturnType<typeof createStorage>;

  beforeEach(() => {
    storage = createStorage();
  });

  it('normalizes module ids and transactions to the shared contract', () => {
    expect(normalizeModuleId('matrix of conscience')).toBe('MATRIX_OF_CONSCIENCE');

    expect(
      normalizeTransaction({
        type: 'earn',
        module: 'star matrix',
        value: 19.7,
        currency: 'lumen',
      }),
    ).toMatchObject({
      type: 'EARN_REWARD',
      module: 'STAR_MATRIX',
      value: 19,
      currency: 'LUMEN',
    });
  });

  it('updates the shared credit balance when a module publishes rewards', () => {
    const connector = createNexusConnector({ storage, target: new EventTarget() });

    connector.registerModule({ moduleId: 'match-maker', title: 'Match Maker' });
    connector.activateModule('match-maker');
    connector.publishTransaction({
      type: 'EARN_REWARD',
      module: 'match-maker',
      value: 40,
      currency: 'LUMEN',
    });

    expect(readCreditsTotal(storage)).toBe(40);
    expect(connector.getState()).toMatchObject({
      currentModule: 'MATCH_MAKER',
      creditsTotal: 40,
    });
  });

  it('respects balanceAfter for modules that already persisted the total', () => {
    const connector = createNexusConnector({ storage, target: new EventTarget() });

    connector.registerModule({ moduleId: 'bible-study', title: 'Bible Study Challenge' });
    connector.activateModule('bible-study');
    connector.publishTransaction({
      type: 'EARN_REWARD',
      module: 'bible-study',
      value: 10,
      currency: 'LUMEN',
      balanceAfter: 90,
      reason: 'Correct answer',
    });

    expect(readCreditsTotal(storage)).toBe(90);
    expect(calculateCreditsTotal(80, normalizeTransaction({
      type: 'EARN_REWARD',
      module: 'bible-study',
      value: 10,
      currency: 'LUMEN',
      balanceAfter: 90,
    })!)).toBe(90);
  });

  it('tracks module high scores inside the shared context', () => {
    const connector = createNexusConnector({ storage, target: new EventTarget() });

    connector.registerModule({ moduleId: 'quick-click', title: 'Quick Click' });
    connector.recordScore('quick-click', 120);
    connector.recordScore('quick-click', 80);

    expect(connector.getState().modules.QUICK_CLICK).toMatchObject({
      score: 80,
      highScore: 120,
    });
  });
});
