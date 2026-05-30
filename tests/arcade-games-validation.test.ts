import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Arcade Games Validation', () => {
  const arcadeIndexPath = resolve(__dirname, '../arcade/index.html');

  it('arcade/index.html should exist', () => {
    expect(existsSync(arcadeIndexPath)).toBe(true);
  });

  describe('Game Links from Arcade Lobby', () => {
    const arcadeHTML = readFileSync(arcadeIndexPath, 'utf-8');

    it('should have Seven Stars game (embedded)', () => {
      expect(arcadeHTML).toContain('launchGame(\'sevenstars\')');
      expect(arcadeHTML).toContain('initSevenStars');
    });

    it('should link to Star Matrix game', () => {
      expect(arcadeHTML).toContain('href="./star-matrix/"');
      const starMatrixPath = resolve(__dirname, '../arcade/star-matrix/index.html');
      expect(existsSync(starMatrixPath)).toBe(true);
    });

    it('should link to Matrix of Conscience game', () => {
      expect(arcadeHTML).toContain('href="./matrix-of-conscience/"');
      const matrixPath = resolve(__dirname, '../arcade/matrix-of-conscience/index.html');
      expect(existsSync(matrixPath)).toBe(true);
    });

    it('should link to Trinity Terminal (matrix-of-conscience-terminal)', () => {
      expect(arcadeHTML).toContain('href="./matrix-of-conscience-terminal/"');
      const terminalPath = resolve(__dirname, '../arcade/matrix-of-conscience-terminal/index.html');
      expect(existsSync(terminalPath)).toBe(true);
    });

    it('should link to Bible Study Quiz', () => {
      expect(arcadeHTML).toContain('href="./bible-study/"');
      const bibleStudyPath = resolve(__dirname, '../arcade/bible-study/index.html');
      expect(existsSync(bibleStudyPath)).toBe(true);
    });

    it('should link to Match Maker (via arcade.html redirect)', () => {
      expect(arcadeHTML).toContain('href="../arcade.html"');
      const matchMakerRedirect = resolve(__dirname, '../arcade.html');
      expect(existsSync(matchMakerRedirect)).toBe(true);
    });

    it('should link to Syndicate Siege', () => {
      expect(arcadeHTML).toContain('href="./syndicate-siege/"');
      const syndicatePath = resolve(__dirname, '../arcade/syndicate-siege/index.html');
      expect(existsSync(syndicatePath)).toBe(true);
    });
  });

  describe('Individual Game Pages', () => {
    const games = [
      { name: 'Star Matrix', path: 'arcade/star-matrix/index.html' },
      { name: 'Matrix of Conscience', path: 'arcade/matrix-of-conscience/index.html' },
      { name: 'Trinity Terminal', path: 'arcade/matrix-of-conscience-terminal/index.html' },
      { name: 'Bible Study', path: 'arcade/bible-study/index.html' },
      { name: 'Quick Click', path: 'arcade/quick-click/index.html' },
      { name: 'Trinity', path: 'arcade/trinity/index.html' },
      { name: 'Nexus Arcade', path: 'arcade/nexus-arcade/index.html' },
      { name: 'Syndicate Siege', path: 'arcade/syndicate-siege/index.html' },
      { name: 'Certificates', path: 'arcade/certificates/index.html' },
      { name: 'Matrix App', path: 'arcade/matrix-app/index.html' },
    ];

    games.forEach(game => {
      it(`${game.name} should have valid HTML structure`, () => {
        const gamePath = resolve(__dirname, '..', game.path);
        expect(existsSync(gamePath), `${game.name} file should exist at ${game.path}`).toBe(true);

        const html = readFileSync(gamePath, 'utf-8');
        // Case-insensitive DOCTYPE check (Vite may lowercase it)
        expect(html.toLowerCase()).toContain('<!doctype html>');
        expect(html).toContain('<html');
        expect(html).toContain('</html>');
        expect(html).toContain('<title>');
      });
    });
  });

  describe('Vite Config Entries', () => {
    const viteConfigPath = resolve(__dirname, '../vite.config.ts');
    const viteConfig = readFileSync(viteConfigPath, 'utf-8');

    const requiredEntries = [
      { name: 'arcade', entry: 'arcade/index.html' },
      { name: 'arcadeStarMatrix', entry: 'arcade/star-matrix/index.html' },
      { name: 'arcadeMatrix', entry: 'arcade/matrix-of-conscience/index.html' },
      { name: 'arcadeMatrixTerminal', entry: 'arcade/matrix-of-conscience-terminal/index.html' },
      { name: 'arcadeBibleStudy', entry: 'arcade/bible-study/index.html' },
      { name: 'arcadeQuickClick', entry: 'arcade/quick-click/index.html' },
      { name: 'arcadeTrinity', entry: 'arcade/trinity/index.html' },
      { name: 'arcadeNexusArcade', entry: 'arcade/nexus-arcade/index.html' },
      { name: 'arcadeSyndicateSiege', entry: 'arcade/syndicate-siege/index.html' },
      { name: 'arcadeCertificates', entry: 'arcade/certificates/index.html' },
      { name: 'matrixApp', entry: 'arcade/matrix-app/index.html' },
      { name: 'arcadeRedirect', entry: 'arcade.html' },
    ];

    requiredEntries.forEach(({ name, entry }) => {
      it(`should include ${name} entry for ${entry}`, () => {
        expect(viteConfig).toContain(`${name}:`);
        expect(viteConfig).toContain(entry);
      });
    });
  });

  describe('Match Maker Integration', () => {
    it('arcade.html redirect should exist and load Match Maker', () => {
      const redirectPath = resolve(__dirname, '../arcade.html');
      expect(existsSync(redirectPath)).toBe(true);

      const html = readFileSync(redirectPath, 'utf-8');
      expect(html).toContain('Match Maker');
      expect(html).toContain('arcade/main.js');
    });

    it('arcade/main.js should exist and initialize Match Maker', () => {
      const mainJsPath = resolve(__dirname, '../arcade/main.js');
      expect(existsSync(mainJsPath)).toBe(true);

      const mainJs = readFileSync(mainJsPath, 'utf-8');
      expect(mainJs).toContain('initMatchMakerUI');
      expect(mainJs).toContain('match-maker-ui');
    });

    it('arcade/match-maker-ui.js should exist', () => {
      const uiPath = resolve(__dirname, '../arcade/match-maker-ui.js');
      expect(existsSync(uiPath)).toBe(true);
    });
  });

  describe('Game Navigation and Back Links', () => {
    const gamesWithBackLinks = [
      { name: 'Star Matrix', path: 'arcade/star-matrix/index.html' },
      { name: 'Matrix of Conscience', path: 'arcade/matrix-of-conscience/index.html' },
      { name: 'Trinity', path: 'arcade/trinity/index.html' },
      { name: 'Syndicate Siege', path: 'arcade/syndicate-siege/index.html' },
    ];

    gamesWithBackLinks.forEach(game => {
      it(`${game.name} should have a back link to arcade`, () => {
        const gamePath = resolve(__dirname, '..', game.path);
        const html = readFileSync(gamePath, 'utf-8');

        // Check for various back link patterns
        const hasBackLink =
          html.includes('Back to Arcade') ||
          html.includes('← Arcade') ||
          html.includes('href="../"') ||
          html.includes('← Back') ||
          html.includes('Arcade Lobby');

        expect(hasBackLink, `${game.name} should have a back link`).toBe(true);
      });
    });
  });

  describe('Asset and Dependency Checks', () => {
    it('arcade/js directory should exist with shared scripts', () => {
      const jsDir = resolve(__dirname, '../arcade/js');
      expect(existsSync(jsDir)).toBe(true);
    });

    it('arcade/match-maker-ui.js should exist for Match Maker game', () => {
      const uiPath = resolve(__dirname, '../arcade/match-maker-ui.js');
      expect(existsSync(uiPath)).toBe(true);
    });
  });

  describe('Nexus Arcade React Integration', () => {
    it('nexus-arcade/index.html should load React app', () => {
      const nexusPath = resolve(__dirname, '../arcade/nexus-arcade/index.html');
      const html = readFileSync(nexusPath, 'utf-8');

      expect(html).toContain('src/arcade-main.tsx');
      expect(html).toContain('root');
    });

    it('src/arcade-main.tsx should exist', () => {
      const tsxPath = resolve(__dirname, '../src/arcade-main.tsx');
      expect(existsSync(tsxPath)).toBe(true);
    });
  });
});
