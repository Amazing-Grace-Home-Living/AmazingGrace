import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Boss AI features', () => {
  // ── rebellion-core.js default state ────────────────────────────────────────
  describe('rebellion-core.js extended default state', () => {
    let core: string;
    it('loads the file', () => {
      core = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(core.length).toBeGreaterThan(0);
    });

    it('includes activeWeakpoints in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('activeWeakpoints');
      expect(src).toContain('starMatrix: null');
    });

    it('includes bossMutations array in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossMutations: []');
    });

    it('includes bossMemory in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossMemory:');
      expect(src).toContain('matchSpeed: 0');
      expect(src).toContain('perfectAlignments: 0');
      expect(src).toContain('hazardDodges: 0');
      expect(src).toContain('towerDamage: 0');
    });

    it('includes bossPersonality in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossPersonality:');
      expect(src).toContain('aggression: 0');
      expect(src).toContain('cunning: 0');
      expect(src).toContain('cruelty: 0');
      expect(src).toContain('pride: 0');
    });

    it('includes bossPersonalityHistory array in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossPersonalityHistory: []');
    });

    it('includes bossEmotion in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossEmotion:');
      expect(src).toContain('anger: 0');
      expect(src).toContain('obsession: 0');
      expect(src).toContain('despair: 0');
      expect(src).toContain('respect: 0');
    });

    it('includes bossEmotionHistory array in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossEmotionHistory: []');
    });

    it('includes bossRedemption in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossRedemption:');
      expect(src).toContain('light: 0');
      expect(src).toContain('dark: 0');
    });

    it('includes bossReincarnation in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('bossReincarnation:');
      expect(src).toContain('level: 0');
      expect(src).toContain('deaths: 0');
      expect(src).toContain('lastDeath: null');
      expect(src).toContain("path: null");
    });

    it('includes finalChoice and cosmetics in defaultState', () => {
      const src = fs.readFileSync('arcade/js/rebellion-core.js', 'utf8');
      expect(src).toContain('finalChoice: null');
      expect(src).toContain('cosmetics:');
      expect(src).toContain('owned: {}');
    });
  });

  // ── boss-mutations.js ───────────────────────────────────────────────────────
  describe('boss-mutations.js', () => {
    it('defines BOSS_MUTATIONS with four base mutations', () => {
      const src = fs.readFileSync('arcade/js/boss-mutations.js', 'utf8');
      expect(src).toContain('const BOSS_MUTATIONS');
      expect(src).toContain('dataOverload');
      expect(src).toContain('spectralEcho');
      expect(src).toContain('quantumFlux');
      expect(src).toContain('armorRegen');
    });

    it('defines selectMutationFromMemory function', () => {
      const src = fs.readFileSync('arcade/js/boss-mutations.js', 'utf8');
      expect(src).toContain('function selectMutationFromMemory');
      expect(src).toContain('matchSpeed');
      expect(src).toContain('perfectAlignments');
      expect(src).toContain('hazardDodges');
      expect(src).toContain('towerDamage');
    });

    it('defines applyMutation function', () => {
      const src = fs.readFileSync('arcade/js/boss-mutations.js', 'utf8');
      expect(src).toContain('function applyMutation');
      expect(src).toContain('bossMutations');
    });

    it('defines checkMutationUpgrade with hybrid/prime/cataclysmic forms', () => {
      const src = fs.readFileSync('arcade/js/boss-mutations.js', 'utf8');
      expect(src).toContain('function checkMutationUpgrade');
      expect(src).toContain('cataclysmic');
      expect(src).toContain('prime');
      expect(src).toContain('hybrid');
    });

    it('links mutations to lore and cosmetic ids', () => {
      const src = fs.readFileSync('arcade/js/boss-mutations.js', 'utf8');
      expect(src).toContain('lf_corrupted_data_logs');
      expect(src).toContain('lf_echo_phenomenon');
      expect(src).toContain('lf_quantum_instability');
      expect(src).toContain('lf_overseer_armor_spec');
      expect(src).toContain('aura_data_glitch');
      expect(src).toContain('filter_spectral_pulse');
    });
  });

  // ── boss-ai.js ──────────────────────────────────────────────────────────────
  describe('boss-ai.js', () => {
    it('defines WEAKPOINTS for all four games', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('const WEAKPOINTS');
      expect(src).toContain('starMatrix');
      expect(src).toContain('lookingGlass');
      expect(src).toContain('quantumShift');
      expect(src).toContain('syndicateSiege');
    });

    it('defines weakpoint management functions', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function activateWeakpoint');
      expect(src).toContain('function damageWeakpoint');
      expect(src).toContain('function clearWeakpoint');
      expect(src).toContain('function checkPhaseBreak');
      expect(src).toContain('function dealBossDamage');
    });

    it('defines boss memory recording function', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function recordBossMemory');
    });

    it('defines personality adjustment and snapshot functions', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function adjustPersonality');
      expect(src).toContain('function snapshotPersonality');
      expect(src).toContain('bossPersonalityHistory');
    });

    it('defines emotion adjustment and milestone functions', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function adjustEmotion');
      expect(src).toContain('function checkEmotionMilestone');
      expect(src).toContain('function snapshotEmotion');
      expect(src).toContain('lf_overseer_rage_logs');
      expect(src).toContain('lf_core_panic_report');
      expect(src).toContain('lf_adaptive_honor_protocol');
    });

    it('defines redemption path functions', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function advanceRedemption');
      expect(src).toContain('function advanceCorruption');
      expect(src).toContain('function triggerRedemptionEnding');
      expect(src).toContain('function triggerCorruptionEnding');
    });

    it('defines kill/spare system functions', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function killBoss');
      expect(src).toContain('function spareBoss');
    });

    it('defines reincarnation function', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function reincarnate');
      expect(src).toContain("'corrupted'");
      expect(src).toContain("'ascended'");
      expect(src).toContain('lf_vengeance_cycle');
      expect(src).toContain('lf_light_returns');
    });

    it('defines BOSS_DIALOGUE with all required pools', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('const BOSS_DIALOGUE');
      expect(src).toContain('intro:');
      expect(src).toContain('phase:');
      expect(src).toContain('weakpoint:');
      expect(src).toContain('mutation:');
      expect(src).toContain('personality:');
      expect(src).toContain('defeat:');
    });

    it('defines bossSpeak engine with template rendering', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function bossSpeak');
      expect(src).toContain('replace(/\\{(\\w+)\\}/g');
    });

    it('defines showBossDialogue display function', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function showBossDialogue');
      expect(src).toContain("getElementById('rt-boss-dialogue')");
      expect(src).toContain('classList.add');
      expect(src).toContain('classList.remove');
    });

    it('defines renderBossAIPanels for the Resistance Terminal', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('function renderBossAIPanels');
      expect(src).toContain("getElementById('rt-mutations')");
      expect(src).toContain("getElementById('rt-weakpoints')");
      expect(src).toContain("getElementById('rt-boss-memory')");
      expect(src).toContain("getElementById('rt-boss-personality')");
      expect(src).toContain("getElementById('rt-boss-emotion')");
      expect(src).toContain("getElementById('rt-redemption')");
      expect(src).toContain("getElementById('rt-reincarnation')");
      expect(src).toContain("getElementById('rt-final-choice')");
    });

    it('exports all key functions to window', () => {
      const src = fs.readFileSync('arcade/js/boss-ai.js', 'utf8');
      expect(src).toContain('window.activateWeakpoint');
      expect(src).toContain('window.bossSpeak');
      expect(src).toContain('window.killBoss');
      expect(src).toContain('window.spareBoss');
      expect(src).toContain('window.reincarnate');
      expect(src).toContain('window.renderBossAIPanels');
    });
  });

  // ── lore-files.js boss entries ──────────────────────────────────────────────
  describe('lore-files.js boss AI entries', () => {
    it('includes mutation lore files', () => {
      const src = fs.readFileSync('arcade/js/lore-files.js', 'utf8');
      expect(src).toContain('lf_corrupted_data_logs');
      expect(src).toContain('lf_echo_phenomenon');
      expect(src).toContain('lf_quantum_instability');
      expect(src).toContain('lf_overseer_armor_spec');
      expect(src).toContain('lf_core_fracture_analysis');
      expect(src).toContain('lf_overseer_evolution_protocol');
      expect(src).toContain('lf_archon_ascendant');
    });

    it('includes emotion milestone lore files', () => {
      const src = fs.readFileSync('arcade/js/lore-files.js', 'utf8');
      expect(src).toContain('lf_overseer_rage_logs');
      expect(src).toContain('lf_core_panic_report');
      expect(src).toContain('lf_adaptive_honor_protocol');
      expect(src).toContain('lf_target_fixation_memo');
      expect(src).toContain('lf_cognitive_collapse_analysis');
      expect(src).toContain('lf_overseer_heart');
    });

    it('includes redemption/reincarnation/weakpoint lore files', () => {
      const src = fs.readFileSync('arcade/js/lore-files.js', 'utf8');
      expect(src).toContain('lf_overseers_awakening');
      expect(src).toContain('lf_ascended_protocols');
      expect(src).toContain('lf_archon_of_ruin');
      expect(src).toContain('lf_core_collapse_report');
      expect(src).toContain('lf_vengeance_cycle');
      expect(src).toContain('lf_light_returns');
      expect(src).toContain('lf_weakpoint_protocols');
    });
  });

  // ── cosmetics.js boss entries ───────────────────────────────────────────────
  describe('cosmetics.js boss AI entries', () => {
    it('includes mutation cosmetics', () => {
      const src = fs.readFileSync('arcade/js/cosmetics.js', 'utf8');
      expect(src).toContain('aura_data_glitch');
      expect(src).toContain('filter_spectral_pulse');
      expect(src).toContain('skin_quantum_flux_stream');
      expect(src).toContain('skin_overseer_armor_tower');
      expect(src).toContain('theme_ascendant');
    });

    it('includes personality cosmetics', () => {
      const src = fs.readFileSync('arcade/js/cosmetics.js', 'utf8');
      expect(src).toContain('aura_red_rage');
      expect(src).toContain('filter_blue_predictive');
      expect(src).toContain('skin_black_corruption');
      expect(src).toContain('theme_gold_dominion');
      expect(src).toContain('theme_glitch_fracture');
    });

    it('includes emotion cosmetics', () => {
      const src = fs.readFileSync('arcade/js/cosmetics.js', 'utf8');
      expect(src).toContain('aura_red_fury');
      expect(src).toContain('theme_gold_honor');
      expect(src).toContain('filter_blue_focus');
      expect(src).toContain('skin_void_collapse');
    });
  });
});
