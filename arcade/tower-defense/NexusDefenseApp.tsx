import React, { useState, useEffect, useRef } from 'react';
import { getFirebaseApp } from '../../src/firebase/app';

// Define the API endpoint for Leaderboards from legacy JS
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbys9acGtvMq-GgGUlS_COerw9vGyR7HRtqT5JXWkPedG4nC7M-dqWgKIOrEWqlN2xw6/exec';

const TOWER_DEFS = {
    basic:  { cost: 50,  range: 100, damage: 15, cooldown: 30, color: '#00f2ff', label: 'B' },
    rapid:  { cost: 100, range: 80,  damage: 5,  cooldown: 8,  color: '#facc15', label: 'R' },
    sniper: { cost: 150, range: 250, damage: 80, cooldown: 90, color: '#bc13fe', label: 'S' },
    emp:    { cost: 200, range: 120, damage: 2,  cooldown: 40, color: '#38bdf8', label: 'E', effect: 'slow' },
    plasma: { cost: 250, range: 150, damage: 20, cooldown: 60, color: '#fb923c', label: 'P', effect: 'splash' },
    tesla:  { cost: 300, range: 120, damage: 25, cooldown: 45, color: '#e879f9', label: 'T', effect: 'chain' }
};

const CELL_SIZE = 40;
const COLS = 15;
const ROWS = 10;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

// Simple S-shape path
const path = [
    {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1}, {x: 8, y: 1},
    {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5},
    {x: 7, y: 5}, {x: 6, y: 5}, {x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5}, {x: 2, y: 5}, {x: 1, y: 5},
    {x: 1, y: 6}, {x: 1, y: 7}, {x: 1, y: 8},
    {x: 2, y: 8}, {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8}, {x: 6, y: 8}, {x: 7, y: 8}, {x: 8, y: 8}, {x: 9, y: 8}, {x: 10, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}
];

