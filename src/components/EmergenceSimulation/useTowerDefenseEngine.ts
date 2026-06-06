import { useState, useEffect, useRef, useCallback } from 'react';
import { SandboxRule } from '../DraftingBoard/DraftingBoard';
import { evaluateAllianceAction, PlayerReputation } from './aiReputationEvaluator';

export interface Enemy {
  id: string;
  x: number;
  z: number;
  hp: number;
  maxHp: number;
  speed: number;
  pathIndex: number;
  slowTimer: number;
}

export interface Projectile {
  id: string;
  x: number;
  z: number;
  targetId: string;
  damage: number;
  speed: number;
  color: string;
  effect?: 'slow' | 'splash' | 'chain';
  hasChained?: boolean;
}

export interface Tower {
  id: string;
  x: number;
  z: number;
  type: 'purify' | 'contain' | 'sentinel' | 'genesis';
  cooldownTimer: number;
  level: number;
}

// Map the old vanilla path (0-14, 1-8) into a 10x10 centered 3D grid (-4.5 to +4.5)
const PATH = [
  { x: -4.5, z: -3.5 }, { x: -3.5, z: -3.5 }, { x: -2.5, z: -3.5 }, { x: -1.5, z: -3.5 }, { x: -0.5, z: -3.5 }, { x: 0.5, z: -3.5 }, { x: 1.5, z: -3.5 }, { x: 2.5, z: -3.5 }, { x: 3.5, z: -3.5 },
  { x: 3.5, z: -2.5 }, { x: 3.5, z: -1.5 }, { x: 3.5, z: -0.5 }, { x: 3.5, z: 0.5 },
  { x: 2.5, z: 0.5 }, { x: 1.5, z: 0.5 }, { x: 0.5, z: 0.5 }, { x: -0.5, z: 0.5 }, { x: -1.5, z: 0.5 }, { x: -2.5, z: 0.5 }, { x: -3.5, z: 0.5 },
  { x: -3.5, z: 1.5 }, { x: -3.5, z: 2.5 }, { x: -3.5, z: 3.5 },
  { x: -2.5, z: 3.5 }, { x: -1.5, z: 3.5 }, { x: -0.5, z: 3.5 }, { x: 0.5, z: 3.5 }, { x: 1.5, z: 3.5 }, { x: 2.5, z: 3.5 }, { x: 3.5, z: 3.5 }, { x: 4.5, z: 3.5 }
];

export const TOWER_DEFS = {
  purify: { cost: 50, range: 2.5, damage: 15, cooldown: 30, color: '#00f0ff', effect: undefined },
  contain: { cost: 100, range: 2.0, damage: 2, cooldown: 40, color: '#a855f7', effect: 'slow' as const },
  sentinel: { cost: 150, range: 4.0, damage: 60, cooldown: 90, color: '#ff0055', effect: undefined },
  genesis: { cost: 250, range: 3.0, damage: 20, cooldown: 60, color: '#00ffb7', effect: 'splash' as const },
};

