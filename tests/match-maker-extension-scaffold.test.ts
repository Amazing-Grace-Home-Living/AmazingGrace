import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('arcade cleanup', () => {
  it('shows a focused arcade hub (no Match Maker card; Matrix of Conscience is active)', () => {
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');

    expect(arcade).toContain('href="./star-matrix/"');
    expect(arcade).toContain('Star Matrix');
    expect(arcade).toContain('href="./bible-study/"');
    expect(arcade).toContain('Bible Study Quiz');
    expect(arcade).toContain('Mystery of the Seven Stars');
    expect(arcade).not.toContain('Match Maker');
    expect(arcade).toContain('Matrix of Conscience');
    expect(arcade).toContain('href="./matrix-of-conscience/"');
    expect(arcade).not.toContain('href="../arcade.html"');
  });

  it('keeps arcade.html as a redirect while matrix-of-conscience is a standalone page', () => {
    const legacyArcade = fs.readFileSync('arcade.html', 'utf8');
    const legacyMatrix = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

    expect(legacyArcade).toContain('http-equiv="refresh"');
    expect(legacyArcade).toContain('url=./arcade/star-matrix/');
    expect(legacyMatrix).not.toContain('http-equiv="refresh"');
    expect(legacyMatrix).toContain('Matrix of Conscience — Duality Core');
    expect(legacyMatrix).toContain('id="btn-weave"');
  });

  it('removes duplicate/dead listings CTA rows from the arcade hub', () => {
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');

    expect(arcade).not.toContain('class="portal-bar"');
    expect(arcade).not.toContain('id="property-listings"');
    expect(arcade).not.toContain('href="../#properties" class="nav-btn"');
  });

  it('removes Match Maker scaffold assets from the repo tree', () => {
    expect(fs.existsSync('extensions/nexus-match-maker')).toBe(false);
    expect(fs.existsSync('match-maker')).toBe(false);
    expect(fs.existsSync('public/match-maker')).toBe(false);
    expect(fs.existsSync('arcade/main.js')).toBe(false);
    expect(fs.existsSync('arcade/matchMakerState.js')).toBe(false);
    expect(fs.existsSync('arcade/match-maker-ui.js')).toBe(false);
    expect(fs.existsSync('saveSystem.js')).toBe(false);
    expect(fs.existsSync('sevenStars.js')).toBe(false);
  });
});
