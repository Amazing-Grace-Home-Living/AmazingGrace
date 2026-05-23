import { describe, it, expect, beforeEach } from 'vitest';
import {
  MatchMaker,
  LadderEngine,
  BreakEngine,
  HybridProtocol,
  RankStore,
  BLUEPRINT,
  LADDER_CONFIG,
} from '../src/engine/match-maker.js';

describe('Two Blueprints Feature', () => {
  let store: RankStore;
  let ladder: LadderEngine;
  let break_: BreakEngine;
  let hybrid: HybridProtocol;
  let mm: MatchMaker;

  beforeEach(() => {
    store = new RankStore();
    mm = new MatchMaker(store);
    ladder = mm.ladder;
    break_ = mm.break_;
    hybrid = mm.hybrid;
  });

  describe('LadderEngine', () => {
    it('findMatch returns null when no candidates within delta', () => {
      const p1 = RankStore.createPlayer('p1');
      p1.score = 1000;
      const p2 = RankStore.createPlayer('p2');
      p2.score = 1500; // Delta 500 > 400
      
      const match = ladder.findMatch(p1, [p2]);
      expect(match).toBeNull();
    });

    it('applyDecay applies no decay within grace period', () => {
      const p1 = RankStore.createPlayer('p1');
      p1.score = 1000;
      p1.lastActive = new Date(Date.now() - 5 * 86400000); // 5 days ago
      
      const decayed = ladder.applyDecay(p1);
      expect(decayed.score).toBe(1000);
    });

    it('applyDecay applies correct decay after N days', () => {
      const p1 = RankStore.createPlayer('p1');
      p1.score = 1000;
      p1.lastActive = new Date(Date.now() - 10 * 86400000); // 10 days ago (3 days past grace)
      
      const decayed = ladder.applyDecay(p1);
      // 10 - 7 = 3 days decay. 3 * 8 = 24.
      expect(decayed.score).toBe(1000 - 24);
    });

    it('resolveMatch updates scores correctly', () => {
      const p1 = RankStore.createPlayer('p1');
      p1.score = 1000;
      const p2 = RankStore.createPlayer('p2');
      p2.score = 1000;
      
      const result = ladder.resolveMatch(p1, p2, 'm1');
      expect(result.winner.score).toBeGreaterThan(1000);
      expect(result.loser.score).toBeLessThan(1000);
      expect(result.delta).toBe(16); // Elo K=32, expected 0.5 -> delta 16
    });

    it('resolveMatch score never goes below RANK_FLOOR', () => {
      const p1 = RankStore.createPlayer('p1');
      p1.score = 100;
      const p2 = RankStore.createPlayer('p2');
      p2.score = 10; // Near floor
      
      // p1 wins, p2 loses. p2 should hit floor because delta will be > 10.
      const result = ladder.resolveMatch(p1, p2, 'm1');
      expect(result.loser.score).toBe(LADDER_CONFIG.RANK_FLOOR);
    });
  });

  describe('BreakEngine', () => {
    it('checkEligibility false for LADDER blueprint', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.LADDER);
      expect(break_.checkEligibility(p1).eligible).toBe(false);
    });

    it('checkEligibility false when cooldown > 0', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      p1.breakCooldown = 3;
      expect(break_.checkEligibility(p1).eligible).toBe(false);
    });

    it('findMatch respects TIER_SPREAD=2', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      p1.score = 0; // ENTRY (Tier 0)
      const p2 = RankStore.createPlayer('p2', BLUEPRINT.BREAK);
      p2.score = 2200; // GOLD (Tier 3) -> Spread 3 > 2
      
      const match = break_.findMatch(p1, [p2]);
      expect(match).toBeNull();
      
      p2.score = 1500; // SILVER (Tier 2) -> Spread 2 <= 2
      const match2 = break_.findMatch(p1, [p2]);
      expect(match2).not.toBeNull();
      expect(match2.id).toBe('p2');
    });

    it('resolveMatch applies multiplier', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      p1.score = 1000;
      const p2 = RankStore.createPlayer('p2', BLUEPRINT.BREAK);
      p2.score = 1000;
      
      const result = break_.resolveMatch(p1, p2, 'm1');
      // Base delta 16. Amplified 16 * 3.5 = 56.
      expect(result.amplifiedDelta).toBe(56);
      expect(result.winner.score).toBe(1000 + 56);
    });

    it('resolveMatch floor-locks loser', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      p1.score = 1000;
      const p2 = RankStore.createPlayer('p2', BLUEPRINT.BREAK);
      p2.score = 1000; // BRONZE (min 800)
      
      const result = break_.resolveMatch(p1, p2, 'm1');
      expect(result.loser.floorLocked).toBe(true);
      expect(result.loser.floorLockMin).toBe(800);
    });

    it('progressCooldown decrements and lifts lock at 0', () => {
      let p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      p1.breakCooldown = 1;
      p1.floorLocked = true;
      p1.floorLockMin = 800;
      
      p1 = break_.progressCooldown(p1);
      expect(p1.breakCooldown).toBe(0);
      expect(p1.floorLocked).toBe(false);
      expect(p1.floorLockMin).toBe(0);
    });
  });

  describe('HybridProtocol', () => {
    it('resolveDeclaration both declare -> BREAK', () => {
      expect(hybrid.resolveDeclaration(true, true)).toBe(BLUEPRINT.BREAK);
    });

    it('resolveDeclaration one or none declare -> LADDER', () => {
      expect(hybrid.resolveDeclaration(true, false)).toBe(BLUEPRINT.LADDER);
      expect(hybrid.resolveDeclaration(false, false)).toBe(BLUEPRINT.LADDER);
    });
  });

  describe('MatchMaker', () => {
    it('drainQueue pairs same-blueprint players first', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.LADDER);
      const p2 = RankStore.createPlayer('p2', BLUEPRINT.BREAK);
      const p3 = RankStore.createPlayer('p3', BLUEPRINT.LADDER);
      p1.score = 1000; p2.score = 1000; p3.score = 1000;
      store.set('p1', p1); store.set('p2', p2); store.set('p3', p3);
      
      mm.enqueue('p1'); mm.enqueue('p2'); mm.enqueue('p3');
      const pairs = mm.drainQueue();
      
      // p1 and p3 should be paired (both LADDER)
      expect(pairs).toHaveLength(1);
      expect(pairs[0].playerA).toBe('p1');
      expect(pairs[0].playerB).toBe('p3');
      expect(pairs[0].mode).toBe(BLUEPRINT.LADDER);
    });

    it('drainQueue falls back to HYBRID on cross-blueprint', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.LADDER);
      const p2 = RankStore.createPlayer('p2', BLUEPRINT.BREAK);
      p1.score = 1000; p2.score = 1000;
      store.set('p1', p1); store.set('p2', p2);
      
      mm.enqueue('p1'); mm.enqueue('p2');
      const pairs = mm.drainQueue();
      
      expect(pairs).toHaveLength(1);
      expect(pairs[0].mode).toBe('HYBRID');
    });

    it('commitResult persists updated records and applies cooldown', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      const p2 = RankStore.createPlayer('p2', BLUEPRINT.BREAK);
      p1.score = 1000; p2.score = 1000;
      store.set('p1', p1); store.set('p2', p2);
      mm.enqueue('p1'); mm.enqueue('p2');
      const pairs = mm.drainQueue();
      
      mm.commitResult({ matchId: pairs[0].matchId, winnerId: 'p1', loserId: 'p2' });
      
      const winner = store.get('p1');
      const loser = store.get('p2');
      
      expect(winner.matchesPlayed).toBe(1);
      expect(loser.matchesPlayed).toBe(1);
      
      // Cooldown should be applied. 
      // In resolveMatch it's set to 5. 
      // In commitResult it's immediately progressed once.
      // So it should be 4.
      expect(winner.breakCooldown).toBe(4);
      expect(loser.breakCooldown).toBe(4);
    });

    it('getStanding returns correct tier and eligibility', () => {
      const p1 = RankStore.createPlayer('p1', BLUEPRINT.BREAK);
      p1.score = 2200; // GOLD
      store.set('p1', p1);
      
      const standing = mm.getStanding('p1');
      expect(standing.tier).toBe('GOLD');
      expect(standing.breakEligible).toBe(true);
      
      p1.breakCooldown = 1;
      const standing2 = mm.getStanding('p1');
      expect(standing2.breakEligible).toBe(false);
    });
  });
});
