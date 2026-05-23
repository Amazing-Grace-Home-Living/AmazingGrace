# PR: Two Blueprints â€” Lore, SVG, Engine Integration
**Branch:** `feature/two-blueprints-s7`
**Base:** `main`
**Author:** Arcade Engine Team
**Date:** 2026-05-09
**Season:** 7
**Reviewers:** @lore-council @engine-leads @arcade-frontend

---

## Summary

Implements the full **Two Blueprints** feature set as specified in Lore Appendix II.
Four concrete deliverables land in this PR:

| # | File | Purpose |
|---|------|---------|
| 1 | `arcade/lore/two-blueprints/two-blueprints.html` | Lore page â€” The Ladder & The Break |
| 2 | `assets/diagrams/two-blueprints-diagram.svg` | Metaphysics diagram (embeddable) |
| 3 | `src/engine/match-maker.js` | Match-making engine with Ladder/Break/Hybrid logic |
| 4 | `docs/lore/appendix-ii.md` | Lore Appendix II (canonical text) |

---

## Motivation

Season 7 introduces the **Two Blueprints Protocol** â€” the formal co-existence of Ladder (structured ascent) and Break (singular rupture) match philosophies â€” including the new **Hybrid Stakes Protocol** for cross-blueprint collisions.

---

## Key Behaviors

| Behavior | Implementation |
|----------|---------------|
| Ladder pairing | +/-400 rank-score delta, same blueprint, smallest delta first |
| Break pairing | +/-2 tier spread, prefers higher-tier opponent |
| Cross-blueprint | Falls back to HybridProtocol automatically |
| Ladder outcome | Elo K=32, dampened variance |
| Break outcome | delta x 3.5 multiplier, floor-lock on loser |
| Hybrid declaration | Both must declare simultaneously |
| Decay | Ladder only; 8 pts/day after 7-day grace period |
| Cooldown | Break players: 5-match cooldown after any Break match |
| Floor-lock | Loser locked to tier floor; lifts after cooldown expires |

---

## Testing Checklist

- [x] `LadderEngine.findMatch` â€” returns null when no candidates within delta
- [x] `LadderEngine.applyDecay` â€” no decay within grace period
- [x] `LadderEngine.applyDecay` â€” correct decay after N days
- [x] `LadderEngine.resolveMatch` â€” winner score increases, loser decreases
- [x] `LadderEngine.resolveMatch` â€” score never goes below RANK_FLOOR
- [x] `BreakEngine.checkEligibility` â€” false for LADDER blueprint
- [x] `BreakEngine.checkEligibility` â€” false when cooldown > 0
- [x] `BreakEngine.findMatch` â€” respects TIER_SPREAD=2
- [x] `BreakEngine.resolveMatch` â€” delta = base x STAKES_MULTIPLIER
- [x] `BreakEngine.resolveMatch` â€” loser floor-locked at tier min
- [x] `BreakEngine.progressCooldown` â€” decrements by 1; lifts lock at 0
- [x] `HybridProtocol.resolveDeclaration` â€” both declare â†’ BREAK
- [x] `HybridProtocol.resolveDeclaration` â€” one declares â†’ LADDER
- [x] `HybridProtocol.resolveDeclaration` â€” neither declares â†’ LADDER
- [x] `MatchMaker.drainQueue` â€” pairs same-blueprint players first
- [x] `MatchMaker.drainQueue` â€” falls back to HYBRID on cross-blueprint
- [x] `MatchMaker.commitResult` â€” persists updated records to store
- [x] `MatchMaker.commitResult` â€” Break cooldown applied to both players post-match
- [x] `MatchMaker.getStanding` â€” returns correct tier name and breakEligible

---

## Migration Notes

- `match-maker.js` replaces the previous stub. The stub exported only `{ findMatch }` â€” update all call sites to use the new `MatchMaker` class interface.
- `RankStore` is in-memory by default. Production must provide a DB-backed adapter implementing `{ get(id), set(id, record) }`.
- Add `floorLocked: boolean` and `floorLockMin: number` columns to player schema + migration for existing rows.

---

## Lore Notes

This PR is canon as of **Season 7**. The Hybrid Stakes Protocol supersedes the Season 6 interim ruling that defaulted all cross-blueprint matches to Ladder scoring.

---

