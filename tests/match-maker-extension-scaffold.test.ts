import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('arcade replacement route cleanup', () => {
  it('keeps legacy match-maker routes removed and no longer advertises removed arcade cards', () => {
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');

    expect(arcade).not.toContain('href="./trinity/"');
    expect(arcade).not.toContain('Trinity Match');
    expect(arcade).not.toContain('href="./quick-click/"');
    expect(arcade).not.toContain('Quick Click');
    expect(arcade).not.toContain("launchGame('matchmaker')");
    expect(arcade).not.toContain('nexus-match-maker.zip');
  });

  it('removes the old match-maker html routes and uses the Trinity Vite input', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');

    expect(viteConfig).toContain('arcade/trinity/index.html');
    expect(viteConfig).not.toContain('arcade/match-maker/index.html');
    expect(fs.existsSync('arcade/match-maker/index.html')).toBe(false);
    expect(fs.existsSync('match-maker/index.html')).toBe(false);
  });

  it('removes duplicate/dead listings CTA rows from the arcade hub', () => {
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');

    expect(arcade).not.toContain('class="portal-bar"');
    expect(arcade).not.toContain('id="property-listings"');
    expect(arcade).not.toContain('href="../#properties" class="nav-btn"');
  });
});
