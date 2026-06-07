import React, { useState, useEffect, useRef, useCallback } from 'react';
import './syndicate-siege.css';

const ROWS = 6;
const COLS = 8;
const PATH = [
  [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [3, 4],
  [2, 4], [1, 4], [1, 5], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [5, 7]
];
const PATH_SET = new Set(PATH.map(([r, c]) => `${r}-${c}`));

type Tower = {
  row: number;
  col: number;
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

export default function SyndicateSiegeApp() {
  const [state, setState] = useState<GameState>({
    credits: 500,
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

  const [placingTower, setPlacingTower] = useState(false);
  const [upgradingMode, setUpgradingMode] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [infoMsg, setInfoMsg] = useState("Build towers, start a wave, defend the base. Toggle Elite Mode for harder enemies and better rewards.");

  // Ref to state for interval loop
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
      const count = isElite ? 3 + nextWave : 3 + nextWave + (tier >= 3 ? 2 : 0);

      let willTriggerOverload = s.overloadTriggered;

      for (let i = 0; i < count; i++) {
        let hp = Math.floor(2 + nextWave * 0.5);
        let speed = 1;
        let type: 'normal' | 'elite' = 'normal';

        if (isElite) {
          if (tier >= 3) hp = Math.floor(hp * 1.1);
          if (tier >= 4) speed = 2;
          if (tier >= 5 && i === 0) { type = 'elite'; hp = Math.floor(hp * 1.5); }
        }
        newEnemies.push({ id: `e_${nextWave}_${i}`, pathIndex: 0, hp, maxHp: hp, alive: true, delay: i * 10, type, speed });
      }

      if (isElite && tier >= 5 && !s.overloadTriggered) {
        willTriggerOverload = true;
        const hp = 10 + nextWave * 3;
        newEnemies.push({ id: `b_${nextWave}`, pathIndex: 0, hp, maxHp: hp, alive: true, delay: 5, type: 'boss', speed: 1 });
        addLog("⚠ TIER 5 OVERLOAD — OVERSEER INCOMING", "warn");
      }

      const loopId = window.setInterval(gameLoop, 200);
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
        const threatInc = s.eliteMode ? 6 : 3;
        const stars = s.baseHp >= 9 && s.wave >= 5 ? 3 : (s.baseHp >= 7 && s.wave >= 3 ? 2 : 1);
        const bonus = 100 * stars * (s.eliteMode ? 2 : 1);
        const xpBonus = 200 * stars * (s.eliteMode ? 2 : 1);

        addLog(`✅ Wave ${s.wave} cleared! Stars: ${stars} | +${bonus} cr | +${xpBonus} XP`, s.eliteMode ? "elite" : "good");
        setInfoMsg(`Wave ${s.wave} cleared — ${stars}★. Press Start Wave for next round.`);

        return { ...s, threat: s.threat + threatInc, credits: s.credits + bonus, xp: s.xp + xpBonus, loopId: null, overloadTriggered: false };
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
          const dmg = e.type === "boss" ? 3 : (e.type === "elite" ? 2 : 1);
          newBaseHp -= dmg;
          if (newBaseHp <= 0) {
            newBaseHp = 0;
            if (s.loopId) clearInterval(s.loopId);
            addLog("💀 GAME OVER — base destroyed", "warn");
            setInfoMsg("💀 Base destroyed. The Syndicate wins this round.");
            return { ...s, baseHp: 0, enemies: nextEnemies, loopId: null };
          }
          addLog(`💥 Enemy reached base! Base HP: ${newBaseHp}`, "warn");
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
            crInc += target.type === "boss" ? 60 : (target.type === "elite" ? 30 : 20);
            xpInc += target.type === "boss" ? 50 : (target.type === "elite" ? 30 : 15);
            
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
              addLog("🏆 Boss defeated! Ultra x3, tower_ultra cosmetic, lore unlocked!", "elite");
              xpInc += 1000;
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
        setInfoMsg("No tower here. Click a purple/gold tower cell.");
        return;
      }
      setSelectedTower(t);
      setInfoMsg(`Tower Lv ${t.level} — DMG ${t.damage} | Range ${t.range} | CD ${t.maxCooldown}`);
      return;
    }

    if (placingTower) {
      if (PATH_SET.has(`${r}-${c}`) || state.towers.some(tw => tw.row === r && tw.col === c)) {
        setInfoMsg("Can't place there — path or occupied.");
        return;
      }
      if (state.credits < 150) {
        setInfoMsg("⚠ Not enough credits (need 150).");
        setPlacingTower(false);
        return;
      }
      setState(s => ({
        ...s,
        credits: s.credits - 150,
        towers: [...s.towers, { row: r, col: c, level: 1, damage: 2, range: 2, cooldown: 0, maxCooldown: 3, skin: 'tower-1' }]
      }));
      setInfoMsg(`Tower placed at (${r},${c}). Costs 150 cr.`);
      addLog(`🗼 Tower placed at (${r},${c})`, "good");
      setPlacingTower(false);
      return;
    }

    const t = state.towers.find(tw => tw.row === r && tw.col === c);
    if (t) {
      setInfoMsg(`Tower Lv ${t.level} — DMG ${t.damage} | Range ${t.range} | CD base ${t.maxCooldown}`);
    }
  };

  const handleUpgrade = () => {
    if (!selectedTower) return;
    if (selectedTower.level >= 2) {
      setInfoMsg("Max level reached.");
      return;
    }
    // We mock the ultra shard logic for the standalone app.
    setState(s => {
      const newTowers = s.towers.map(t => {
        if (t === selectedTower) {
          return { ...t, level: 2, damage: t.damage * 2, range: t.range + 1, maxCooldown: Math.max(1, t.maxCooldown - 1), skin: 'tower-2' };
        }
        return t;
      });
      addLog(`⬆ Tower upgraded to Lv 2!`, "elite");
      return { ...s, towers: newTowers };
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

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
        <h1 className="game-title">⚔ SYNDICATE SIEGE</h1>

        <div id="hud">
          <span>💰 <span id="rebel-credits">{state.credits}</span> cr</span>
          <span>⭐ XP <span id="rebel-xp">{state.xp}</span></span>
          <span>🌡 Threat <span id="rebel-threat">{state.threat}</span>%</span>
          <span>🌊 Wave <span id="wave-display">{state.wave}</span></span>
          <span>🏯 Base <span id="base-hp">{state.baseHp}</span></span>
        </div>

        <div id="grid">
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => {
              const isPath = PATH_SET.has(`${r}-${c}`);
              const tower = state.towers.find(t => t.row === r && t.col === c);
              const enemyOnCell = state.enemies.find(e => e.alive && e.delay <= 0 && e.pathIndex < PATH.length && PATH[e.pathIndex][0] === r && PATH[e.pathIndex][1] === c);

              let cellClass = 'cell';
              if (isPath) cellClass += ' path';
              if (tower) cellClass += ` ${tower.skin}`;
              if (placingTower && !isPath && !tower) cellClass += ' placement-hover';

              return (
                <div key={`${r}-${c}`} className={cellClass} data-row={r} data-col={c} onClick={() => onCellClick(r, c)}>
                  {enemyOnCell && <div className={`enemy ${enemyOnCell.type}`}></div>}
                </div>
              );
            })
          )}
        </div>

        <div id="controls">
          <button className="ctrl-btn" onClick={() => spawnWave(state.eliteMode)} disabled={!!state.loopId || state.baseHp <= 0}>▶ Start Wave</button>
          <button className={`ctrl-btn ${placingTower ? 'active' : ''}`} onClick={() => { setPlacingTower(!placingTower); setUpgradingMode(false); }}>🗼 Buy Tower (150 cr)</button>
          <button className={`ctrl-btn ${upgradingMode ? 'active' : ''}`} onClick={() => { setUpgradingMode(!upgradingMode); setPlacingTower(false); }}>⬆ Upgrade Tower</button>
          <button className={`ctrl-btn ${state.eliteMode ? 'elite-on' : ''}`} onClick={() => setState(s => ({ ...s, eliteMode: !s.eliteMode }))}>
            Elite Mode: {state.eliteMode ? 'ON' : 'OFF'}
          </button>
          <a href="../" className="ctrl-btn">← Arcade</a>
        </div>

        {upgradingMode && (
          <div id="upgrade-panel" style={{ display: 'block' }}>
            <h3>⬆ Upgrade Selected Tower</h3>
            <p id="upgrade-desc">{selectedTower ? `Selected Tower Lv ${selectedTower.level}.` : "Click a tower cell to select it."}</p>
            <button className="ctrl-btn" onClick={handleUpgrade} disabled={!selectedTower || selectedTower.level >= 2}>Upgrade</button>
            <button className="ctrl-btn" style={{ marginLeft: '0.5rem' }} onClick={() => { setUpgradingMode(false); setSelectedTower(null); }}>Close</button>
          </div>
        )}

        <div id="info-panel" dangerouslySetInnerHTML={{ __html: infoMsg }}></div>

        <div id="log">
          {state.statusLog.map(log => (
            <p key={log.id} className={log.type}>{log.text}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
