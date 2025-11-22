const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 16; // 28x31 grid = 448x496
const ROWS = 31;
const COLS = 28;

// Tile Types
const WALL = 0;
const DOT = 1;
const EMPTY = 2;
const PACMAN = 3;
const GHOST = 4;
const PELLET = 5; // Power Pellet

// Game State
let score = 0;
let lives = 3;
let currentStage = 1;
let gameState = 'START'; // START, PLAYING, GAMEOVER, VICTORY

// Maps
const map1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], // Ghost House Gate at 13,14 (approx)
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 2, 2, 4, 4, 2, 2, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Ghosts start here
    [2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 5, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 5, 0], // Pacman starts at 23, 13 (approx)
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Stage 2: More open, fewer walls, more intersections
const map2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 0, 2, 0, 2, 2, 4, 4, 2, 2, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Stage 3: Complex maze, many dead ends
const map3 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, 0, 0, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 0, 1, 2, 2, 2, 4, 4, 2, 2, 0, 2, 2, 2, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 1, 1, 0, 0, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 0, 1, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Fill remaining rows to 31 if needed, or adjust logic. 
// Standard Pacman is 28x31. My map above is 26 rows. I'll pad it or stretch it.
// Let's just use the map as is and center it or add rows.
// Adding 5 more rows of empty/walls to make it 31.
while (map1.length < ROWS) {
    map1.push(new Array(COLS).fill(0));
}
while (map2.length < ROWS) {
    map2.push(new Array(COLS).fill(0));
}
while (map3.length < ROWS) {
    map3.push(new Array(COLS).fill(0));
}

let currentMap = [];

// Entities
let pacman = { x: 13, y: 23, dir: 0, nextDir: 0 }; // Grid coordinates
let ghosts = [];

// Input Handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    handleInput(e.code);
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function handleInput(code) {
    if (gameState === 'START' && code === 'Space') {
        startGame();
    } else if (gameState === 'GAMEOVER' && code === 'Space') {
        resetGame();
    } else if (gameState === 'VICTORY' && code === 'Space') {
        resetGame();
    }

    if (gameState === 'PLAYING') {
        if (code === 'ArrowUp') pacman.nextDir = 1;
        if (code === 'ArrowDown') pacman.nextDir = 2;
        if (code === 'ArrowLeft') pacman.nextDir = 3;
        if (code === 'ArrowRight') pacman.nextDir = 4;
    }
}

function startGame() {
    gameState = 'PLAYING';
    document.getElementById('start-screen').classList.remove('active');
    loadStage(currentStage);
    gameLoop();
}

function loadStage(stage) {
    let mapSource = map1;
    if (stage === 2) mapSource = map2;
    if (stage === 3) mapSource = map3;

    // Deep copy map
    currentMap = mapSource.map(row => [...row]);

    // Reset entities
    pacman = { x: 13, y: 23, dir: 0, nextDir: 0 };

    // Initialize ghosts
    ghosts = [
        { x: 13, y: 11, color: 'red', dir: 3, type: 'chase' },
        { x: 14, y: 11, color: 'pink', dir: 4, type: 'ambush' },
        { x: 13, y: 13, color: 'cyan', dir: 1, type: 'random' },
        { x: 14, y: 13, color: 'orange', dir: 2, type: 'random' }
    ];
}

function resetGame() {
    score = 0;
    lives = 3;
    currentStage = 1;
    updateUI();
    document.getElementById('game-over-screen').classList.remove('active');
    document.getElementById('victory-screen').classList.remove('active');
    startGame();
}

function updateUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;
    document.getElementById('stage').innerText = currentStage;
}

// Directions: 0: None, 1: Up, 2: Down, 3: Left, 4: Right
function getDxDy(dir) {
    if (dir === 1) return { dx: 0, dy: -1 };
    if (dir === 2) return { dx: 0, dy: 1 };
    if (dir === 3) return { dx: -1, dy: 0 };
    if (dir === 4) return { dx: 1, dy: 0 };
    return { dx: 0, dy: 0 };
}

function canMove(x, y, dir) {
    const { dx, dy } = getDxDy(dir);
    const nextX = x + dx;
    const nextY = y + dy;

    // Boundary checks
    if (nextX < 0 || nextX >= COLS || nextY < 0 || nextY >= ROWS) {
        // Tunnel logic could go here
        // For now, allow movement into tunnel (off-screen)
        if (nextY === 13 && (nextX < 0 || nextX >= COLS)) { // Specific tunnel row
            return true;
        }
        return false;
    }

    const tile = currentMap[nextY][nextX];
    return tile !== WALL;
}

