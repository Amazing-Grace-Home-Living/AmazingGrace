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
  type: 'normal' | 'armored' | 'shielded' | 'swarm' | 'boss';
  color: string;
  abilityTimer?: number;
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
  sourceTower?: string;
}

export interface Tower {
  id: string;
  x: number;
  z: number;
  type: 'purify' | 'contain' | 'sentinel' | 'genesis';
  cooldownTimer: number;
  level: number;
  angle: number;
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

export const useTowerDefenseEngine = (
  activeRules: SandboxRule[], 
  playerReputation: PlayerReputation,
  adjustKarma?: (uid: string, delta: number, isBetrayal?: boolean) => void,
  uid?: string
) => {
  const [gameState, setGameState] = useState({
    active: false,
    waveActive: false,
    money: 150,
    health: 20,
    wave: 1,
    score: 0,
    energyCap: 100,
    lastMessage: '',
    bossWarning: false
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
      const isBossWave = prev.wave % 5 === 0;
      stateRef.current.enemiesToSpawn = isBossWave ? 1 : 5 + prev.wave * 3;
      stateRef.current.spawnTimer = 0;
      return { ...prev, waveActive: true, bossWarning: isBossWave };
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
    setGameState(prev => {
      const evaluation = evaluateAllianceAction(playerReputation, 'BUILD_DEFENSE', prev.waveActive ? 60 : 0);
      if (evaluation.vote === 'VETO') {
        if (adjustKarma && uid) {
          adjustKarma(uid, -2, true);
        }
        return { ...prev, lastMessage: `${evaluation.reasoning} [PENALTY: -2 KARMA]` };
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
        level: 1,
        angle: 0
      });

      return { ...prev, money: prev.money - cost, lastMessage: evaluation.reasoning };
    });
  }, [getTowerCost, playerReputation, adjustKarma, uid]);

  const poolResources = useCallback((amount: number) => {
    let resultMessage = '';
    let success = false;
    setGameState(prev => {
      if (prev.money < amount) {
        resultMessage = "Insufficient funds to pool.";
        return { ...prev, lastMessage: resultMessage };
      }

      const evaluation = evaluateAllianceAction(playerReputation, 'CHANGE_GDP_POOL', prev.waveActive ? 60 : 0);
      
      if (evaluation.vote === 'VETO') {
        resultMessage = `[TRANSFER VETOED] ${evaluation.reasoning}`;
        return { ...prev, lastMessage: resultMessage };
      }

      success = true;
      resultMessage = `[TRANSFER APPROVED] Successfully pooled ${amount} credits. +1 Karma gained.`;
      
      if (adjustKarma && uid) {
        adjustKarma(uid, 1, false);
      }

      return { ...prev, money: prev.money - amount, lastMessage: resultMessage };
    });
    return { success, message: resultMessage };
  }, [playerReputation, adjustKarma, uid]);

