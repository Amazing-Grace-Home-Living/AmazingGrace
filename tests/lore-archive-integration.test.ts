import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Lore Archive integration', () => {
  it('ships a dedicated Lore Archive page with required scripts', () => {
    const html = fs.readFileSync('arcade/lore-archive/lore-archive.html', 'utf8');

    expect(html).toContain('id="la-root"');
    expect(html).toContain('id="la-files"');
    expect(html).toContain('id="syndicate-ai"');
    expect(html).toContain('../js/rebellion-core.js');
    expect(html).toContain('../js/lore-files.js');
    expect(html).toContain('../js/lore-archive.js');
  });

  it('uses styled locked/decrypt file states for lore entries', () => {
    const css = fs.readFileSync('arcade/lore-archive/lore-archive.css', 'utf8');

    expect(css).toContain('#la-root');
    expect(css).toContain('#la-files');
    expect(css).toContain('.la-file');
    expect(css).toContain('.la-locked');
    expect(css).toContain('.la-content');
    expect(css).toContain('.la-decrypt');
  });

  it('defines JSON-driven lore files with star, threat, and inventory unlock conditions', () => {
    const loreFiles = fs.readFileSync('arcade/js/lore-files.js', 'utf8');

    expect(loreFiles).toContain('const LORE_FILES = [');
    expect(loreFiles).toContain('starMatrix: 1');
    expect(loreFiles).toContain('lookingGlass: 2');
    expect(loreFiles).toContain('quantumShift: 2');
    expect(loreFiles).toContain('syndicateSiege: 1');
    expect(loreFiles).toContain('threatBelow: 40');
    expect(loreFiles).toContain('items: { quantumCore: 1 }');
    expect(loreFiles).toContain('items: { rebellionKey: 1 }');
  });

  it('loads core state and checks unlock requirements in lore archive logic', () => {
    const script = fs.readFileSync('arcade/js/lore-archive.js', 'utf8');

    expect(script).toContain('loadRebellionState()');
    expect(script).toContain('function checkLoreUnlock');
    expect(script).toContain('requirements.stars');
    expect(script).toContain('requirements.items');
    expect(script).toContain('requirements.threatBelow');
    expect(script).toContain('renderLoreArchive()');
  });

  it('includes lore archive route in Vite build inputs', () => {
    const config = fs.readFileSync('vite.config.ts', 'utf8');

    expect(config).toContain('arcadeLoreArchive');
    expect(config).toContain('arcade/lore-archive/lore-archive.html');
  });
});
