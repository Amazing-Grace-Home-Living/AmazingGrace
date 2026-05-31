import { db } from '../../js/firebase.js';

// --- State Management ---
const META_KEY = 'aghl_td_meta';
let metaState = JSON.parse(localStorage.getItem(META_KEY)) || {
    fragments: 0,
    upgrades: { integrity: 0, economy: 0, damage: 0 },
    playerName: ''
};

function saveMeta() {
    localStorage.setItem(META_KEY, JSON.stringify(metaState));
}

let currentFaction = 'netrunners';
let globalRank = null; // 1 = 1st, 2 = 2nd, null = other
let discountMultiplier = 1; // 1 = full price, 0.25 = 75% off, 0.5 = 50% off

// --- UI Navigation ---
const screens = {
    menu: document.getElementById('menu-screen'),
    store: document.getElementById('store-screen'),
    leaderboard: document.getElementById('leaderboard-screen'),
    game: document.getElementById('game-screen')
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[name].classList.remove('hidden');
}

document.getElementById('btn-store').addEventListener('click', () => {
    updateStoreUI();
    showScreen('store');
});
document.getElementById('btn-leaderboard').addEventListener('click', () => {
    loadLeaderboard();
    showScreen('leaderboard');
});
document.querySelectorAll('.back-to-menu').forEach(btn => {
    btn.addEventListener('click', () => showScreen('menu'));
});

// Faction Selection
document.querySelectorAll('.faction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.faction-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentFaction = btn.dataset.faction;
    });
});

// --- High Scores & Discounts ---
async function loadLeaderboard() {
    const list = document.getElementById('lb-list');
    list.innerHTML = 'Fetching from Nexus Data Nodes...';
    try {
        const snapshot = await db.ref('tower_defense/highscores').get();
        if (snapshot.exists()) {
            const data = snapshot.val();
            let scores = [];
            Object.keys(data).forEach(key => {
                scores.push({ name: key, ...data[key] });
            });
            scores.sort((a, b) => b.score - a.score); // Highest first

            // Check our rank
            globalRank = null;
            if (metaState.playerName) {
                const myIndex = scores.findIndex(s => s.name === metaState.playerName);
                if (myIndex === 0) globalRank = 1;
                else if (myIndex === 1) globalRank = 2;
            }

            // Apply Discount Logic
            if (globalRank === 1) discountMultiplier = 0.25; // 75% off
            else if (globalRank === 2) discountMultiplier = 0.5; // 50% off
            else discountMultiplier = 1;

            list.innerHTML = scores.slice(0, 10).map((s, i) => 
                `<div class="lb-entry"><span>#${i+1} ${s.name}</span> <span>Wave: ${s.wave} | Score: ${s.score}</span></div>`
            ).join('');
        } else {
            list.innerHTML = 'No records found.';
        }
    } catch (e) {
        list.innerHTML = 'Error fetching rankings.';
        console.error(e);
    }
}

// Check rank silently on load to apply store discounts immediately
loadLeaderboard();

// --- Store Logic ---
const STORE_COSTS = {
    integrity: 100,
    economy: 150,
    damage: 200
};

function updateStoreUI() {
    document.getElementById('store-fragments').innerText = metaState.fragments;
    
    const banner = document.getElementById('discount-banner');
    if (globalRank === 1) {
        banner.innerText = "RANK #1 GLOBAL BONUS: 75% STORE DISCOUNT ACTIVE";
        banner.classList.remove('hidden');
    } else if (globalRank === 2) {
        banner.innerText = "RANK #2 GLOBAL BONUS: 50% STORE DISCOUNT ACTIVE";
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }

    document.querySelectorAll('.store-item').forEach(item => {
        const type = item.dataset.upgrade;
        const level = metaState.upgrades[type];
        const baseCost = STORE_COSTS[type] * (level + 1);
        const finalCost = Math.floor(baseCost * discountMultiplier);
        
        item.querySelector('.lvl').innerText = level;
        item.querySelector('.cost').innerText = finalCost;
        
        const btn = item.querySelector('.btn-buy');
        if (metaState.fragments >= finalCost) {
            btn.style.opacity = 1;
            btn.onclick = () => {
                metaState.fragments -= finalCost;
                metaState.upgrades[type]++;
                saveMeta();
                updateStoreUI();
            };
        } else {
            btn.style.opacity = 0.5;
            btn.onclick = null;
        }
    });
}


// --- GAMEPLAY ENGINE ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 40;
const COLS = canvas.width / CELL_SIZE;
const ROWS = canvas.height / CELL_SIZE;

// Simple S-shape path
const path = [
    {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1}, {x: 8, y: 1},
    {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5},
    {x: 7, y: 5}, {x: 6, y: 5}, {x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5}, {x: 2, y: 5}, {x: 1, y: 5},
    {x: 1, y: 6}, {x: 1, y: 7}, {x: 1, y: 8},
    {x: 2, y: 8}, {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8}, {x: 6, y: 8}, {x: 7, y: 8}, {x: 8, y: 8}, {x: 9, y: 8}, {x: 10, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}
];

