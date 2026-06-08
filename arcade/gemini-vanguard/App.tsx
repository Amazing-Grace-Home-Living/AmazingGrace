import React, { useRef, useEffect, useState, useCallback } from 'react';

// --- Game Configuration ---
const config = {
    gridSize: 60,
    path: [
        {x: -50, y: 150}, {x: 200, y: 150}, {x: 200, y: 450}, 
        {x: 500, y: 450}, {x: 500, y: 200}, {x: 800, y: 200}, {x: 1200, y: 200}
    ],
    types: {
        satellite: { cost: 150, range: 150, damage: 10, rate: 20, color: '#ef4444', icon: '🛰️', name: 'Ruby Satellite', desc: 'Rapid Pulse' },
        planet: { cost: 400, range: 250, damage: 45, rate: 60, color: '#38bdf8', icon: '🪐', name: 'Diamond Planet', desc: 'Heavy Beam' },
        blackhole: { cost: 800, range: 180, damage: 5, rate: 5, color: '#a855f7', icon: '🌀', name: 'Singularity', desc: 'Area Pull' }
    }
};

type TowerType = 'satellite' | 'planet' | 'blackhole';

class Enemy {
    x: number;
    y: number;
    pathIndex: number;
    speed: number;
    maxHp: number;
    hp: number;
    radius: number;
    reward: number;

    constructor(waveNum: number) {
        this.x = config.path[0].x;
        this.y = config.path[0].y;
        this.pathIndex = 0;
        this.speed = 1.2 + (waveNum * 0.1);
        this.maxHp = 50 + (waveNum * 25);
        this.hp = this.maxHp;
        this.radius = 12;
        this.reward = 25 + waveNum;
    }

    draw(ctx: CanvasRenderingContext2D, frames: number) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(frames * 0.05);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(this.radius, 0);
        ctx.lineTo(0, this.radius);
        ctx.lineTo(-this.radius, 0);
        ctx.closePath();
        ctx.stroke();
        
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-15, -20, 30, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-15, -20, (this.hp / this.maxHp) * 30, 4);
        ctx.restore();
    }

    update() {
        const target = config.path[this.pathIndex + 1];
        if (!target) return true; // Finished path

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < this.speed) {
            this.pathIndex++;
            if (this.pathIndex >= config.path.length - 1) return true;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        return false;
    }
}

class Projectile {
    x: number;
    y: number;
    target: Enemy;
    type: TowerType;
    props: any;
    speed: number;
    dead: boolean;

    constructor(x: number, y: number, target: Enemy, type: TowerType) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.type = type;
        this.props = config.types[type];
        this.speed = 7;
        this.dead = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.props.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.props.color;
        ctx.fill();
    }

    update() {
        if (this.target.hp <= 0) { this.dead = true; return; }
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < this.speed) {
            this.target.hp -= this.props.damage;
            this.dead = true;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }
}

class Tower {
    x: number;
    y: number;
    type: TowerType;
    props: any;
    cooldown: number;
    target: Enemy | null;

    constructor(x: number, y: number, type: TowerType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.props = config.types[type];
        this.cooldown = 0;
        this.target = null;
    }

    draw(ctx: CanvasRenderingContext2D, isSelected: boolean) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.props.color;
        
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.props.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.props.icon, this.x, this.y);

        if (isSelected) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.arc(this.x, this.y, this.props.range, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.stroke();
        }
        ctx.restore();
    }

    getDist(obj: {x: number, y: number}) {
        return Math.sqrt((this.x - obj.x)**2 + (this.y - obj.y)**2);
    }

    update(state: GameState) {
        if (this.cooldown > 0) this.cooldown--;

        if (!this.target || this.getDist(this.target) > this.props.range || this.target.hp <= 0) {
            this.target = null;
            for (let e of state.enemies) {
                if (this.getDist(e) <= this.props.range) {
                    this.target = e;
                    break;
                }
            }
        }

        if (this.target && this.cooldown <= 0) {
            state.projectiles.push(new Projectile(this.x, this.y, this.target, this.type));
            this.cooldown = this.props.rate;
        }
    }
}

