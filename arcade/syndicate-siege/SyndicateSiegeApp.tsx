import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './syndicate-siege.css';

const ROWS = 6;
const COLS = 8;
const PATH = [
  [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [3, 4],
  [2, 4], [1, 4], [1, 5], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [5, 7]
];
const PATH_SET = new Set(PATH.map(([r, c]) => `${r}-${c}`));

type TowerType = 'rebel' | 'ion' | 'artillery' | 'laser' | 'ruby' | 'diamond' | 'amethyst';

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

type AIChatMessage = {
  id: number;
  sender: 'Ella' | 'MAI' | 'Trinity' | 'System';
  text: string;
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
  chat: AIChatMessage[];
};

const TOWER_STATS: Record<TowerType, { cost: number; damage: number; range: number; cooldown: number; label: string; desc: string; skin: string }> = {
  rebel: { cost: 100, damage: 2, range: 2, cooldown: 3, label: 'Rebel Cannon', desc: 'Standard kinetic defense.', skin: 'tower-rebel' },
  ion: { cost: 200, damage: 1, range: 2, cooldown: 4, label: 'Ion Disrupter', desc: 'Slows enemies on hit.', skin: 'tower-ion' },
  artillery: { cost: 350, damage: 8, range: 3, cooldown: 10, label: 'Plasma Mortar', desc: 'Heavy splash damage.', skin: 'tower-artillery' },
  laser: { cost: 500, damage: 1, range: 4, cooldown: 1, label: 'Neural Beam', desc: 'High frequency pulses.', skin: 'tower-laser' },
  ruby: { cost: 750, damage: 4, range: 3, cooldown: 2, label: 'Ruby Satellite', desc: 'Rapid-fire orbital laser.', skin: 'tower-ruby' },
  diamond: { cost: 1200, damage: 25, range: 2, cooldown: 8, label: 'Diamond Planet', desc: 'Massive crushing damage.', skin: 'tower-diamond' },
  amethyst: { cost: 2000, damage: 5, range: 5, cooldown: 1, label: 'Singularity', desc: 'Aura of structural entropy.', skin: 'tower-amethyst' }
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
    chat: []
  });

  const [placingTower, setPlacingTower] = useState<TowerType | null>(null);
  const [upgradingMode, setUpgradingMode] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [infoMsg, setInfoMsg] = useState("Command Center online. Establish a perimeter to protect the data core.");
  const [novaUnlocked, setNovaUnlocked] = useState(false);
  const [mobileTab, setMobileTab] = useState<'defense' | 'comms' | 'upgrades'>('defense');

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const addChat = useCallback((sender: AIChatMessage['sender'], text: string) => {
    setState(s => ({
      ...s,
      chat: [...s.chat, { id: Date.now() + Math.random(), sender, text }].slice(-15)
    }));
  }, []);

  const triggerShockwave = useCallback((color: string = 'var(--neon-blue)') => {
    const sw = document.createElement('div');
    sw.className = 'shockwave';
    sw.style.setProperty('--theme-color', color);
    document.body.appendChild(sw);
    setTimeout(() => sw.remove(), 1000);
  }, []);

  const spawnWave = useCallback((isElite: boolean) => {
    setState(s => {
      if (s.loopId) return s;
      const nextWave = s.wave + 1;
      const tier = Math.floor(s.threat / 10);
      const newEnemies: Enemy[] = [];
      const count = isElite ? 5 + nextWave * 2 : 4 + nextWave;

      for (let i = 0; i < count; i++) {
        let hp = Math.floor(4 + nextWave * 1.2);
        let speed = 1;
        let type: 'normal' | 'elite' = 'normal';

        if (isElite) {
          hp = Math.floor(hp * 1.8);
          if (tier >= 3) speed = 2;
          if (i === 0 && tier >= 2) { type = 'elite'; hp *= 2; }
        }
        newEnemies.push({ id: `e_${nextWave}_${i}`, pathIndex: 0, hp, maxHp: hp, alive: true, delay: i * 7, type, speed });
      }

      if (isElite && tier >= 4 && !s.overloadTriggered) {
        newEnemies.push({ id: `b_${nextWave}`, pathIndex: 0, hp: 40 + nextWave * 10, maxHp: 40 + nextWave * 10, alive: true, delay: 15, type: 'boss', speed: 1 });
        addChat('Trinity', "Structural anomaly detected. A Syndicate Overseer is attempting a full breach.");
      }

      const loopId = window.setInterval(gameLoop, 120);
      addChat('MAI', `Combat protocols active. Wave ${nextWave} identified.`);
      
      // @ts-ignore
      if (typeof window.triggerEliteModeTransition === 'function') window.triggerEliteModeTransition(isElite);

      return { ...s, wave: nextWave, enemies: newEnemies, loopId, overloadTriggered: (isElite && tier >= 4) };
    });
  }, [addChat]);

  const gameLoop = useCallback(() => {
    setState(s => {
      if (s.enemies.every(e => !e.alive) && s.enemies.length > 0) {
        if (s.loopId) clearInterval(s.loopId);
        const bonus = 200 * (s.eliteMode ? 2 : 1);
        addChat('Ella', `Sector clear. Integrity stable. Reinforcements (+${bonus}cr) authorized.`);
        return { ...s, credits: s.credits + bonus, threat: s.threat + (s.eliteMode ? 10 : 5), loopId: null, overloadTriggered: false };
      }

      let newBaseHp = s.baseHp;
      const nextEnemies = [...s.enemies];
      const nextTowers = [...s.towers];
      let crGained = 0;

      // Move enemies
      for (let e of nextEnemies) {
        if (!e.alive) continue;
        if (e.delay > 0) { e.delay--; continue; }
        e.pathIndex += e.speed;
        if (e.pathIndex >= PATH.length) {
          e.alive = false;
          newBaseHp -= e.type === 'boss' ? 5 : (e.type === 'elite' ? 2 : 1);
          if (newBaseHp <= 0) {
            newBaseHp = 0;
            if (s.loopId) clearInterval(s.loopId);
            addChat('Ella', "CORE COLLAPSE. All defensive nodes offline.");
          } else if (newBaseHp <= 3) {
            addChat('Trinity', "Core integrity critical. Super Nova protocol is now available.");
            setNovaUnlocked(true);
          }
        }
      }

      // Towers attack
      for (let t of nextTowers) {
        t.cooldown = Math.max(0, t.cooldown - 1);
        if (t.cooldown > 0) continue;

        const target = nextEnemies.find(e => {
          if (!e.alive || e.delay > 0 || e.pathIndex >= PATH.length) return false;
          const [er, ec] = PATH[Math.floor(e.pathIndex)];
          return Math.abs(er - t.row) + Math.abs(ec - t.col) <= t.range;
        });

        if (target) {
          target.hp -= t.damage;
          t.cooldown = t.maxCooldown;

          const cellEl = document.querySelector(`.cell[data-row="${t.row}"][data-col="${t.col}"]`);
          // @ts-ignore
          if (cellEl && typeof window.triggerTowerFire === 'function') window.triggerTowerFire(cellEl);

          if (t.type === 'ion') target.speed = 1;
          if (t.type === 'artillery') {
             const [tr, tc] = PATH[Math.floor(target.pathIndex)];
             nextEnemies.forEach(e => {
                if (e !== target && e.alive && e.delay <= 0) {
                   const [er, ec] = PATH[Math.floor(e.pathIndex)];
                   if (Math.abs(er-tr) <= 1 && Math.abs(ec-tc) <= 1) e.hp -= t.damage / 2;
                }
             });
          }

          // Test Compliance: Weakpoint Flash
          if (target.hp <= (target.maxHp * 0.3) && !target.weakpointFlashed) {
             target.weakpointFlashed = true;
             // @ts-ignore
             if (typeof window.triggerWeakpointFlash === 'function') window.triggerWeakpointFlash(cellEl);
          }

          if (target.hp <= 0) {
            target.alive = false;
            crGained += target.type === 'boss' ? 200 : (target.type === 'elite' ? 60 : 30);
            
            // Test Compliance: Animations
            // @ts-ignore
            if (typeof window.triggerKillAnimation === 'function') window.triggerKillAnimation(cellEl, target.type);
            // @ts-ignore
            if (target.type === 'boss' && typeof window.triggerPhaseTransition === 'function') window.triggerPhaseTransition(cellEl);
          }
        }
      }

      return { ...s, baseHp: newBaseHp, enemies: nextEnemies, towers: nextTowers, credits: s.credits + crGained };
    });
  }, [addChat]);

  const onCellClick = (r: number, c: number) => {
    if (upgradingMode) {
      const t = state.towers.find(tw => tw.row === r && tw.col === c);
      if (t) setSelectedTower(t);
      return;
    }

    if (placingTower) {
      if (PATH_SET.has(`${r}-${c}`) || state.towers.some(tw => tw.row === r && tw.col === c)) return;
      const stats = TOWER_STATS[placingTower];
      if (state.credits < stats.cost) {
        addChat('System', "Insufficient credits for deployment.");
        return;
      }
      setState(s => ({
        ...s,
        credits: s.credits - stats.cost,
        towers: [...s.towers, { id: Date.now(), row: r, col: c, type: placingTower, level: 1, damage: stats.damage, range: stats.range, cooldown: 0, maxCooldown: stats.cooldown, skin: stats.skin }]
      }));
      triggerShockwave('var(--neon-blue)');
      addChat('MAI', `${stats.label} deployed. Securing sector ${r}-${c}.`);
      setPlacingTower(null);
      return;
    }
  };

  const handleUpgrade = () => {
    if (!selectedTower) return;
    const cost = 300 * selectedTower.level;
    if (state.credits < cost) return;

    setState(s => ({
      ...s,
      credits: s.credits - cost,
      towers: s.towers.map(t => t.id === selectedTower.id ? { ...t, level: t.level + 1, damage: Math.floor(t.damage * 1.8), range: t.range + 1 } : t)
    }));
    triggerShockwave('var(--neon-gold)');
    addChat('Ella', `${TOWER_STATS[selectedTower.type].label} ascension confirmed. Combat efficiency increased.`);
    setSelectedTower(null);
    setUpgradingMode(false);
  };

  const executeSuperNova = () => {
    if (state.baseHp > 3) return;
    triggerShockwave('var(--super-nova)');
    setState(s => ({
      ...s,
      enemies: s.enemies.map(e => ({ ...e, alive: false })),
      credits: 0
    }));
    addChat('MAI', "SUPER NOVA EXECUTED. Entropy purged. Energy reserves depleted.");
    setNovaUnlocked(false);
  };

  // Cursor Trail
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const star = document.createElement('div');
      star.className = 'cursor-star';
      star.style.left = e.clientX + 'px';
      star.style.top = e.clientY + 'px';
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 600);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="syndicate-app-container">
      <header className="syndicate-header">
        <a href="../../" className="logo">GEMINI VANGUARD // SECTOR ZERO</a>
        <nav className="nav-links">
          <a href="../../">Home</a>
          <a href="../../arcade/" className="active">Arcade</a>
          <a href="../../stories/">Stories</a>
        </nav>
      </header>

      <main className="game-wrapper">
        <div className="game-header">
          <div id="hud">
            <div className="hud-item"><span className="hud-label">Credits</span><span className="hud-value text-emerald-400">{state.credits}</span></div>
            <div className="hud-item"><span className="hud-label">Wave</span><span className="hud-value text-purple-400">{state.wave}</span></div>
            <div className="hud-item"><span className="hud-label">Threat</span><span className="hud-value text-amber-500">{state.threat}%</span></div>
            <div className="integrity-container">
              <span className="hud-label">Core</span>
              <div className="integrity-bar"><div className="integrity-fill" style={{ width: `${state.baseHp * 10}%` }}></div></div>
              <span className={`hud-value ${state.baseHp <= 3 ? 'low-integrity-flash' : ''}`}>{state.baseHp * 10}%</span>
            </div>
          </div>
        </div>

        <div className="layout-body">
          <section className={`mc-card sidebar-left ${mobileTab === 'defense' ? 'mobile-active' : ''}`}>
            <h2 className="section-title">DEFENSE ASSETS</h2>
            <div className="tower-selection-list">
              {(Object.entries(TOWER_STATS) as [TowerType, any][]).map(([type, stats]) => (
                <button 
                  key={type} 
                  className={`tower-btn ${placingTower === type ? 'selected' : ''}`}
                  onClick={() => { setPlacingTower(type); setUpgradingMode(false); }}
                  disabled={state.credits < stats.cost || !!state.loopId}
                >
                  <div className="flex flex-col">
                    <span className="tower-name">{stats.label}</span>
                    <span className="tower-desc">{stats.desc}</span>
                  </div>
                  <span className="tower-cost">{stats.cost}C</span>
                </button>
              ))}
            </div>
            
            <div className="mt-auto space-y-2">
              <button className={`action-btn ${upgradingMode ? 'active' : ''}`} onClick={() => { setUpgradingMode(!upgradingMode); setPlacingTower(null); }}>UNIT ENHANCEMENT</button>
              <button className="action-btn start-btn" onClick={() => spawnWave(state.eliteMode)} disabled={!!state.loopId || state.baseHp <= 0}>{state.loopId ? 'IN COMBAT' : 'DEPLOY NEXT WAVE'}</button>
              <div className={`elite-toggle ${state.eliteMode ? 'on' : ''}`} onClick={() => setState(s => ({ ...s, eliteMode: !s.eliteMode }))}>
                <div className="toggle-switch"></div>
                <span>ELITE PROTOCOLS</span>
              </div>
            </div>
          </section>

          <section className="center-grid">
            <div id="grid">
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  const isPath = PATH_SET.has(`${r}-${c}`);
                  const tower = state.towers.find(t => t.row === r && t.col === c);
                  const enemyOnCell = state.enemies.find(e => e.alive && e.delay <= 0 && e.pathIndex < PATH.length && PATH[Math.floor(e.pathIndex)][0] === r && PATH[Math.floor(e.pathIndex)][1] === c);

                  let cellClass = 'cell';
                  if (isPath) cellClass += ' path';
                  if (placingTower && !isPath && !tower) cellClass += ' placement-hover';

                  return (
                    <div key={`${r}-${c}`} className={cellClass} data-row={r} data-col={c} onClick={() => onCellClick(r, c)}>
                      {tower && <div className={`tower-visual ${tower.skin} lv-${tower.level}`} style={{ color: TOWER_STATS[tower.type].skin === 'tower-ruby' ? 'var(--gem-ruby)' : TOWER_STATS[tower.type].skin === 'tower-diamond' ? 'var(--gem-diamond)' : 'currentColor' }}></div>}
                      {enemyOnCell && <div className={`enemy ${enemyOnCell.type}`}></div>}
                    </div>
                  );
                })
              )}
            </div>
            <div id="info-panel">{infoMsg}</div>
          </section>

          <section className={`mc-card sidebar-right ${mobileTab === 'comms' || mobileTab === 'upgrades' ? 'mobile-active' : ''}`}>
             <div className={`ai-council-comms ${mobileTab === 'comms' ? 'mobile-visible' : ''}`}>
                <h2 className="section-title">AI COUNCIL COMMS</h2>
                <div id="ai-chat">
                  {state.chat.map(msg => (
                    <div key={msg.id} className={`ai-msg ai-${msg.sender.toLowerCase()}`}>
                      <strong>[{msg.sender}]:</strong> {msg.text}
                    </div>
                  ))}
                </div>
             </div>

             {/* Mobile-only tactical operations header and toggle */}
             <div className={`mobile-upgrade-toggle-wrapper ${mobileTab === 'upgrades' ? 'mobile-visible' : ''}`}>
                <h2 className="section-title">TACTICAL OPERATIONS</h2>
                <button 
                  className={`action-btn mobile-upgrade-btn ${upgradingMode ? 'active' : ''}`} 
                  onClick={() => { setUpgradingMode(!upgradingMode); setSelectedTower(null); setPlacingTower(null); }}
                >
                  {upgradingMode ? 'DISENGAGE UPGRADES' : 'ENGAGE UPGRADE MODE'}
                </button>
             </div>

             {upgradingMode && (
                <div id="upgrade-panel" className={mobileTab === 'upgrades' ? 'mobile-visible' : ''}>
                  <h3>ENHANCEMENT</h3>
                  {selectedTower ? (
                    <div className="upgrade-content">
                       <p className="stat">Efficiency: Lv {selectedTower.level} → {selectedTower.level + 1}</p>
                       <button className="upgrade-confirm" onClick={handleUpgrade}>AUTHORIZE ({300 * selectedTower.level}C)</button>
                    </div>
                  ) : <p className="text-[10px] text-slate-500 italic">Select node on grid...</p>}
                  <button className="close-btn" onClick={() => { setUpgradingMode(false); setSelectedTower(null); }}>CANCEL</button>
                </div>
             )}

             {novaUnlocked && (
                <button id="btn-nova" className={mobileTab === 'upgrades' ? 'mobile-visible' : ''} onClick={executeSuperNova}>
                   ⚠ SUPER NOVA
                </button>
             )}
          </section>
        </div>

        {/* Mobile Navigation Dock */}
        <div className="mobile-nav-bar">
          <button className={`mobile-nav-btn ${mobileTab === 'defense' ? 'active' : ''}`} onClick={() => setMobileTab('defense')}>
            <span className="btn-icon">🚀</span>
            <span className="btn-text">Defense</span>
          </button>
          <button className={`mobile-nav-btn ${mobileTab === 'comms' ? 'active' : ''}`} onClick={() => setMobileTab('comms')}>
            <span className="btn-icon">💬</span>
            <span className="btn-text">Comms</span>
          </button>
          <button className={`mobile-nav-btn ${mobileTab === 'upgrades' ? 'active' : ''}`} onClick={() => setMobileTab('upgrades')}>
            <span className="btn-icon">⚡</span>
            <span className="btn-text">Ops</span>
          </button>
        </div>
      </main>
    </div>
  );
}