let money = 0;
let health = 0;
let wave = 1;
let score = 0;
let enemies = [];
let towers = [];
let projectiles = [];
let gameActive = false;
let waveActive = false;
let enemiesToSpawn = 0;
let spawnTimer = 0;
let animationId = null;

const TOWER_DEFS = {
    basic:  { cost: 50,  range: 100, damage: 15, cooldown: 30, color: '#00f2ff', label: 'B' },
    rapid:  { cost: 100, range: 80,  damage: 5,  cooldown: 8,  color: '#facc15', label: 'R' },
    sniper: { cost: 150, range: 250, damage: 60, cooldown: 90, color: '#bc13fe', label: 'S' },
    emp:    { cost: 200, range: 120, damage: 2,  cooldown: 40, color: '#38bdf8', label: 'E', effect: 'slow' },
    plasma: { cost: 250, range: 150, damage: 20, cooldown: 60, color: '#fb923c', label: 'P', effect: 'splash' },
    tesla:  { cost: 300, range: 120, damage: 25, cooldown: 45, color: '#e879f9', label: 'T', effect: 'chain' }
};

let selectedTowerType = 'basic';
document.querySelectorAll('.tower-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.tower-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedTowerType = opt.dataset.type;
    });
});

document.getElementById('btn-play').addEventListener('click', () => {
    showScreen('game');
    startGame();
});

document.getElementById('btn-start').addEventListener('click', () => {
    if (!waveActive && gameActive) {
        waveActive = true;
        enemiesToSpawn = 5 + wave * 3;
        spawnTimer = 0;
    }
});

document.getElementById('btn-restart').addEventListener('click', () => {
    showScreen('menu');
});

// Calculate applied tower cost based on faction
function getTowerCost(type) {
    let cost = TOWER_DEFS[type].cost;
    if (currentFaction === 'architects') cost = Math.floor(cost * 0.9);
    return cost;
}

function updateHUD() {
    document.getElementById('stat-money').innerText = money;
    document.getElementById('stat-health').innerText = Math.max(0, health);
    document.getElementById('stat-wave').innerText = wave;
    
    // Update tower costs dynamically
    document.querySelectorAll('.tower-option').forEach(opt => {
        const type = opt.dataset.type;
        opt.querySelector('.t-cost').innerText = getTowerCost(type);
    });
}

function startGame() {
    // Apply Meta Upgrades
    let startMoney = 100 + (metaState.upgrades.economy * 20);
    let startHealth = 20 + (metaState.upgrades.integrity * 5);
    
    // Apply Faction Bonuses
    if (currentFaction === 'netrunners') startMoney += 50;
    if (currentFaction === 'guardians') startHealth += 10;

    money = startMoney;
    health = startHealth;
    wave = 1;
    score = 0;
    enemies = [];
    towers = [];
    projectiles = [];
    gameActive = true;
    waveActive = false;
    document.getElementById('overlay').classList.add('hidden');
    updateHUD();
    
    if (animationId) cancelAnimationFrame(animationId);
    loop();
}

canvas.addEventListener('click', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    
    if (path.some(p => p.x === col && p.y === row)) return;
    if (towers.some(t => t.col === col && t.row === row)) return;

    const cost = getTowerCost(selectedTowerType);
    if (money >= cost) {
        money -= cost;
        
        let damageMult = 1 + (metaState.upgrades.damage * 0.05);
        if (currentFaction === 'sentinels') damageMult += 0.10;

        const baseDef = TOWER_DEFS[selectedTowerType];
        
        towers.push({
            col, row,
            x: col * CELL_SIZE + CELL_SIZE/2,
            y: row * CELL_SIZE + CELL_SIZE/2,
            type: selectedTowerType,
            cooldownTimer: 0,
            range: baseDef.range,
            damage: Math.floor(baseDef.damage * damageMult),
            cooldown: baseDef.cooldown,
            color: baseDef.color,
            label: baseDef.label,
            effect: baseDef.effect
        });
        updateHUD();
    }
});

function spawnEnemy() {
    const hp = 20 + Math.pow(wave, 1.5) * 5;
    enemies.push({
        pathIndex: 0,
        x: path[0].x * CELL_SIZE + CELL_SIZE/2,
        y: path[0].y * CELL_SIZE + CELL_SIZE/2,
        hp, maxHp: hp,
        baseSpeed: 1.2 + wave * 0.05,
        slowTimer: 0,
        color: '#ff0040',
        id: Math.random()
    });
}

function gameOver() {
    gameActive = false;
    const fragsEarned = Math.floor(score / 10);
    metaState.fragments += fragsEarned;
    saveMeta();
    
    document.getElementById('overlay-fragments').innerText = fragsEarned;
    document.getElementById('overlay').classList.remove('hidden');

    if (!metaState.playerName) {
        document.getElementById('name-dialog').classList.remove('hidden');
    } else {
        submitHighScore(metaState.playerName);
    }
}