  // Main game loop
  useEffect(() => {
    if (!gameState.active) return;

    let animFrame: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      animFrame = requestAnimationFrame(loop);
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      const ticks = Math.floor(delta / 0.016) || 1;
      
      const st = stateRef.current;
      let hpLost = 0;
      let moneyGained = 0;
      let scoreGained = 0;
      
      for (let t_tick = 0; t_tick < ticks; t_tick++) {
        // Spawning
        if (gameState.waveActive && st.enemiesToSpawn > 0) {
          st.spawnTimer++;
          if (st.spawnTimer >= 60 - Math.min(gameState.wave * 2, 40)) {
            let hp = 20 + Math.pow(gameState.wave, 1.5) * 5;
            let speed = 0.03 + gameState.wave * 0.002;
            let eType: Enemy['type'] = 'normal';
            let color = '#ff0040';

            const rand = Math.random();
            if (gameState.wave % 5 === 0 && st.enemiesToSpawn === 1) {
              eType = 'boss';
              hp *= 10;
              speed *= 0.5;
              color = '#ff0000';
            } else if (gameState.wave > 3 && rand < 0.2) {
              eType = 'swarm';
              hp *= 0.4;
              speed *= 1.8;
              color = '#facc15';
            } else if (gameState.wave > 5 && rand < 0.4) {
              eType = 'armored';
              hp *= 2.5;
              speed *= 0.8;
              color = '#94a3b8';
            } else if (gameState.wave > 7 && rand < 0.6) {
              eType = 'shielded';
              hp *= 0.8;
              color = '#38bdf8';
            }

            st.enemies.push({
              id: `e_${Date.now()}_${Math.random()}`,
              x: PATH[0].x,
              z: PATH[0].z,
              hp, maxHp: hp,
              speed,
              pathIndex: 0,
              slowTimer: 0,
              type: eType,
              color,
              abilityTimer: eType === 'boss' ? 300 : 0
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

          if (e.type === 'boss' && e.abilityTimer !== undefined) {
            e.abilityTimer--;
            if (e.abilityTimer <= 0) {
              e.abilityTimer = 300; // Reset
              // Spawn swarm minions
              for (let m = 0; m < 3; m++) {
                st.enemies.push({
                  id: `e_swarm_${Date.now()}_${Math.random()}`,
                  x: e.x + (Math.random() - 0.5),
                  z: e.z + (Math.random() - 0.5),
                  hp: e.maxHp * 0.05,
                  maxHp: e.maxHp * 0.05,
                  speed: e.speed * 2,
                  pathIndex: e.pathIndex,
                  slowTimer: 0,
                  type: 'swarm',
                  color: '#facc15'
                });
              }
              // Boss pauses for a moment
              speed = 0;
            } else if (e.abilityTimer > 250) {
              // Paused after spawning
              speed = 0;
            }
          }

          const dx = target.x - e.x;
          const dz = target.z - e.z;
          const dist = Math.hypot(dx, dz);

          if (dist <= speed) {
            e.x = target.x;
            e.z = target.z;
            e.pathIndex++;
          } else if (speed > 0) {
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
              tower.angle = -Math.atan2((closest as Enemy).z - tower.z, (closest as Enemy).x - tower.x);
              st.projectiles.push({
                id: `p_${Date.now()}_${Math.random()}`,
                x: tower.x,
                z: tower.z,
                targetId: (closest as Enemy).id,
                damage: def.damage,
                speed: tower.type === 'sentinel' ? 0.8 : 0.2,
                color: def.color,
                effect: def.effect,
                hasChained: false,
                sourceTower: tower.type
              });
              tower.cooldownTimer = def.cooldown;
            }
          }
        });

        // Projectiles movement
        const checkDeath = (en: Enemy) => {
          if (en.hp <= 0 && st.enemies.includes(en)) {
            st.enemies.splice(st.enemies.indexOf(en), 1);
            moneyGained += (en.type === 'boss' ? 50 : 5);
            scoreGained += (en.type === 'boss' ? 100 : 10);
            const particleCount = en.type === 'boss' ? 30 : 10;
            for (let k = 0; k < particleCount; k++) {
              st.particles.push({
                x: en.x, y: 0.2, z: en.z,
                color: en.color,
                life: 1.0
              });
            }
          }
        };

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
            let actualDamage = p.damage;
            if (target.type === 'armored') {
              if (p.sourceTower === 'genesis' || p.sourceTower === 'contain') actualDamage *= 0.5;
              if (p.sourceTower === 'sentinel') actualDamage *= 1.5;
            }
            if (target.type === 'shielded') {
              actualDamage = p.sourceTower === 'contain' ? p.damage * 5 : 1;
            }

            target.hp -= actualDamage;
            if (target.type === 'boss') {
              // @ts-ignore
              if (typeof window.damageActiveBoss === 'function') {
                // @ts-ignore
                window.damageActiveBoss(actualDamage);
              }
            }

            // Spawn floating text for damage
            st.floatingTexts.push({
              x: target.x, y: 0.8, z: target.z,
              text: `-${Math.floor(actualDamage)}`,
              color: p.color,
              life: 1.0
            });
            
            if (p.effect === 'slow') target.slowTimer = 120;
            
            if (p.effect === 'splash') {
              st.enemies.forEach(e => {
                if (e.id !== target.id && Math.hypot(e.x - target.x, e.z - target.z) < 2.0) {
                  let sDmg = p.damage * 0.5;
                  if (e.type === 'shielded') sDmg = 1;
                  e.hp -= sDmg;
                  if (e.type === 'boss') {
                    // @ts-ignore
                    if (typeof window.damageActiveBoss === 'function') {
                      // @ts-ignore
                      window.damageActiveBoss(sDmg);
                    }
                  }
                  checkDeath(e);
                }
              });
            }

            if (p.effect === 'chain' && !p.hasChained) {
              let nextTarget = null;
              let minDist = 3.0;
              for (const e of st.enemies) {
                if (e.id !== target.id) {
                  const d = Math.hypot(e.x - target.x, e.z - target.z);
                  if (d < minDist) { minDist = d; nextTarget = e; }
                }
              }
              if (nextTarget) {
                st.projectiles.push({
                  ...p,
                  id: `p_${Date.now()}_${Math.random()}`,
                  x: target.x, z: target.z,
                  targetId: nextTarget.id,
                  damage: p.damage * 0.7,
                  hasChained: true
                });
              }
            }

            checkDeath(target);
            st.projectiles.splice(i, 1);
          } else {
            p.x += (dx / dist) * p.speed;
            p.z += (dz / dist) * p.speed;
          }
        }

        // Wave End logic
        if (gameState.waveActive && st.enemiesToSpawn === 0 && st.enemies.length === 0) {
          setGameState(prev => ({
            ...prev,
            waveActive: false,
            bossWarning: false,
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

  const damagePlayer = useCallback((amount: number) => {
    setGameState(prev => {
      const newHp = prev.health - amount;
      if (newHp <= 0) {
        return { ...prev, active: false, health: 0 };
      }
      return { ...prev, health: newHp };
    });
  }, []);

  return {
    gameState,
    startGame,
    startWave,
    placeTower,
    getTowerCost,
    poolResources,
    damagePlayer,
    gameEntities: stateRef.current,
    PATH
  };
};