interface GameState {
    credits: number;
    integrity: number;
    wave: number;
    isPaused: boolean;
    waveInProgress: boolean;
    towers: Tower[];
    enemies: Enemy[];
    projectiles: Projectile[];
    frames: number;
}

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef<GameState>({
        credits: 500,
        integrity: 100,
        wave: 0,
        isPaused: false,
        waveInProgress: false,
        towers: [],
        enemies: [],
        projectiles: [],
        frames: 0
    });

    const [uiState, setUiState] = useState({
        credits: 500,
        integrity: 100,
        wave: 0,
        isPaused: false,
        gameOver: false
    });

    const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);

    // Sync UI state every so often
    const syncUI = useCallback(() => {
        setUiState({
            credits: stateRef.current.credits,
            integrity: stateRef.current.integrity,
            wave: stateRef.current.wave,
            isPaused: stateRef.current.isPaused,
            gameOver: stateRef.current.integrity <= 0
        });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const rect = canvasRef.current.parentElement?.getBoundingClientRect();
                if (rect) {
                    canvasRef.current.width = rect.width;
                    canvasRef.current.height = rect.height;
                }
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let animationId: number;

        const draw = () => {
            const state = stateRef.current;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            if (state.isPaused || state.integrity <= 0) {
                animationId = requestAnimationFrame(draw);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw Path
            ctx.beginPath();
            ctx.moveTo(config.path[0].x, config.path[0].y);
            for (let p of config.path) ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
            ctx.lineWidth = 40;
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Update & Draw Towers
            for (let t of state.towers) {
                t.update(state);
                t.draw(ctx, selectedTower === t.type); // Simplification: highlight range for matching types
            }

            // Update & Draw Enemies
            let changedUI = false;
            for (let i = state.enemies.length - 1; i >= 0; i--) {
                const e = state.enemies[i];
                const finished = e.update();
                if (finished) {
                    state.integrity -= 5;
                    state.enemies.splice(i, 1);
                    changedUI = true;
                } else if (e.hp <= 0) {
                    state.credits += e.reward;
                    state.enemies.splice(i, 1);
                    changedUI = true;
                } else {
                    e.draw(ctx, state.frames);
                }
            }

            // Update & Draw Projectiles
            for (let i = state.projectiles.length - 1; i >= 0; i--) {
                const p = state.projectiles[i];
                p.update();
                if (p.dead) state.projectiles.splice(i, 1);
                else p.draw(ctx);
            }

            // Check wave end
            if (state.waveInProgress && state.enemies.length === 0) {
                state.waveInProgress = false;
                changedUI = true;
            }

            if (changedUI) syncUI();

            state.frames++;
            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animationId);
    }, [selectedTower, syncUI]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!selectedTower) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const towerInfo = config.types[selectedTower];
        if (stateRef.current.credits >= towerInfo.cost) {
            stateRef.current.towers.push(new Tower(x, y, selectedTower));
            stateRef.current.credits -= towerInfo.cost;
            syncUI();
        }
    };

    const startWave = () => {
        if (stateRef.current.waveInProgress) return;
        stateRef.current.wave++;
        stateRef.current.waveInProgress = true;
        let spawned = 0;
        const count = 5 + stateRef.current.wave * 2;
        
        const interval = setInterval(() => {
            if (stateRef.current.isPaused) return;
            stateRef.current.enemies.push(new Enemy(stateRef.current.wave));
            spawned++;
            if (spawned >= count) clearInterval(interval);
        }, 800);
        syncUI();
    };

    const togglePause = () => {
        stateRef.current.isPaused = !stateRef.current.isPaused;
        syncUI();
    };

    const resetGame = () => {
        stateRef.current = {
            credits: 500,
            integrity: 100,
            wave: 0,
            isPaused: false,
            waveInProgress: false,
            towers: [],
            enemies: [],
            projectiles: [],
            frames: 0
        };
        syncUI();
    };

    return (
        <>
            <header className="p-4 ui-panel flex justify-between items-center z-20">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-sky-400">GEMINI VANGUARD</h1>
                        <p className="text-[10px] code-font text-slate-500 uppercase">Sector: Matrix-Zero</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700"></div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Credits</p>
                            <p className="text-lg font-bold text-emerald-400">{uiState.credits}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Integrity</p>
                            <p className={`text-lg font-bold ${uiState.integrity <= 25 ? 'low-integrity text-red-500' : ''}`}>{uiState.integrity}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Wave</p>
                            <p className="text-lg font-bold text-purple-400">{uiState.wave}/20</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={togglePause} className="px-4 py-2 bg-slate-800 rounded text-xs font-bold hover:bg-slate-700">
                        {uiState.isPaused ? 'RESUME' : 'PAUSE'}
                    </button>
                    <button onClick={startWave} className="px-4 py-2 bg-sky-600 rounded text-xs font-bold hover:bg-sky-500 shadow-lg shadow-sky-900/20">
                        START WAVE
                    </button>
                </div>
            </header>

            <div className="flex-1 flex relative overflow-hidden">
                <canvas 
                    ref={canvasRef} 
                    id="game-canvas" 
                    className="flex-1"
                    onClick={handleCanvasClick}
                />

                <aside className="w-72 ui-panel p-6 flex flex-col gap-6 z-20">
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Defense Structures</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {(Object.keys(config.types) as Array<TowerType>).map((type) => {
                                const info = config.types[type];
                                return (
                                    <button 
                                        key={type}
                                        onClick={() => setSelectedTower(type)} 
                                        className={`tower-btn p-3 rounded-xl bg-slate-900/50 border flex items-center gap-4 text-left ${selectedTower === type ? 'selected border-sky-400' : 'border-slate-700'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-opacity-30 border flex items-center justify-center`} style={{ borderColor: info.color, color: info.color, backgroundColor: `${info.color}33` }}>
                                            {info.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{info.name}</p>
                                            <p className="text-[10px] text-slate-400">{info.cost}cr | {info.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-auto p-4 bg-slate-900/80 rounded-lg border border-slate-700">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2">AI Tactical Support</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span>Ella Shielding:</span>
                                <span className="text-cyan-400 font-bold">ACTIVE</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span>Trinity Vision:</span>
                                <span className="text-pink-400 font-bold">LOCKED</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span>MAI Logistics:</span>
                                <span className="text-amber-400 font-bold">+10% CR</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {uiState.gameOver && (
                <div id="game-over" className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="text-center p-12 bg-slate-900 border-2 border-red-500 rounded-3xl max-w-sm">
                        <h2 className="text-4xl font-black text-red-500 mb-4 tracking-tighter">ENTROPY WINS</h2>
                        <p className="text-slate-400 mb-8">The Red Queen has corrupted the Gemini Core.</p>
                        <button onClick={resetGame} className="w-full py-4 bg-red-600 rounded-xl font-bold hover:bg-red-500 transition-colors">REBOOT CORE</button>
                    </div>
                </div>
            )}
        </>
    );
}