document.getElementById('btn-submit-score').addEventListener('click', () => {
    let name = document.getElementById('player-name-input').value.trim().toUpperCase();
    if (!name) name = 'GUEST_' + Math.floor(Math.random()*1000);
    metaState.playerName = name;
    saveMeta();
    document.getElementById('name-dialog').classList.add('hidden');
    submitHighScore(name);
});

async function submitHighScore(name) {
    try {
        await db.ref('tower_defense/highscores/' + name).update({
            wave: wave,
            score: score,
            timestamp: Date.now()
        });
        loadLeaderboard(); // refresh background stats
    } catch(e) {
        console.error("Score submit failed:", e);
    }
}

function update() {
    if (!gameActive) return;

    if (waveActive && enemiesToSpawn > 0) {
        spawnTimer++;
        if (spawnTimer >= 40 - Math.min(wave, 20)) {
            spawnEnemy();
            enemiesToSpawn--;
            spawnTimer = 0;
        }
    } else if (waveActive && enemiesToSpawn === 0 && enemies.length === 0) {
        waveActive = false;
        wave++;
        money += 50 + wave * 5;
        updateHUD();
    }

    // Move enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const targetPoint = path[e.pathIndex + 1];
        
        if (!targetPoint) {
            health--;
            enemies.splice(i, 1);
            updateHUD();
            if (health <= 0) gameOver();
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
    towers.forEach(t => {
        if (t.cooldownTimer > 0) t.cooldownTimer--;
        else if (enemies.length > 0) {
            let closest = null;
            let minDist = t.range;
            enemies.forEach(e => {
                const dist = Math.hypot(e.x - t.x, e.y - t.y);
                if (dist <= minDist) { minDist = dist; closest = e; }
            });

            if (closest) {
                projectiles.push({
                    x: t.x, y: t.y,
                    target: closest,
                    speed: 10,
                    damage: t.damage,
                    color: t.color,
                    effect: t.effect,
                    hasChained: false
                });
                t.cooldownTimer = t.cooldown;
                
                // Laser style instant visual for Sniper
                if (t.type === 'sniper') projectiles[projectiles.length-1].speed = 30;
            }
        }
    });

    // Move projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        // Target died before impact, just fly to last known coords
        if (!enemies.includes(p.target)) {
            projectiles.splice(i, 1);
            continue;
        }
        
        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= p.speed) {
            // Apply Damage and Effects
            p.target.hp -= p.damage;
            
            if (p.effect === 'slow') p.target.slowTimer = 120; // 2 seconds slow
            
            if (p.effect === 'splash') {
                enemies.forEach(e => {
                    if (e !== p.target && Math.hypot(e.x - p.target.x, e.y - p.target.y) < 60) {
                        e.hp -= p.damage * 0.5; // 50% splash damage
                        checkEnemyDeath(e);
                    }
                });
            }

            if (p.effect === 'chain' && !p.hasChained) {
                // Find next target
                let nextTarget = null;
                let minDist = 80;
                enemies.forEach(e => {
                    if (e !== p.target) {
                        const d = Math.hypot(e.x - p.target.x, e.y - p.target.y);
                        if (d < minDist) { minDist = d; nextTarget = e; }
                    }
                });
                if (nextTarget) {
                    projectiles.push({
                        x: p.target.x, y: p.target.y,
                        target: nextTarget,
                        speed: p.speed, damage: p.damage * 0.7, // reduce damage on bounce
                        color: p.color, effect: 'chain', hasChained: true
                    });
                }
            }

            checkEnemyDeath(p.target);
            projectiles.splice(i, 1);
        } else {
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;
        }
    }
}

function checkEnemyDeath(e) {
    if (e.hp <= 0 && enemies.includes(e)) {
        money += 5;
        score += 10;
        updateHUD();
        const eIdx = enemies.indexOf(e);
        if (eIdx > -1) enemies.splice(eIdx, 1);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path
    ctx.fillStyle = '#1e293b';
    path.forEach(p => {
        ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    // Draw towers
    towers.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.fillRect(t.col * CELL_SIZE + 4, t.row * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 16px Courier';
        ctx.fillText(t.label, t.x, t.y);
    });

    // Draw enemies
    enemies.forEach(e => {
        ctx.fillStyle = e.slowTimer > 0 ? '#38bdf8' : e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'red';
        ctx.fillRect(e.x - 10, e.y - 15, 20, 3);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(e.x - 10, e.y - 15, 20 * Math.max(0, e.hp / e.maxHp), 3);
    });

    // Draw projectiles
    projectiles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.effect === 'chain') {
            // Draw a line connecting for tesla instead of a dot
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + (p.target.x - p.x)*0.3, p.y + (p.target.y - p.y)*0.3);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.arc(p.x, p.y, p.effect==='splash' ? 5 : 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function loop() {
    update();
    draw();
    if (gameActive) {
        animationId = requestAnimationFrame(loop);
    }
}
