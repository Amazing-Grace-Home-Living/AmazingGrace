import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Matrix of Conscience Terminal', () => {
  it('provides a terminal-based interface for the Matrix simulation', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('Trinity Terminal');
    expect(html).toContain('Matrix of Conscience');
    expect(html).toContain('TRINITY_PS_SESSION');
    expect(html).toContain('PS C:\\Trinity>');
  });

  it('includes command handling for Start, Oracle, and Generate', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('Commands: Start, Oracle');
    expect(html).toContain('&lt;query&gt;');
    expect(html).toContain("if (lower === 'start')");
    expect(html).toContain("const ORACLE_CMD = 'oracle'");
    expect(html).toContain("const GENERATE_CMD = 'generate'");
    expect(html).toContain("lower.startsWith(ORACLE_CMD)");
    expect(html).toContain("lower.startsWith(GENERATE_CMD)");
    expect(html).toContain('The answer to');
    expect(html).toContain('rendered successfully');
  });

  it('uses named constants for improved code clarity', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('const QUANTUM_RENDER_DELAY_MS = 2000');
    expect(html).toContain('QUANTUM_RENDER_DELAY_MS');
    expect(html).toContain('let gridState =');
    expect(html).toContain('symbols[gridState[i]]');
  });

  it('includes a 4x4 grid game display', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('grid-template-columns: repeat(4, 1fr)');
    expect(html).toContain('const GRID_SIZE = 16');
    expect(html).toContain('const SYMBOL_COUNT = 4');
    expect(html).toContain("Array.from({ length: GRID_SIZE }");
    expect(html).toContain('.game-grid');
    expect(html).toContain('.game-tile');
  });

  it('supports switching between terminal and game views', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain("isGameMode");
    expect(html).toContain("gameView.classList.add('active')");
    expect(html).toContain("gameView.classList.remove('active')");
    expect(html).toContain('KILL_TASK');
    expect(html).toContain('exitGame');
  });

  it('integrates Resistance Terminal unlock messaging for Lore Archive', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('id="terminalUnlocks"');
    expect(html).toContain('renderResistanceUnlocks');
    expect(html).toContain('Lore Archive Unlocked');
    expect(html).toContain('../lore-archive/lore-archive.html');
    expect(html).toContain('Lore Archive: Requires ★★ in Star Matrix, Looking Glass, and Quantum Shift');
  });

  it('includes terminal-style command input and history', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('terminal-container');
    expect(html).toContain('terminal-header');
    expect(html).toContain('terminal-content');
    expect(html).toContain('terminal-input');
    expect(html).toContain("id=\"commandInput\"");
    expect(html).toContain("id=\"sendBtn\"");
  });

  it('is included in the vite.config.ts build', () => {
    const config = fs.readFileSync('vite.config.ts', 'utf8');

    expect(config).toContain('arcadeMatrixTerminal');
    expect(config).toContain('arcade/matrix-of-conscience-terminal/index.html');
  });
});
