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

let money = 150;
let health = 20;
let wave = 1;
let enemies = [];
let towers = [];
let projectiles = [];
let frameCount = 0;
let gameActive = true;
let waveActive = false;
let enemiesToSpawn = 0;
let spawnTimer = 0;

const TOWER_TYPES = {
    basic: { cost: 50, range: 100, damage: 10, cooldown: 30, color: '#00f2ff' },
    sniper: { cost: 100, range: 200, damage: 40, cooldown: 90, color: '#bc13fe' },
    rapid: { cost: 150, range: 80, damage: 5, cooldown: 10, color: '#facc15' }
};

let selectedTowerType = 'basic';

document.querySelectorAll('.tower-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.tower-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedTowerType = opt.dataset.type;
    });
});

document.getElementById('btn-start').addEventListener('click', () => {
    if (!waveActive && gameActive) {
        waveActive = true;
        enemiesToSpawn = 5 + wave * 2;
        spawnTimer = 0;
    }
});

document.getElementById('btn-restart').addEventListener('click', () => {
    resetGame();
});

canvas.addEventListener('click', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    
    // Check if on path
    const isOnPath = path.some(p => p.x === col && p.y === row);
    if (isOnPath) return;

    // Check if tower exists
    const hasTower = towers.some(t => t.col === col && t.row === row);
    if (hasTower) return;

    const towerDef = TOWER_TYPES[selectedTowerType];
    if (money >= towerDef.cost) {
        money -= towerDef.cost;
        towers.push({
            col, row,
            x: col * CELL_SIZE + CELL_SIZE/2,
            y: row * CELL_SIZE + CELL_SIZE/2,
            type: selectedTowerType,
            cooldownTimer: 0,
            ...towerDef
        });
        updateHUD();
    }
});

function resetGame() {
    money = 150;
    health = 20;
    wave = 1;
    enemies = [];
    towers = [];
    projectiles = [];
    gameActive = true;
    waveActive = false;
    document.getElementById('overlay').classList.add('hidden');
    updateHUD();
}

function updateHUD() {
    document.getElementById('stat-money').innerText = money;
    document.getElementById('stat-health').innerText = Math.max(0, health);
    document.getElementById('stat-wave').innerText = wave;
}

function spawnEnemy() {
    const hp = 20 + wave * 10;
    enemies.push({
        pathIndex: 0,
        x: path[0].x * CELL_SIZE + CELL_SIZE/2,
        y: path[0].y * CELL_SIZE + CELL_SIZE/2,
        hp, maxHp: hp,
        speed: 1.5 + wave * 0.1,
        color: '#ff0040'
    });
}

function update() {
    if (!gameActive) return;

    if (waveActive && enemiesToSpawn > 0) {
        spawnTimer++;
        if (spawnTimer >= 60) {
            spawnEnemy();
            enemiesToSpawn--;
            spawnTimer = 0;
        }
    } else if (waveActive && enemiesToSpawn === 0 && enemies.length === 0) {
        waveActive = false;
        wave++;
        money += 50; // wave clear bonus
        updateHUD();
    }

    // Move enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const targetPoint = path[e.pathIndex + 1];
        if (!targetPoint) {
            // Reached end
            health--;
            enemies.splice(i, 1);
            updateHUD();
            if (health <= 0) {
                gameActive = false;
                document.getElementById('overlay').classList.remove('hidden');
            }
            continue;
        }

        const targetX = targetPoint.x * CELL_SIZE + CELL_SIZE/2;
        const targetY = targetPoint.y * CELL_SIZE + CELL_SIZE/2;
        
        const dx = targetX - e.x;
        const dy = targetY - e.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= e.speed) {
            e.x = targetX;
            e.y = targetY;
            e.pathIndex++;
        } else {
            e.x += (dx / dist) * e.speed;
            e.y += (dy / dist) * e.speed;
        }
    }

    // Towers shoot
    towers.forEach(t => {
        if (t.cooldownTimer > 0) t.cooldownTimer--;
        else if (enemies.length > 0) {
            // Find closest enemy in range
            let closest = null;
            let minDist = t.range;
            enemies.forEach(e => {
                const dist = Math.hypot(e.x - t.x, e.y - t.y);
                if (dist <= minDist) {
                    minDist = dist;
                    closest = e;
                }
            });

            if (closest) {
                projectiles.push({
                    x: t.x, y: t.y,
                    target: closest,
                    speed: 8,
                    damage: t.damage,
                    color: t.color
                });
                t.cooldownTimer = t.cooldown;
            }
        }
    });

    // Move projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!enemies.includes(p.target)) {
            projectiles.splice(i, 1);
            continue;
        }
        
        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= p.speed) {
            p.target.hp -= p.damage;
            if (p.target.hp <= 0) {
                money += 10;
                updateHUD();
                const eIdx = enemies.indexOf(p.target);
                if (eIdx > -1) enemies.splice(eIdx, 1);
            }
            projectiles.splice(i, 1);
        } else {
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;
        }
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
        ctx.font = '10px Courier';
        ctx.fillText(t.type[0].toUpperCase(), t.x, t.y);
    });

    // Draw enemies
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // HP bar
        ctx.fillStyle = 'red';
        ctx.fillRect(e.x - 10, e.y - 15, 20, 3);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(e.x - 10, e.y - 15, 20 * (e.hp / e.maxHp), 3);
    });

    // Draw projectiles
    projectiles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Initial setup
document.querySelector('[data-type="basic"]').classList.add('selected');
updateHUD();
loop();
