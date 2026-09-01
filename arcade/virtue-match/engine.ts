// ─── Virtue Match Pure Engine ────────────────────────────────────────────────
// Exported for testing; no React or browser dependencies.

export const BOARD_SIZE = 8;

export const GEM_IDS = [
    'knowledge', 'faith', 'truth', 'compassion', 'courage', 'creativity', 'integrity',
] as const;

export type GemId = typeof GEM_IDS[number];
export type Board = string[][];

export const randomGem = (): string =>
    GEM_IDS[Math.floor(Math.random() * GEM_IDS.length)];

export const generateBoard = (): Board => {
    const board: Board = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        board.push([]);
        for (let c = 0; c < BOARD_SIZE; c++) {
            let gem: string;
            do {
                gem = randomGem();
            } while (
                (c >= 2 && board[r][c - 1] === gem && board[r][c - 2] === gem) ||
                (r >= 2 && board[r - 1][c] === gem && board[r - 2][c] === gem)
            );
            board[r].push(gem);
        }
    }
    return board;
};

export const findMatches = (board: Board): Set<string> => {
    const matched = new Set<string>();
    // Horizontal
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE - 2; c++) {
            const g = board[r][c];
            if (!g || g !== board[r][c + 1] || g !== board[r][c + 2]) continue;
            let end = c + 2;
            while (end + 1 < BOARD_SIZE && board[r][end + 1] === g) end++;
            for (let i = c; i <= end; i++) matched.add(`${r},${i}`);
            c = end;
        }
    }
    // Vertical
    for (let c = 0; c < BOARD_SIZE; c++) {
        for (let r = 0; r < BOARD_SIZE - 2; r++) {
            const g = board[r][c];
            if (!g || g !== board[r + 1][c] || g !== board[r + 2][c]) continue;
            let end = r + 2;
            while (end + 1 < BOARD_SIZE && board[end + 1][c] === g) end++;
            for (let i = r; i <= end; i++) matched.add(`${i},${c}`);
            r = end;
        }
    }
    return matched;
};

export const removeMatches = (board: Board, matches: Set<string>): Board => {
    const next = board.map(row => [...row]);
    matches.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        next[r][c] = '';
    });
    return next;
};

export const applyGravity = (board: Board): Board => {
    const next = board.map(row => [...row]);
    for (let c = 0; c < BOARD_SIZE; c++) {
        const gems = next.map(row => row[c]).filter(g => g !== '');
        const empty = BOARD_SIZE - gems.length;
        for (let r = 0; r < BOARD_SIZE; r++) {
            next[r][c] = r < empty ? '' : gems[r - empty];
        }
    }
    return next;
};

export const refillBoard = (board: Board): Board => {
    const next = board.map(row => [...row]);
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (!next[r][c]) next[r][c] = randomGem();
        }
    }
    return next;
};

export const swapGems = (board: Board, r1: number, c1: number, r2: number, c2: number): Board => {
    const next = board.map(row => [...row]);
    [next[r1][c1], next[r2][c2]] = [next[r2][c2], next[r1][c1]];
    return next;
};

export const isAdjacent = (r1: number, c1: number, r2: number, c2: number): boolean =>
    (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
