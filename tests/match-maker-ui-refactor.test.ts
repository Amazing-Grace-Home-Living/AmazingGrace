import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('arcade match-maker UI refactor', () => {
  it('shares move resolution between click and drag/drop flows with guarded cleanup', () => {
    expect(fs.existsSync('arcade/match-maker-ui.js')).toBe(true);
    const source = fs.readFileSync('arcade/match-maker-ui.js', 'utf8');

    expect(source).toContain('async function tryResolveMove(r1, c1, r2, c2)');
    expect(source).toContain('await tryResolveMove(r1, c1, r2, c2);');
    expect(source).toContain('await tryResolveMove(r1, c1, r, c);');
    expect(source).toContain('try {');
    expect(source).toContain('} finally {');
    expect(source).toContain('isAnimating = false;');
    expect(source).toContain('renderBoard();');
  });

  it('uses currentTarget-based drag handlers and centralized drag-state cleanup', () => {
    const source = fs.readFileSync('arcade/match-maker-ui.js', 'utf8');

    expect(source).toContain('function clearDragState()');
    expect(source).toContain('const cell = e.currentTarget;');
    expect(source).toContain('const target = e.currentTarget;');
    expect(source).not.toContain('this.dataset');
    expect(source).not.toContain('this.classList');
  });
});