export const useTowerDefenseEngine = (activeRules: SandboxRule[], playerReputation: PlayerReputation) => {
  const [gameState, setGameState] = useState({
    active: false,
    waveActive: false,
    money: 150,
    health: 20,
    wave: 1,
    score: 0,
    energyCap: 100,
    lastMessage: ''
  });

  const stateRef = useRef({
    enemies: [] as Enemy[],
    towers: [] as Tower[],
    projectiles: [] as Projectile[],
    enemiesToSpawn: 0,
    spawnTimer: 0,
    particles: [] as Array<{ x: number; y: number; z: number; color: string; life: number }>,
    floatingTexts: [] as Array<{ x: number; y: number; z: number; text: string; color: string; life: number }>
  });

  // Apply buffs/nerfs from drafting board
  useEffect(() => {
    let newCap = 100;
    activeRules.forEach(rule => {
      if (rule.target === 'AI_ENERGY_CAP') newCap += rule.value;
    });
    setGameState(prev => ({ ...prev, energyCap: newCap }));
  }, [activeRules]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      active: true,
      waveActive: false,
      money: 150 + (activeRules.some(r => r.target === 'STARTING_CASH') ? 50 : 0),
      health: 20,
      wave: 1,
      score: 0
    }));
    stateRef.current.enemies = [];
    stateRef.current.towers = [];
    stateRef.current.projectiles = [];
  }, [activeRules]);

  const startWave = useCallback(() => {
    setGameState(prev => {
      if (!prev.active || prev.waveActive) return prev;
      stateRef.current.enemiesToSpawn = 5 + prev.wave * 3;
      stateRef.current.spawnTimer = 0;
      return { ...prev, waveActive: true };
    });
  }, []);

  const getTowerCost = useCallback((type: keyof typeof TOWER_DEFS) => {
    let cost = TOWER_DEFS[type].cost;
    const costRule = activeRules.find(r => r.target === 'MISSILE_SILO' && r.type === 'COST_REDUCTION');
    if (costRule && type === 'sentinel') cost += costRule.value;
    return Math.max(10, cost);
  }, [activeRules]);

  const placeTower = useCallback((x: number, z: number, type: keyof typeof TOWER_DEFS) => {
    const cost = getTowerCost(type);
    
    // Evaluate if user has karma to build defenses
    // We pass 0 as current threat level unless the wave is active
    setGameState(prev => {
      const evaluation = evaluateAllianceAction(playerReputation, 'BUILD_DEFENSE', prev.waveActive ? 60 : 0);
      if (evaluation.vote === 'VETO') {
        return { ...prev, lastMessage: evaluation.reasoning };
      }

      if (prev.money < cost) {
        return { ...prev, lastMessage: "Insufficient funds." };
      }

      // Check collision with path
      if (PATH.some(p => Math.abs(p.x - x) < 0.5 && Math.abs(p.z - z) < 0.5)) return prev;
      
      // Check collision with other towers
      if (stateRef.current.towers.some(t => Math.hypot(t.x - x, t.z - z) < 0.8)) return prev;

      stateRef.current.towers.push({
        id: `tower_${Date.now()}`,
        x, z,
        type,
        cooldownTimer: 0,
        level: 1
      });

      return { ...prev, money: prev.money - cost, lastMessage: evaluation.reasoning };
    });
  }, [getTowerCost, playerReputation]);

  // Main game loop
  useEffect(() => {
    if (!gameState.active) return;

    let animFrame: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      animFrame = requestAnimationFrame(loop);
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      // We process logic roughly at 60Hz steps
      const ticks = Math.floor(delta / 0.016) || 1;
      
      const st = stateRef.current;
      let hpLost = 0;
      let moneyGained = 0;
      let scoreGained = 0;
      
      for (let t = 0; t < ticks; t++) {
        // Spawning
        if (gameState.waveActive && st.enemiesToSpawn > 0) {
          st.spawnTimer++;
          if (st.spawnTimer >= 60 - Math.min(gameState.wave * 2, 40)) {
            const hp = 20 + Math.pow(gameState.wave, 1.5) * 5;
            st.enemies.push({
              id: `e_${Date.now()}_${Math.random()}`,
              x: PATH[0].x,
              z: PATH[0].z,
              hp, maxHp: hp,
              speed: 0.03 + gameState.wave * 0.002,
              pathIndex: 0,
              slowTimer: 0
            });
            st.enemiesToSpawn--;
            st.spawnTimer = 0;
          }
        }

        // Enemies movement
        for (let i = st.enemies.length - 1; i >= 0; i--) {
          const e = st.enemies[i];
          const target = PATH[e.pathIndex + 1];
          
          if (!target) {
            hpLost++;
            st.enemies.splice(i, 1);
            continue;
          }

          let speed = e.speed;
          if (e.slowTimer > 0) {
            speed *= 0.5;
            e.slowTimer--;
          }

          const dx = target.x - e.x;
          const dz = target.z - e.z;
          const dist = Math.hypot(dx, dz);

          if (dist <= speed) {
            e.x = target.x;
            e.z = target.z;
            e.pathIndex++;
          } else {
            e.x += (dx / dist) * speed;
            e.z += (dz / dist) * speed;
          }
        }

        // Towers targeting
        st.towers.forEach(tower => {
          if (tower.cooldownTimer > 0) tower.cooldownTimer--;
          else if (st.enemies.length > 0) {
            const def = TOWER_DEFS[tower.type];
            let closest: Enemy | null = null;
            let minDist = def.range;
            
            st.enemies.forEach(e => {
              const dist = Math.hypot(e.x - tower.x, e.z - tower.z);
              if (dist <= minDist) {
                minDist = dist;
                closest = e;
              }
            });

            if (closest) {
              st.projectiles.push({
                id: `p_${Date.now()}_${Math.random()}`,
                x: tower.x,
                z: tower.z,
                targetId: (closest as Enemy).id,
                damage: def.damage,
                speed: tower.type === 'sentinel' ? 0.8 : 0.2, // fast lasers for sniper
                color: def.color,
                effect: def.effect
              });
              tower.cooldownTimer = def.cooldown;
            }
          }
        });

        // Projectiles movement
        for (let i = st.projectiles.length - 1; i >= 0; i--) {
          const p = st.projectiles[i];
          const target = st.enemies.find(e => e.id === p.targetId);
          
          if (!target) {
            st.projectiles.splice(i, 1);
            continue;
          }

          const dx = target.x - p.x;
          const dz = target.z - p.z;
          const dist = Math.hypot(dx, dz);

          if (dist <= p.speed) {
            target.hp -= p.damage;
            
            if (p.effect === 'slow') target.slowTimer = 120;
            if (p.effect === 'splash') {
              st.enemies.forEach(e => {
                if (e !== target && Math.hypot(e.x - target.x, e.z - target.z) < 1.5) {
                  e.hp -= p.damage * 0.5;
                }
              });
            }

            st.projectiles.splice(i, 1);
          } else {
            p.x += (dx / dist) * p.speed;
            p.z += (dz / dist) * p.speed;
          }
        }

        // Deaths
        for (let i = st.enemies.length - 1; i >= 0; i--) {
          if (st.enemies[i].hp <= 0) {
            st.enemies.splice(i, 1);
            moneyGained += 5;
            scoreGained += 10;
          }
        }

        // Wave End logic
        if (gameState.waveActive && st.enemiesToSpawn === 0 && st.enemies.length === 0) {
          setGameState(prev => ({
            ...prev,
            waveActive: false,
            wave: prev.wave + 1,
            money: prev.money + 50 + prev.wave * 5
          }));
        }
      }

      if (hpLost > 0 || moneyGained > 0 || scoreGained > 0) {
        setGameState(prev => {
          const newHp = prev.health - hpLost;
          if (newHp <= 0) {
            return { ...prev, active: false, health: 0 };
          }
          return {
            ...prev,
            health: newHp,
            money: Math.min(prev.money + moneyGained, prev.energyCap),
            score: prev.score + scoreGained
          };
        });
      }

      // Simple decay for particles and floating text (rendered elsewhere)
      st.particles.forEach(p => p.life -= 0.02);
      st.particles = st.particles.filter(p => p.life > 0);
      
      st.floatingTexts.forEach(f => {
        f.y += 0.02;
        f.life -= 0.02;
      });
      st.floatingTexts = st.floatingTexts.filter(f => f.life > 0);

    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [gameState.active, gameState.waveActive, gameState.wave]);

  return {
    gameState,
    startGame,
    startWave,
    placeTower,
    getTowerCost,
    gameEntities: stateRef.current,
    PATH
  };
};
