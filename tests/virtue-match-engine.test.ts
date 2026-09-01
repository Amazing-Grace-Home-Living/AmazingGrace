import { describe, it, expect } from 'vitest';
import {
    BOARD_SIZE,
    findMatches,
    removeMatches,
    applyGravity,
    swapGems,
    isAdjacent,
    generateBoard,
    refillBoard,
    GEM_IDS,
} from '../arcade/virtue-match/engine';

const GEM = GEM_IDS[0]; // 'knowledge'
const OTHER = GEM_IDS[1]; // 'faith'

function emptyBoard(): string[][] {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));
}

describe('virtue-match engine', () => {
    describe('generateBoard', () => {
        it('creates an 8×8 board', () => {
            const board = generateBoard();
            expect(board).toHaveLength(BOARD_SIZE);
            board.forEach(row => {
                expect(row).toHaveLength(BOARD_SIZE);
            });
        });

        it('fills every cell with a valid gem id', () => {
            const board = generateBoard();
            board.forEach(row =>
                row.forEach(cell => expect(GEM_IDS).toContain(cell as typeof GEM_IDS[number]))
            );
        });

        it('generates a board with no pre-existing 3-in-a-row matches', () => {
            const board = generateBoard();
            const matches = findMatches(board);
            expect(matches.size).toBe(0);
        });
    });

    describe('findMatches', () => {
        it('returns empty set when no matches', () => {
            const board = generateBoard();
            // generateBoard guarantees no initial matches
            expect(findMatches(board).size).toBe(0);
        });

        it('detects a horizontal match of 3', () => {
            const board = emptyBoard();
            board[0][0] = GEM;
            board[0][1] = GEM;
            board[0][2] = GEM;
            board[0][3] = OTHER;

            const matches = findMatches(board);
            expect(matches.has('0,0')).toBe(true);
            expect(matches.has('0,1')).toBe(true);
            expect(matches.has('0,2')).toBe(true);
            expect(matches.has('0,3')).toBe(false);
        });

        it('detects a horizontal match of 4', () => {
            const board = emptyBoard();
            board[2][1] = GEM;
            board[2][2] = GEM;
            board[2][3] = GEM;
            board[2][4] = GEM;

            const matches = findMatches(board);
            for (let c = 1; c <= 4; c++) expect(matches.has(`2,${c}`)).toBe(true);
            expect(matches.size).toBe(4);
        });

        it('detects a vertical match of 3', () => {
            const board = emptyBoard();
            board[0][3] = GEM;
            board[1][3] = GEM;
            board[2][3] = GEM;

            const matches = findMatches(board);
            expect(matches.has('0,3')).toBe(true);
            expect(matches.has('1,3')).toBe(true);
            expect(matches.has('2,3')).toBe(true);
        });

        it('handles overlapping horizontal and vertical matches', () => {
            const board = emptyBoard();
            // Horizontal: row 2, cols 1-3
            board[2][1] = GEM; board[2][2] = GEM; board[2][3] = GEM;
            // Vertical: col 2, rows 0-2
            board[0][2] = GEM; board[1][2] = GEM; // board[2][2] already set

            const matches = findMatches(board);
            // All 5 cells should be included (board[2][2] counted once)
            expect(matches.has('2,1')).toBe(true);
            expect(matches.has('2,2')).toBe(true);
            expect(matches.has('2,3')).toBe(true);
            expect(matches.has('0,2')).toBe(true);
            expect(matches.has('1,2')).toBe(true);
        });
    });

    describe('removeMatches', () => {
        it('clears matched cells to empty string', () => {
            const board = emptyBoard();
            board[0][0] = GEM; board[0][1] = GEM; board[0][2] = GEM;
            const matches = findMatches(board);
            const next = removeMatches(board, matches);
            expect(next[0][0]).toBe('');
            expect(next[0][1]).toBe('');
            expect(next[0][2]).toBe('');
        });

        it('does not mutate the original board', () => {
            const board = emptyBoard();
            board[0][0] = GEM; board[0][1] = GEM; board[0][2] = GEM;
            const matches = findMatches(board);
            removeMatches(board, matches);
            expect(board[0][0]).toBe(GEM);
        });

        it('leaves unmatched cells intact', () => {
            const board = emptyBoard();
            board[0][0] = GEM; board[0][1] = GEM; board[0][2] = GEM;
            board[5][5] = OTHER;
            const matches = findMatches(board);
            const next = removeMatches(board, matches);
            expect(next[5][5]).toBe(OTHER);
        });
    });

    describe('applyGravity', () => {
        it('drops gems to the bottom of each column', () => {
            const board = emptyBoard();
            board[0][0] = GEM; // gem at top; rows 1-7 are empty
            const next = applyGravity(board);
            expect(next[BOARD_SIZE - 1][0]).toBe(GEM);
            for (let r = 0; r < BOARD_SIZE - 1; r++) {
                expect(next[r][0]).toBe('');
            }
        });

        it('preserves relative order of gems in a column', () => {
            const board = emptyBoard();
            board[0][0] = GEM;
            board[2][0] = OTHER;
            const next = applyGravity(board);
            expect(next[BOARD_SIZE - 2][0]).toBe(GEM);
            expect(next[BOARD_SIZE - 1][0]).toBe(OTHER);
        });

        it('does not move gems that are already at the bottom', () => {
            const board = emptyBoard();
            board[BOARD_SIZE - 1][4] = GEM;
            const next = applyGravity(board);
            expect(next[BOARD_SIZE - 1][4]).toBe(GEM);
        });
    });

    describe('swapGems', () => {
        it('swaps two adjacent cells', () => {
            const board = emptyBoard();
            board[0][0] = GEM;
            board[0][1] = OTHER;
            const next = swapGems(board, 0, 0, 0, 1);
            expect(next[0][0]).toBe(OTHER);
            expect(next[0][1]).toBe(GEM);
        });

        it('does not mutate the original board', () => {
            const board = emptyBoard();
            board[0][0] = GEM;
            board[0][1] = OTHER;
            swapGems(board, 0, 0, 0, 1);
            expect(board[0][0]).toBe(GEM);
            expect(board[0][1]).toBe(OTHER);
        });
    });

    describe('isAdjacent', () => {
        it('returns true for horizontal neighbour', () => {
            expect(isAdjacent(3, 3, 3, 4)).toBe(true);
            expect(isAdjacent(3, 4, 3, 3)).toBe(true);
        });

        it('returns true for vertical neighbour', () => {
            expect(isAdjacent(3, 3, 4, 3)).toBe(true);
            expect(isAdjacent(4, 3, 3, 3)).toBe(true);
        });

        it('returns false for diagonal', () => {
            expect(isAdjacent(3, 3, 4, 4)).toBe(false);
        });

        it('returns false for same cell', () => {
            expect(isAdjacent(3, 3, 3, 3)).toBe(false);
        });

        it('returns false for cells two apart', () => {
            expect(isAdjacent(3, 3, 3, 5)).toBe(false);
            expect(isAdjacent(3, 3, 5, 3)).toBe(false);
        });
    });

    describe('refillBoard', () => {
        it('fills empty cells with valid gem ids', () => {
            const board = emptyBoard();
            const filled = refillBoard(board);
            filled.forEach(row =>
                row.forEach(cell => expect(GEM_IDS).toContain(cell as typeof GEM_IDS[number]))
            );
        });

        it('does not overwrite existing gems', () => {
            const board = emptyBoard();
            board[3][3] = GEM;
            const filled = refillBoard(board);
            expect(filled[3][3]).toBe(GEM);
        });
    });
});