// Power Pellet Logic
let powerModeTime = 0;
const POWER_DURATION = 600; // Frames (approx 10 sec)

// Movement variables
let moveTimer = 0;
const MOVE_INTERVAL = 10; // Frames per move (controls speed)
let ghostMoveTimer = 0;
const GHOST_MOVE_INTERVAL = 15; // Ghosts are slightly slower

function update() {
    if (gameState !== 'PLAYING') return;

    if (powerModeTime > 0) {
        powerModeTime--;
    }

    moveTimer++;
    if (moveTimer >= MOVE_INTERVAL) {
        moveTimer = 0;

        // Try to change direction if queued
        if (pacman.nextDir !== 0 && canMove(pacman.x, pacman.y, pacman.nextDir)) {
            pacman.dir = pacman.nextDir;
            pacman.nextDir = 0; // Clear queue
        }

        // Move in current direction
        if (pacman.dir !== 0 && canMove(pacman.x, pacman.y, pacman.dir)) {
            const { dx, dy } = getDxDy(pacman.dir);
            pacman.x += dx;
            pacman.y += dy;

            // Tunneling (Wrap around)
            if (pacman.x < 0) pacman.x = COLS - 1;
            else if (pacman.x >= COLS) pacman.x = 0;

            checkCollision();
        }
    }

    ghostMoveTimer++;
    // Ghosts move slower when scared
    const interval = powerModeTime > 0 ? GHOST_MOVE_INTERVAL * 1.5 : GHOST_MOVE_INTERVAL;

    if (ghostMoveTimer >= interval) {
        ghostMoveTimer = 0;
        moveGhosts();
        checkCollision();
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        if (ghost.dead) {
            // Respawn logic (simple: stay in house or return)
            // For simplicity, just respawn after a while or stay put
            // Let's just make them not move if dead for a bit, then respawn
            // Implementing full return-to-base is complex, let's just respawn them at start
            ghost.x = 13;
            ghost.y = 11;
            ghost.dead = false;
            return;
        }

        // Simple AI: Keep moving, change direction at intersections or walls
        const possibleDirs = [];

        // Check all 4 directions
        [1, 2, 3, 4].forEach(d => {
            // Don't reverse direction immediately unless stuck
            const reverseDir = ghost.dir === 1 ? 2 : ghost.dir === 2 ? 1 : ghost.dir === 3 ? 4 : 3;
            if (d !== reverseDir && canMove(ghost.x, ghost.y, d)) {
                possibleDirs.push(d);
            }
        });

        if (possibleDirs.length === 0) {
            // Dead end, must reverse
            const reverseDir = ghost.dir === 1 ? 2 : ghost.dir === 2 ? 1 : ghost.dir === 3 ? 4 : 3;
            if (canMove(ghost.x, ghost.y, reverseDir)) {
                ghost.dir = reverseDir;
            } else {
                ghost.dir = 0; // Stuck?
            }
        } else {
            // AI Decision Making
            if (ghost.type === 'chase' && powerModeTime === 0) {
                // Red Ghost: Chase Pacman (Shortest Path / Greedy Best-First)
                // Pick the direction that minimizes distance to Pacman
                let bestDir = possibleDirs[0];
                let minDistance = Infinity;

                possibleDirs.forEach(d => {
                    const { dx, dy } = getDxDy(d);
                    const nextX = ghost.x + dx;
                    const nextY = ghost.y + dy;

                    // Euclidean distance squared is sufficient for comparison
                    const dist = Math.pow(nextX - pacman.x, 2) + Math.pow(nextY - pacman.y, 2);

                    if (dist < minDistance) {
                        minDistance = dist;
                        bestDir = d;
                    }
                });
                ghost.dir = bestDir;
            } else {
                // Other Ghosts or Scared Mode: Random Movement
                // If scared, maybe prefer away from pacman? For now random is fine as per request.
                const randIndex = Math.floor(Math.random() * possibleDirs.length);
                ghost.dir = possibleDirs[randIndex];
            }
        }

        // Move
        const { dx, dy } = getDxDy(ghost.dir);
        ghost.x += dx;
        ghost.y += dy;

        // Tunneling
        if (ghost.x < 0) ghost.x = COLS - 1;
        else if (ghost.x >= COLS) ghost.x = 0;
    });
}