export default function NexusDefenseApp() {
    const [screen, setScreen] = useState('menu');
    const [faction, setFaction] = useState('netrunners');
    const [metaState, setMetaState] = useState({ fragments: 0, upgrades: { integrity: 0, economy: 0, damage: 0 }, playerName: '' });
    
    // Game State
    const [money, setMoney] = useState(0);
    const [health, setHealth] = useState(0);
    const [wave, setWave] = useState(1);
    const [score, setScore] = useState(0);
    const [selectedTower, setSelectedTower] = useState('basic');
    const [gameActive, setGameActive] = useState(false);
    const [waveActive, setWaveActive] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<any>(null);

    // Initialize meta
    useEffect(() => {
        try {
            const raw = localStorage.getItem('aghl_td_meta');
            if (raw) {
                const parsed = JSON.parse(raw);
                setMetaState(prev => ({ ...prev, ...parsed, upgrades: { ...prev.upgrades, ...(parsed.upgrades || {}) } }));
            }
        } catch (e) {}
    }, []);

    const saveMeta = (newState: any) => {
        setMetaState(newState);
        localStorage.setItem('aghl_td_meta', JSON.stringify(newState));
    };

    const getTowerCost = (type: keyof typeof TOWER_DEFS) => {
        let cost = TOWER_DEFS[type].cost;
        if (faction === 'architects') cost = Math.floor(cost * 0.9);
        return cost;
    };

    const startGame = () => {
        let startMoney = 100 + (metaState.upgrades.economy * 20);
        let startHealth = 20 + (metaState.upgrades.integrity * 5);
        if (faction === 'netrunners') startMoney += 50;
        if (faction === 'guardians') startHealth += 10;

        setMoney(startMoney);
        setHealth(startHealth);
        setWave(1);
        setScore(0);
        setGameActive(true);
        setWaveActive(false);
        setScreen('game');

        initEngine(startMoney, startHealth, 1);
    };

    const initEngine = (initMoney: number, initHealth: number, initWave: number) => {
        if (engineRef.current && engineRef.current.animationId) {
            cancelAnimationFrame(engineRef.current.animationId);
        }

        const engine = {
            money: initMoney,
            health: initHealth,
            wave: initWave,
            score: 0,
            enemies: [] as any[],
            towers: [] as any[],
            projectiles: [] as any[],
            particles: [] as any[],
            floatingTexts: [] as any[],
            enemiesToSpawn: 0,
            spawnTimer: 0,
            waveActive: false,
            gameActive: true,
            screenShake: 0,
            time: 0,
            animationId: null as any
        };
        engineRef.current = engine;

        const loop = () => {
            updateEngine();
            drawEngine();
            if (engine.gameActive) {
                engine.animationId = requestAnimationFrame(loop);
            }
        };
        loop();
    };

    const spawnEnemy = () => {
        const engine = engineRef.current;
        if (!engine) return;
        
        let eType = 'normal';
        let hp = 20 + Math.pow(engine.wave, 1.5) * 5;
        let speed = 1.2 + engine.wave * 0.05;
        let color = '#ff0040';

        // diverse enemy logic
        const rand = Math.random();
        if (engine.wave % 10 === 0 && engine.enemiesToSpawn === 1) {
            eType = 'boss';
            hp *= 10;
            speed *= 0.5;
            color = '#ff0000';
        } else if (engine.wave > 3 && rand < 0.2) {
            eType = 'swarm';
            hp *= 0.4;
            speed *= 1.8;
            color = '#facc15';
        } else if (engine.wave > 5 && rand < 0.4) {
            eType = 'armored';
            hp *= 2.5;
            speed *= 0.8;
            color = '#94a3b8';
        } else if (engine.wave > 7 && rand < 0.6) {
            eType = 'shielded';
            hp *= 0.8;
            color = '#38bdf8';
        }

        engine.enemies.push({
            pathIndex: 0,
            x: path[0].x * CELL_SIZE + CELL_SIZE/2,
            y: path[0].y * CELL_SIZE + CELL_SIZE/2,
            hp, maxHp: hp,
            baseSpeed: speed,
            slowTimer: 0,
            color, type: eType,
            id: Math.random()
        });
    };

    const updateEngine = () => {
        const engine = engineRef.current;
        if (!engine || !engine.gameActive) return;

        engine.time++;
        if (engine.screenShake > 0) engine.screenShake--;

        if (engine.waveActive && engine.enemiesToSpawn > 0) {
            engine.spawnTimer++;
            if (engine.spawnTimer >= Math.max(10, 40 - Math.min(engine.wave, 20))) {
                spawnEnemy();
                engine.enemiesToSpawn--;
                engine.spawnTimer = 0;
            }
        } else if (engine.waveActive && engine.enemiesToSpawn === 0 && engine.enemies.length === 0) {
            engine.waveActive = false;
            engine.wave++;
            engine.money += 50 + engine.wave * 5;
            // Sync React State
            setWaveActive(false);
            setWave(engine.wave);
            setMoney(engine.money);
        }

        // Move enemies
        for (let i = engine.enemies.length - 1; i >= 0; i--) {
            const e = engine.enemies[i];
            const targetPoint = path[e.pathIndex + 1];
            
            if (!targetPoint) {
                engine.health--;
                engine.enemies.splice(i, 1);
                setHealth(engine.health);
                if (engine.health <= 0) {
                    engine.gameActive = false;
                    setGameActive(false);
                    const frags = Math.floor(engine.score / 10);
                    const ns = { ...metaState, fragments: metaState.fragments + frags };
                    saveMeta(ns);
                }
                continue;
            }

            let speed = e.baseSpeed;
            if (e.slowTimer > 0) {
                speed *= 0.5;
                e.slowTimer--;
            }

            const targetX = targetPoint.x * CELL_SIZE + CELL_SIZE/2;
            const targetY = targetPoint.y * CELL_SIZE + CELL_SIZE/2;
            const dx = targetX - e.x;
            const dy = targetY - e.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= speed) {
                e.x = targetX;
                e.y = targetY;
                e.pathIndex++;
            } else {
                e.x += (dx / dist) * speed;
                e.y += (dy / dist) * speed;
            }
        }

        // Towers shoot
        engine.towers.forEach((t: any) => {
            if (t.cooldownTimer > 0) t.cooldownTimer--;
            else if (engine.enemies.length > 0) {
                let closest = null;
                let minDist = t.range;
                engine.enemies.forEach((e: any) => {
                    const dist = Math.hypot(e.x - t.x, e.y - t.y);
                    if (dist <= minDist) { minDist = dist; closest = e; }
                });

                if (closest) {
                    t.angle = Math.atan2(closest.y - t.y, closest.x - t.x);
                    engine.projectiles.push({
                        x: t.x, y: t.y,
                        target: closest,
                        speed: t.type === 'sniper' ? 30 : 10,
                        damage: t.damage,
                        color: t.color,
                        effect: t.effect,
                        sourceTower: t.type,
                        hasChained: false
                    });
                    t.cooldownTimer = t.cooldown;
                }
            }
        });

        const spawnParticles = (x: number, y: number, color: string, count: number, speedF = 1) => {
            for (let i=0; i<count; i++) {
                engine.particles.push({
                    x, y, vx: (Math.random()-0.5)*6*speedF, vy: (Math.random()-0.5)*6*speedF,
                    life: 1.0, decay: Math.random()*0.05+0.02, color, size: Math.random()*3+1
                });
            }
        };

        const spawnText = (x: number, y: number, txt: string, color: string) => {
            engine.floatingTexts.push({x, y, text: txt, color, life: 1.0, vy: -1});
        };

        const checkDeath = (e: any) => {
            if (e.hp <= 0 && engine.enemies.includes(e)) {
                engine.enemies.splice(engine.enemies.indexOf(e), 1);
                engine.money += (e.type === 'boss' ? 50 : 5);
                engine.score += (e.type === 'boss' ? 100 : 10);
                spawnParticles(e.x, e.y, e.color, e.type === 'boss' ? 50 : 15);
                spawnText(e.x, e.y, '+'+(e.type === 'boss'?50:5), '#22c55e');
                setMoney(engine.money);
                setScore(engine.score);
            }
        };

        // Projectiles
        for (let i = engine.projectiles.length - 1; i >= 0; i--) {
            const p = engine.projectiles[i];
            if (!engine.enemies.includes(p.target)) {
                engine.projectiles.splice(i, 1);
                continue;
            }
            
            const dx = p.target.x - p.x;
            const dy = p.target.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= p.speed) {
                let actualDamage = p.damage;
                if (p.target.type === 'armored') {
                    if (p.sourceTower === 'rapid' || p.sourceTower === 'plasma') actualDamage *= 0.5;
                    if (p.sourceTower === 'sniper') actualDamage *= 1.5;
                }
                if (p.target.type === 'shielded') {
                    actualDamage = p.sourceTower === 'emp' ? p.damage * 5 : 1;
                }

                p.target.hp -= actualDamage;
                spawnParticles(p.target.x, p.target.y, p.color, 5);
                spawnText(p.target.x, p.target.y - 10, '-' + Math.floor(actualDamage), p.color);
                
                if (actualDamage >= 50 || p.effect === 'splash') engine.screenShake = Math.max(engine.screenShake, 10);
                if (p.effect === 'slow') p.target.slowTimer = 120;
                
                if (p.effect === 'splash') {
                    spawnParticles(p.target.x, p.target.y, p.color, 20, 2);
                    engine.enemies.forEach((e: any) => {
                        if (e !== p.target && Math.hypot(e.x - p.target.x, e.y - p.target.y) < 60) {
                            let sDmg = p.damage * 0.5;
                            if (e.type === 'shielded') sDmg = 1;
                            e.hp -= sDmg;
                            spawnText(e.x, e.y - 10, '-' + Math.floor(sDmg), p.color);
                            checkDeath(e);
                        }
                    });
                }

                if (p.effect === 'chain' && !p.hasChained) {
                    let nextTarget = null;
                    let minDist = 80;
                    engine.enemies.forEach((e: any) => {
                        if (e !== p.target) {
                            const d = Math.hypot(e.x - p.target.x, e.y - p.target.y);
                            if (d < minDist) { minDist = d; nextTarget = e; }
                        }
                    });
                    if (nextTarget) {
                        engine.projectiles.push({
                            x: p.target.x, y: p.target.y, target: nextTarget,
                            speed: p.speed, damage: p.damage * 0.7, color: p.color, effect: 'chain', hasChained: true, sourceTower: p.sourceTower
                        });
                    }
                }

                checkDeath(p.target);
                engine.projectiles.splice(i, 1);
            } else {
                p.x += (dx / dist) * p.speed;
                p.y += (dy / dist) * p.speed;
            }
        }

        // Particles
        for (let i = engine.particles.length - 1; i >= 0; i--) {
            const pt = engine.particles[i];
            pt.x += pt.vx; pt.y += pt.vy; pt.life -= pt.decay;
            if (pt.life <= 0) engine.particles.splice(i, 1);
        }

        // Texts
        for (let i = engine.floatingTexts.length - 1; i >= 0; i--) {
            const ft = engine.floatingTexts[i];
            ft.y += ft.vy; ft.life -= 0.02;
            if (ft.life <= 0) engine.floatingTexts.splice(i, 1);
        }
    };

    const drawEngine = () => {
        const ctx = canvasRef.current?.getContext('2d');
        const engine = engineRef.current;
        if (!ctx || !engine) return;

        ctx.save();
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        if (engine.screenShake > 0) {
            const mag = engine.screenShake * 0.5;
            ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
        }

        // Draw Grid & Path
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let i = 0; i <= COLS; i++) {
            ctx.beginPath(); ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, CANVAS_HEIGHT); ctx.stroke();
        }
        for (let j = 0; j <= ROWS; j++) {
            ctx.beginPath(); ctx.moveTo(0, j*CELL_SIZE); ctx.lineTo(CANVAS_WIDTH, j*CELL_SIZE); ctx.stroke();
        }

        ctx.fillStyle = '#1e293b';
        path.forEach(p => {
            ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });

        // Draw Base
        const base = path[path.length - 1];
        ctx.fillStyle = '#00f2ff';
        ctx.shadowColor = '#00f2ff';
        ctx.shadowBlur = 15;
        ctx.fillRect(base.x * CELL_SIZE + 5, base.y * CELL_SIZE + 5, CELL_SIZE - 10, CELL_SIZE - 10);
        ctx.shadowBlur = 0;

        // Draw Towers
        engine.towers.forEach((t: any) => {
            ctx.fillStyle = '#334155';
            ctx.fillRect(t.col * CELL_SIZE + 4, t.row * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.rotate(t.angle);
            ctx.fillStyle = t.color;
            ctx.shadowColor = t.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-8, 8);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-8, -8);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();

            // Draw level indicators
            if (t.level > 1) {
                ctx.fillStyle = '#fff';
                ctx.font = '10px monospace';
                ctx.fillText(`L${t.level}`, t.col * CELL_SIZE + 2, t.row * CELL_SIZE + 12);
            }
        });

        // Draw Enemies
        engine.enemies.forEach((e: any) => {
            ctx.fillStyle = e.color;
            ctx.shadowColor = e.color;
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            if (e.type === 'boss') {
                ctx.arc(e.x, e.y, 14, 0, Math.PI * 2);
            } else if (e.type === 'swarm') {
                ctx.moveTo(e.x, e.y - 6); ctx.lineTo(e.x + 6, e.y + 6); ctx.lineTo(e.x - 6, e.y + 6);
            } else if (e.type === 'shielded') {
                ctx.arc(e.x, e.y, 10, 0, Math.PI * 2);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                ctx.fillRect(e.x - 8, e.y - 8, 16, 16);
            }
            ctx.fill();
            ctx.shadowBlur = 0;

            // HP Bar
            const hpPct = Math.max(0, e.hp / e.maxHp);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(e.x - 10, e.y - 15, 20, 3);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(e.x - 10, e.y - 15, 20 * hpPct, 3);
        });

        // Draw Projectiles
        engine.projectiles.forEach((p: any) => {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.effect === 'splash' ? 15 : 5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.effect === 'splash' ? 4 : 2, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw Particles
        engine.particles.forEach((pt: any) => {
            ctx.fillStyle = pt.color;
            ctx.globalAlpha = pt.life;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI*2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Draw Texts
        engine.floatingTexts.forEach((ft: any) => {
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = ft.life;
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
        });
        ctx.globalAlpha = 1.0;

        ctx.restore();
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!gameActive || !engineRef.current) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        
        // Account for CSS scaling on mobile
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);
        
        if (path.some(p => p.x === col && p.y === row)) return;

        const engine = engineRef.current;
        const existingTower = engine.towers.find((t: any) => t.col === col && t.row === row);

        if (existingTower) {
            const baseCost = TOWER_DEFS[existingTower.type as keyof typeof TOWER_DEFS].cost;
            const upgradeCost = Math.floor(baseCost * 0.6 * (existingTower.level || 1));
            if (engine.money >= upgradeCost) {
                engine.money -= upgradeCost;
                existingTower.level = (existingTower.level || 1) + 1;
                existingTower.damage = Math.floor(existingTower.damage * 1.5);
                existingTower.range = Math.floor(existingTower.range * 1.15);
                existingTower.cooldown = Math.max(5, Math.floor(existingTower.cooldown * 0.85));
                
                engine.particles.push({x: existingTower.x, y: existingTower.y, vx: 0, vy: 0, life: 1, decay: 0.05, color: '#38bdf8', size: 3}); // Simplified particle spawn
                engine.floatingTexts.push({x: existingTower.x, y: existingTower.y-15, text: `LVL ${existingTower.level}`, color: '#38bdf8', life: 1, vy: -1});
                setMoney(engine.money);
            } else {
                engine.floatingTexts.push({x: existingTower.x, y: existingTower.y-15, text: `NEED ${upgradeCost}`, color: '#ef4444', life: 1, vy: -1});
            }
            return;
        }

        const cost = getTowerCost(selectedTower as keyof typeof TOWER_DEFS);
        if (engine.money >= cost) {
            engine.money -= cost;
            let damageMult = 1 + (metaState.upgrades.damage * 0.05);
            if (faction === 'sentinels') damageMult += 0.10;

            const baseDef = TOWER_DEFS[selectedTower as keyof typeof TOWER_DEFS];
            engine.towers.push({
                col, row,
                x: col * CELL_SIZE + CELL_SIZE/2,
                y: row * CELL_SIZE + CELL_SIZE/2,
                type: selectedTower,
                cooldownTimer: 0,
                range: baseDef.range,
                damage: Math.floor(baseDef.damage * damageMult),
                cooldown: baseDef.cooldown,
                color: baseDef.color,
                label: baseDef.label,
                effect: baseDef.effect,
                angle: 0,
                level: 1
            });
            setMoney(engine.money);
        }
    };

    const startWave = () => {
        if (!waveActive && gameActive && engineRef.current) {
            setWaveActive(true);
            engineRef.current.waveActive = true;
            engineRef.current.enemiesToSpawn = 5 + engineRef.current.wave * 3;
            engineRef.current.spawnTimer = 0;
        }
    };

    return (
        <div>
            <nav aria-label="Arcade navigation" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',padding:'1rem 1rem 0',color:'#cbd5e1',fontFamily:'Arial,sans-serif'}}>
                <a href="../" style={{color:'#00f2ff',textDecoration:'none',fontWeight:700}}>← Back to Arcade</a>
                <a href="../../" style={{color:'#cbd5e1',textDecoration:'none',fontWeight:600}}>Amazing Grace Home</a>
            </nav>

            {screen === 'menu' && (
                <div className="screen">
                    <h1 className="title">NEXUS DEFENSE</h1>
                    <div className="faction-box">
                        <h3>SELECT FACTION</h3>
                        <div className="faction-options">
                            {['netrunners', 'sentinels', 'architects', 'guardians'].map(f => (
                                <div key={f} className={`faction-btn ${faction === f ? 'selected' : ''}`} onClick={() => setFaction(f)}>
                                    <strong>{f.toUpperCase()}</strong><br/>
                                    {f === 'netrunners' && '+50 Start Cores'}
                                    {f === 'sentinels' && '+10% Tower DMG'}
                                    {f === 'architects' && '-10% Tower Cost'}
                                    {f === 'guardians' && '+10 Max Integrity'}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="menu-actions">
                        <button className="btn primary-btn" onClick={startGame}>INITIALIZE COMBAT</button>
                    </div>
                    <section className="instruction-box">
                        <h3>EMERGENT WORD // TOWER DEFENSE INSTRUCTIONS</h3>
                        <ol>
                            <li>Select your faction, then initialize combat.</li>
                            <li>Defend against new Swarms, Armored, Shielded, and Boss enemies.</li>
                            <li>Start each wave, earn cores from kills, and upgrade installed towers.</li>
                        </ol>
                    </section>
                </div>
            )}

            {screen === 'game' && (
                <div className="screen" style={{display:'block'}}>
                    <div id="game-wrapper">
                        <div id="header">
                            <div className="stat">CORES: <span id="stat-money">{money}</span></div>
                            <div className="stat">INTEGRITY: <span id="stat-health">{Math.max(0, health)}</span></div>
                            <div className="stat">WAVE: <span id="stat-wave">{wave}</span></div>
                            <button className="btn primary-btn" onClick={startWave} disabled={waveActive}>START WAVE</button>
                        </div>
                        
                        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={handleCanvasClick} style={{background:'#0f172a'}} />
                        
                        <div id="build-panel">
                            {Object.keys(TOWER_DEFS).map(t => (
                                <div key={t} className={`tower-option ${selectedTower === t ? 'selected' : ''}`} onClick={() => setSelectedTower(t)}>
                                    <strong>{t.charAt(0).toUpperCase() + t.slice(1)}</strong><br/>
                                    Cost: {getTowerCost(t as keyof typeof TOWER_DEFS)}
                                </div>
                            ))}
                        </div>

                        {!gameActive && health <= 0 && (
                            <div id="overlay" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                                <h1>SYSTEM COMPROMISED</h1>
                                <p>Integrity reached 0.</p>
                                <button className="btn" onClick={() => setScreen('menu')}>RETURN TO MENU</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
