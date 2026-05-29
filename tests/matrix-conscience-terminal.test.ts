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
    expect(html).toContain("if (lower === 'start')");
    expect(html).toContain("if (lower.startsWith('oracle'))");
    expect(html).toContain("if (lower.startsWith('generate'))");
  });

  it('includes a 4x4 grid game display', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience-terminal/index.html', 'utf8');

    expect(html).toContain('grid-template-columns: repeat(4, 1fr)');
    expect(html).toContain("Array(16).fill(0)");
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