function checkCollision() {
    // Check Dot Collision
    const tile = currentMap[pacman.y][pacman.x];

    if (tile === DOT) {
        score += 10;
        currentMap[pacman.y][pacman.x] = EMPTY;
        updateUI();
        checkWinCondition();
    } else if (tile === PELLET) {
        score += 50;
        currentMap[pacman.y][pacman.x] = EMPTY;
        powerModeTime = POWER_DURATION;
        updateUI();
        checkWinCondition();
    }

    // Check Ghost Collision
    ghosts.forEach(ghost => {
        if (!ghost.dead && ghost.x === pacman.x && ghost.y === pacman.y) {
            if (powerModeTime > 0) {
                // Eat Ghost
                score += 200;
                ghost.dead = true;
                updateUI();
            } else {
                handleDeath();
            }
        }
    });
}

function handleDeath() {
    lives--;
    updateUI();
    if (lives <= 0) {
        gameState = 'GAMEOVER';
        document.getElementById('final-score').innerText = score;
        document.getElementById('game-over-screen').classList.add('active');
    } else {
        // Reset positions
        pacman = { x: 13, y: 23, dir: 0, nextDir: 0 };
        ghosts = [
            { x: 13, y: 11, color: 'red', dir: 3, type: 'chase', dead: false },
            { x: 14, y: 11, color: 'pink', dir: 4, type: 'ambush', dead: false },
            { x: 13, y: 13, color: 'cyan', dir: 1, type: 'random', dead: false },
            { x: 14, y: 13, color: 'orange', dir: 2, type: 'random', dead: false }
        ];
        powerModeTime = 0;
        // Optional: Pause briefly
    }
}

function checkWinCondition() {
    // Check if any dots remain
    let dotsRemaining = false;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (currentMap[r][c] === DOT || currentMap[r][c] === PELLET) {
                dotsRemaining = true;
                break;
            }
        }
    }

    if (!dotsRemaining) {
        if (currentStage < 3) {
            currentStage++;
            updateUI();
            loadStage(currentStage);
        } else {
            gameState = 'VICTORY';
            document.getElementById('victory-screen').classList.add('active');
        }
    }
}

function drawMap() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const tile = currentMap[r][c];
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;

            if (tile === WALL) {
                ctx.fillStyle = '#1919A6'; // Wall color
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                // Inner black square for "hollow" look
                ctx.fillStyle = 'black';
                ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            } else if (tile === DOT) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile === PELLET) {
                ctx.fillStyle = powerModeTime % 20 < 10 ? '#ffb8ae' : '#ff0000'; // Blink
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    const x = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const y = pacman.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    // Simple mouth animation
    const mouthOpen = moveTimer % 10 < 5 ? 0.2 : 0.05;

    // Rotate based on direction
    let startAngle = mouthOpen * Math.PI;
    let endAngle = (2 - mouthOpen) * Math.PI;

    if (pacman.dir === 3) { // Left
        startAngle += Math.PI;
        endAngle += Math.PI;
    } else if (pacman.dir === 1) { // Up
        startAngle += 1.5 * Math.PI;
        endAngle += 1.5 * Math.PI;
    } else if (pacman.dir === 2) { // Down
        startAngle += 0.5 * Math.PI;
        endAngle += 0.5 * Math.PI;
    }

    ctx.arc(x, y, TILE_SIZE / 2 - 2, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.fill();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        if (ghost.dead) return; // Don't draw if dead (or draw eyes)

        const x = ghost.x * TILE_SIZE + TILE_SIZE / 2;
        const y = ghost.y * TILE_SIZE + TILE_SIZE / 2;

        if (powerModeTime > 0) {
            // Scared color
            ctx.fillStyle = powerModeTime < 120 && powerModeTime % 20 < 10 ? 'white' : 'blue';
        } else {
            ctx.fillStyle = ghost.color;
        }

        ctx.beginPath();
        ctx.arc(x, y - 2, TILE_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(x + TILE_SIZE / 2 - 2, y + TILE_SIZE / 2 - 2);
        ctx.lineTo(x - TILE_SIZE / 2 + 2, y + TILE_SIZE / 2 - 2);
        ctx.fill();
    });
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'PLAYING') {
        drawMap();
        drawPacman();
        drawGhosts();
    }
}

function gameLoop() {
    update();
    draw();
    if (gameState === 'PLAYING') {
        requestAnimationFrame(gameLoop);
    }
}

// Initial Draw
// Need to load map to draw it initially for background
currentMap = map1.map(row => [...row]);
draw();
