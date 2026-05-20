const GEM_TYPES = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

function randomGem() {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
}

export function createInitialGrid(rows = 8, cols = 8) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      let gem;
      do {
        gem = randomGem();
      } while (
        (c >= 2 && grid[r][c - 1] === gem && grid[r][c - 2] === gem) ||
        (r >= 2 && grid[r - 1][c] === gem && grid[r - 2][c] === gem)
      );
      grid[r][c] = gem;
    }
  }
  return grid;
}

export function canSwap(r1, c1, r2, c2) {
  const rowDiff = Math.abs(r1 - r2);
  const colDiff = Math.abs(c1 - c2);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function swapGems(grid, r1, c1, r2, c2) {
  const tmp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = tmp;
  return grid;
}

export function findMatches(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const matched = new Set();

  for (let r = 0; r < rows; r++) {
    let runStart = 0;
    for (let c = 1; c <= cols; c++) {
      if (c < cols && grid[r][c] && grid[r][c] === grid[r][c - 1]) continue;
      const runLength = c - runStart;
      if (runLength >= 3) {
        for (let k = runStart; k < c; k++) matched.add(`${r},${k}`);
      }
      runStart = c;
    }
  }

  for (let c = 0; c < cols; c++) {
    let runStart = 0;
    for (let r = 1; r <= rows; r++) {
      if (r < rows && grid[r][c] && grid[r][c] === grid[r - 1][c]) continue;
      const runLength = r - runStart;
      if (runLength >= 3) {
        for (let k = runStart; k < r; k++) matched.add(`${k},${c}`);
      }
      runStart = r;
    }
  }

  return Array.from(matched).map((entry) => {
    const [r, c] = entry.split(',').map(Number);
    return { r, c };
  });
}

export function applyGravity(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let c = 0; c < cols; c++) {
    const nonNull = [];
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r][c] !== null) nonNull.push(grid[r][c]);
    }
    for (let r = rows - 1; r >= 0; r--) {
      grid[r][c] = nonNull.length > 0 ? nonNull.shift() : randomGem();
    }
  }

  return grid;
}
