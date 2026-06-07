import React, { useState, useEffect, useRef, useCallback } from 'react';
import './syndicate-siege.css';

const ROWS = 6;
const COLS = 8;
const PATH = [
  [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [3, 4],
  [2, 4], [1, 4], [1, 5], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [5, 7]
];
const PATH_SET = new Set(PATH.map(([r, c]) => `${r}-${c}`));

type TowerType = 'rebel' | 'ion' | 'artillery' | 'laser';

type Tower = {
  id: number;
  row: number;
  col: number;
  type: TowerType;
  level: number;
  damage: number;
  range: number;
  cooldown: number;
  maxCooldown: number;
  skin: string;
};

type Enemy = {
  id: string;
  pathIndex: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  delay: number;
  type: 'normal' | 'elite' | 'boss';
  speed: number;
  weakpointFlashed?: boolean;
};

type GameState = {
  credits: number;
  xp: number;
  threat: number;
  wave: number;
  baseHp: number;
  towers: Tower[];
  enemies: Enemy[];
  eliteMode: boolean;
  loopId: number | null;
  overloadTriggered: boolean;
  statusLog: { text: string; type: string; id: number }[];
};

const TOWER_STATS = {
  rebel: { cost: 150, damage: 2, range: 2, cooldown: 3, label: 'Rebel Cannon', desc: 'Standard kinetic defense.', skin: 'tower-rebel' },
  ion: { cost: 250, damage: 1, range: 2, cooldown: 4, label: 'Ion Disrupter', desc: 'Slows enemies on hit.', skin: 'tower-ion' },
  artillery: { cost: 400, damage: 8, range: 3, cooldown: 8, label: 'Plasma Mortar', desc: 'Heavy splash damage.', skin: 'tower-artillery' },
  laser: { cost: 600, damage: 1, range: 4, cooldown: 1, label: 'Neural Beam', desc: 'Extremely high fire rate.', skin: 'tower-laser' }
};

export default function SyndicateSiegeApp() {
  const [state, setState] = useState<GameState>({
    credits: 600,
    xp: 0,
    threat: 0,
    wave: 0,
    baseHp: 10,
    towers: [],
    enemies: [],
    eliteMode: false,
    loopId: null,
    overloadTriggered: false,
    statusLog: []
  });

  const [placingTower, setPlacingTower] = useState<TowerType | null>(null);
  const [upgradingMode, setUpgradingMode] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [infoMsg, setInfoMsg] = useState("Command your rebellion. Deploy towers to defend the data core from Syndicate anomalies.");

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const addLog = useCallback((text: string, type: string = '') => {
    setState(s => ({
      ...s,
      statusLog: [{ text, type, id: Date.now() }, ...s.statusLog].slice(0, 12)
    }));
  }, []);

  const spawnWave = useCallback((isElite: boolean) => {
    setState(s => {
      if (s.loopId) return s;
      const nextWave = s.wave + 1;
      const tier = Math.floor(s.threat / 10);
      const newEnemies: Enemy[] = [];
      const count = isElite ? 4 + nextWave * 2 : 3 + nextWave + (tier >= 3 ? 2 : 0);

      let willTriggerOverload = s.overloadTriggered;

      for (let i = 0; i < count; i++) {
        let hp = Math.floor(3 + nextWave * 0.8);
        let speed = 1;
        let type: 'normal' | 'elite' = 'normal';

        if (isElite) {
          hp = Math.floor(hp * 1.5);
          if (tier >= 3) hp = Math.floor(hp * 1.2);
          if (tier >= 4) speed = 2;
          if (tier >= 5 && i === 0) { type = 'elite'; hp = Math.floor(hp * 2.0); }
        }
        newEnemies.push({ id: `e_${nextWave}_${i}`, pathIndex: 0, hp, maxHp: hp, alive: true, delay: i * 8, type, speed });
      }

      if (isElite && tier >= 4 && !s.overloadTriggered) {
        willTriggerOverload = true;
        const hp = 15 + nextWave * 4;
        newEnemies.push({ id: `b_${nextWave}`, pathIndex: 0, hp, maxHp: hp, alive: true, delay: 10, type: 'boss', speed: 1 });
        addLog("⚠ SYNDICATE OVERSEER DETECTED — CORE UNDER THREAT", "warn");
      }

      const loopId = window.setInterval(gameLoop, 150);
      addLog(isElite ? `⚔ Elite Wave ${nextWave} started (Tier ${tier})` : `🌊 Wave ${nextWave} started (${count} enemies)`, isElite ? "elite" : "good");

      // @ts-ignore
      if (typeof window.triggerEliteModeTransition === 'function') {
        // @ts-ignore
        window.triggerEliteModeTransition(isElite);
      }

      return { ...s, wave: nextWave, enemies: newEnemies, loopId, overloadTriggered: willTriggerOverload };
    });
  }, [addLog]);

  const gameLoop = useCallback(() => {
    setState(s => {
      if (s.enemies.every(e => !e.alive) && s.enemies.length > 0) {
        if (s.loopId) clearInterval(s.loopId);
        const threatInc = s.eliteMode ? 8 : 4;
        const stars = s.baseHp >= 9 && s.wave >= 5 ? 3 : (s.baseHp >= 7 && s.wave >= 3 ? 2 : 1);
        const bonus = 150 * stars * (s.eliteMode ? 2.5 : 1);
        const xpBonus = 300 * stars * (s.eliteMode ? 2 : 1);

        addLog(`✅ Sector Clear! Stars: ${stars} | +${Math.floor(bonus)} cr | +${xpBonus} XP`, s.eliteMode ? "elite" : "good");
        setInfoMsg(`Wave ${s.wave} clear. Reinforcements arrived. +${Math.floor(bonus)} credits.`);

        return { ...s, threat: s.threat + threatInc, credits: s.credits + Math.floor(bonus), xp: s.xp + xpBonus, loopId: null, overloadTriggered: false };
      }

      let newBaseHp = s.baseHp;
      const nextEnemies = [...s.enemies];
      const nextTowers = [...s.towers];
      let crInc = 0;
      let xpInc = 0;

      // Move enemies
      for (let e of nextEnemies) {
        if (!e.alive) continue;
        if (e.delay > 0) {
          e.delay--;
          continue;
        }
        e.pathIndex += e.speed;
        if (e.pathIndex >= PATH.length) {
          e.alive = false;
          const dmg = e.type === "boss" ? 4 : (e.type === "elite" ? 2 : 1);
          newBaseHp -= dmg;
          if (newBaseHp <= 0) {
            newBaseHp = 0;
            if (s.loopId) clearInterval(s.loopId);
            addLog("💀 SECTOR COLLAPSED — data core destroyed", "warn");
            setInfoMsg("💀 Critical failure. The Syndicate has seized control.");
            return { ...s, baseHp: 0, enemies: nextEnemies, loopId: null };
          }
          addLog(`💥 Data breach! Core Integrity: ${newBaseHp}`, "warn");
        }
      }

      // Towers attack
      for (let t of nextTowers) {
        t.cooldown = Math.max(0, t.cooldown - 1);
        if (t.cooldown > 0) continue;
        
        const target = nextEnemies.find(e => {
          if (!e.alive || e.delay > 0 || e.pathIndex >= PATH.length) return false;
          const [er, ec] = PATH[e.pathIndex];
          return Math.abs(er - t.row) + Math.abs(ec - t.col) <= t.range;
        });

        if (target) {
          target.hp -= t.damage;
          t.cooldown = t.maxCooldown;

          const cellEl = document.querySelector(`.cell[data-row="${t.row}"][data-col="${t.col}"]`);
          // @ts-ignore
          if (cellEl && typeof window.triggerTowerFire === 'function') {
            // @ts-ignore
            window.triggerTowerFire(cellEl);
          }

          // Special effects
          if (t.type === 'ion') {
             target.speed = 1; // reset speed to 1 on ion hit (simple slow)
             if (Math.random() > 0.5) target.delay += 1;
          }
          
          if (t.type === 'artillery') {
             // Splash damage to neighbors
             const [tr, tc] = PATH[target.pathIndex];
             nextEnemies.forEach(e => {
                if (e !== target && e.alive && e.delay <= 0) {
                   const [er, ec] = PATH[e.pathIndex];
                   if (Math.abs(er - tr) <= 1 && Math.abs(ec - tc) <= 1) {
                      e.hp -= t.damage / 2;
                   }
                }
             });
          }

          if (target.hp <= (target.maxHp * 0.3) && !target.weakpointFlashed) {
             target.weakpointFlashed = true;
             // @ts-ignore
             if (typeof window.triggerWeakpointFlash === 'function') {
               // @ts-ignore
               window.triggerWeakpointFlash(cellEl);
             }
          }

          if (target.hp <= 0) {
            target.alive = false;
            crInc += target.type === "boss" ? 100 : (target.type === "elite" ? 50 : 25);
            xpInc += target.type === "boss" ? 80 : (target.type === "elite" ? 40 : 20);
            
            // @ts-ignore
            if (typeof window.triggerKillAnimation === 'function') {
              // @ts-ignore
              window.triggerKillAnimation(cellEl, target.type);
            }
            // @ts-ignore
            if (target.type === 'boss' && typeof window.triggerPhaseTransition === 'function') {
              // @ts-ignore
              window.triggerPhaseTransition(cellEl);
            }

            if (s.eliteMode && target.type === "boss") {
              addLog("🏆 Syndicate Overseer neutralized! Huge bonus.", "elite");
              xpInc += 1500;
              crInc += 500;
            }
          }
        }
      }

      return { ...s, baseHp: newBaseHp, enemies: nextEnemies, towers: nextTowers, credits: s.credits + crInc, xp: s.xp + xpInc };
    });
  }, [addLog]);

  const onCellClick = (r: number, c: number) => {
    if (upgradingMode) {
      const t = state.towers.find(tw => tw.row === r && tw.col === c);
      if (!t) {
        setInfoMsg("Select a deployed unit to upgrade.");
        return;
      }
      setSelectedTower(t);
      setInfoMsg(`${TOWER_STATS[t.type].label} Lv ${t.level} — Power ${t.damage} | Range ${t.range}`);
      return;
    }

    if (placingTower) {
      if (PATH_SET.has(`${r}-${c}`) || state.towers.some(tw => tw.row === r && tw.col === c)) {
        setInfoMsg("Invalid deployment zone — path or occupied.");
        return;
      }
      const stats = TOWER_STATS[placingTower];
      if (state.credits < stats.cost) {
        setInfoMsg(`⚠ Low credits. ${stats.label} requires ${stats.cost} cr.`);
        setPlacingTower(null);
        return;
      }
      setState(s => ({
        ...s,
        credits: s.credits - stats.cost,
        towers: [...s.towers, { id: Date.now(), row: r, col: c, type: placingTower, level: 1, damage: stats.damage, range: stats.range, cooldown: 0, maxCooldown: stats.cooldown, skin: stats.skin }]
      }));
      setInfoMsg(`${stats.label} operational at sector (${r},${c}).`);
      addLog(`🗼 ${stats.label} deployed.`, "good");
      setPlacingTower(null);
      return;
    }

    const t = state.towers.find(tw => tw.row === r && tw.col === c);
    if (t) {
      setInfoMsg(`${TOWER_STATS[t.type].label} ready. Range: ${t.range}.`);
    }
  };

  const handleUpgrade = () => {
    if (!selectedTower) return;
    if (selectedTower.level >= 3) {
      setInfoMsg("Unit reached maximum combat efficiency.");
      return;
    }
    const cost = 200 * selectedTower.level;
    if (state.credits < cost) {
      setInfoMsg(`Need ${cost} credits to upgrade.`);
      return;
    }

    setState(s => {
      const newTowers = s.towers.map(t => {
        if (t.id === selectedTower.id) {
          return { ...t, level: t.level + 1, damage: Math.floor(t.damage * 1.5), range: t.range + (t.level === 2 ? 1 : 0), maxCooldown: Math.max(1, t.maxCooldown - 1) };
        }
        return t;
      });
      addLog(`⬆ ${TOWER_STATS[selectedTower.type].label} upgraded to Lv ${selectedTower.level + 1}`, "elite");
      return { ...s, credits: s.credits - cost, towers: newTowers };
    });
    setSelectedTower(null);
    setUpgradingMode(false);
  };

  return (
    <div className="syndicate-app-container">
      <header className="syndicate-header">
        <a href="../../" className="logo" aria-label="Amazing Grace Home Living — Home">
          <img src="../../assets/logo.png" alt="Amazing Grace" width="36" height="36" />
          Amazing Grace
        </a>
        <nav id="main-nav" className="nav-links">
          <a href="../../">Home</a>
          <a href="../../arcade/" className="active" aria-current="page">Arcade</a>
          <a href="../../stories/">Stories</a>
          <a href="../../library/">Library</a>
        </nav>
      </header>

      <main className="game-wrapper">
        <div className="game-header">
          <h1 className="game-title">⚔ SYNDICATE SIEGE</h1>
          <p className="game-subtitle">Data Core Defense System v2.0</p>
        </div>

        <div id="hud">
          <div className="hud-card">
            <span className="hud-label">CREDITS</span>
            <span className="hud-value color-blue">{state.credits}</span>
          </div>
          <div className="hud-card">
            <span className="hud-label">THREAT</span>
            <span className="hud-value color-red">{state.threat}%</span>
          </div>
          <div className="hud-card">
            <span className="hud-label">WAVE</span>
            <span className="hud-value">{state.wave}</span>
          </div>
          <div className="hud-card integrity-card">
            <span className="hud-label">CORE INTEGRITY</span>
            <div className="integrity-bar">
               <div className="integrity-fill" style={{ width: `${(state.baseHp / 10) * 100}%` }}></div>
            </div>
            <span className="hud-value">{state.baseHp}</span>
          </div>
        </div>

        <div className="layout-body">
          <div className="sidebar-left">
             <div className="section-title">DEPLOYMENT</div>
             <div className="tower-selection-grid">
                {(Object.entries(TOWER_STATS) as [TowerType, typeof TOWER_STATS.rebel][]).map(([type, stats]) => (
                   <button 
                      key={type} 
                      className={`tower-card ${placingTower === type ? 'selected' : ''}`}
                      onClick={() => { setPlacingTower(type); setUpgradingMode(false); }}
                      disabled={state.credits < stats.cost || !!state.loopId}
                   >
                      <div className={`tower-icon ${stats.skin}`}></div>
                      <div className="tower-info">
                         <span className="name">{stats.label}</span>
                         <span className="cost">{stats.cost} CR</span>
                      </div>
                      <div className="tower-tooltip">{stats.desc}</div>
                   </button>
                ))}
             </div>
             
             <div className="actions-row">
                <button className={`action-btn ${upgradingMode ? 'active' : ''}`} onClick={() => { setUpgradingMode(!upgradingMode); setPlacingTower(null); }}>
                   UNIT UPGRADE
                </button>
                <button className="action-btn start-btn" onClick={() => spawnWave(state.eliteMode)} disabled={!!state.loopId || state.baseHp <= 0}>
                   {state.loopId ? 'IN COMBAT' : 'START WAVE'}
                </button>
             </div>

             <div className={`elite-toggle ${state.eliteMode ? 'on' : ''}`} onClick={() => setState(s => ({ ...s, eliteMode: !s.eliteMode }))}>
                <div className="toggle-switch"></div>
                <span>ELITE MODE {state.eliteMode ? 'ACTIVE' : 'OFF'}</span>
             </div>
          </div>

          <div className="center-grid">
            <div id="grid">
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  const isPath = PATH_SET.has(`${r}-${c}`);
                  const tower = state.towers.find(t => t.row === r && t.col === c);
                  const enemyOnCell = state.enemies.find(e => e.alive && e.delay <= 0 && e.pathIndex < PATH.length && PATH[Math.floor(e.pathIndex)][0] === r && PATH[Math.floor(e.pathIndex)][1] === c);

                  let cellClass = 'cell';
                  if (isPath) cellClass += ' path';
                  if (tower) cellClass += ` ${tower.skin} lv-${tower.level}`;
                  if (placingTower && !isPath && !tower) cellClass += ' placement-hover';

                  return (
                    <div key={`${r}-${c}`} className={cellClass} data-row={r} data-col={c} onClick={() => onCellClick(r, c)}>
                      {enemyOnCell && <div className={`enemy ${enemyOnCell.type}`}></div>}
                    </div>
                  );
                })
              )}
            </div>
            <div id="info-panel" dangerouslySetInnerHTML={{ __html: infoMsg }}></div>
          </div>

          <div className="sidebar-right">
             <div className="section-title">BATTLE LOG</div>
             <div id="log">
               {state.statusLog.map(log => (
                 <p key={log.id} className={log.type}>{log.text}</p>
               ))}
             </div>
             
             {upgradingMode && (
               <div id="upgrade-panel">
                 <h3>UNIT ENHANCEMENT</h3>
                 {selectedTower ? (
                    <div className="upgrade-content">
                       <p>Refining {TOWER_STATS[selectedTower.type].label}...</p>
                       <p className="stat">Current Efficiency: Lv {selectedTower.level}</p>
                       <button className="upgrade-confirm" onClick={handleUpgrade} disabled={selectedTower.level >= 3}>
                          UPGRADE ({200 * selectedTower.level} CR)
                       </button>
                    </div>
                 ) : (
                    <p className="hint">Select a unit on the grid to enhance.</p>
                 )}
                 <button className="close-btn" onClick={() => { setUpgradingMode(false); setSelectedTower(null); }}>CANCEL</button>
               </div>
             )}
          </div>
        </div>
        
        <footer className="game-footer">
           <a href="../" className="back-link">← RETURN TO ARCADE</a>
        </footer>
      </main>
    </div>
  );
}
