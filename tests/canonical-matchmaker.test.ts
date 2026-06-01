import { describe, it, expect } from "vitest";
import {
  GRID_SIZE,
  createInitialGrid,
  findMatches,
  applyMatches,
} from "../js/matchmaker.js";

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

describe("js/matchmaker.js (Canonical Engine)", () => {
  it("initializes a 7x7 grid", () => {
    const grid = createInitialGrid();
    expect(grid).toHaveLength(7);
    expect(grid[0]).toHaveLength(7);
    const firstCell = grid[0][0];
    if (typeof firstCell === 'object') {
      expect(firstCell).toHaveProperty('kind');
    } else {
      expect(typeof firstCell).toBe('string');
    }
  });

  it("detects horizontal match of 3", () => {
    const grid = emptyGrid();
    grid[0][0] = 'heart';
    grid[0][1] = 'heart';
    grid[0][2] = 'heart';
    grid[0][3] = 'star';
    
    const result = findMatches(grid);
    expect(result.matches).toContainEqual({ row: 0, col: 0 });
    expect(result.matches).toContainEqual({ row: 0, col: 1 });
    expect(result.matches).toContainEqual({ row: 0, col: 2 });
  });

  it("creates a lineH special for 4 in a row", () => {
    const grid = emptyGrid();
    grid[0][0] = 'heart';
    grid[0][1] = 'heart';
    grid[0][2] = 'heart';
    grid[0][3] = 'heart';

    const result = findMatches(grid);
    expect(result.specials).toContainEqual(expect.objectContaining({ specialType: 'lineH' }));
  });

  it("applies matches and clears cells", () => {
    const grid = emptyGrid();
    grid[0][0] = 'heart';
    grid[0][1] = 'heart';
    grid[0][2] = 'heart';
    
    const result = findMatches(grid);
    const next = applyMatches(grid, result);
    expect(next[0][0]).toBeNull();
    expect(next[0][1]).toBeNull();
    expect(next[0][2]).toBeNull();
  });

  it("triggers lineH special", () => {
    const grid = emptyGrid();
    grid[0][0] = { kind: 'heart', special: 'lineH' };
    grid[0][1] = 'heart';
    grid[0][2] = 'heart';
    // Add some gems to be cleared by the lineH
    grid[0][3] = 'star';
    grid[0][4] = 'star';
    
    const result = findMatches(grid);
    const next = applyMatches(grid, result);
    
    // Row 0 should be cleared
    for (let c = 0; c < 7; c++) {
      expect(next[0][c]).toBeNull();
    }
  });

  it("triggers supernova special to clear matching gems of same kind", () => {
    const grid = emptyGrid();
    // Supernova gem is heart and part of a heart match
    grid[0][0] = { kind: 'heart', special: 'supernova' };
    grid[0][1] = 'heart';
    grid[0][2] = 'heart';
    
    // Scattered heart gems across the board to be cleared
    grid[3][3] = 'heart';
    grid[5][6] = 'heart';
    
    // Other gems that should NOT be cleared
    grid[2][2] = 'star';
    grid[4][4] = 'cross';

    const result = findMatches(grid);
    const next = applyMatches(grid, result);

    // Scattered hearts should be cleared
    expect(next[3][3]).toBeNull();
    expect(next[5][6]).toBeNull();
    
    // Other types should remain intact
    expect(next[2][2]).toBe('star');
    expect(next[4][4]).toBe('cross');
  });
});
