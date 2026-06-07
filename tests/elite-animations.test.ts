import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Elite Animations system', () => {
  const jsPath = 'arcade/js/elite-animations.js';
  const appPath = 'arcade/syndicate-siege/SyndicateSiegeApp.tsx';
  const cssPath = 'arcade/syndicate-siege/syndicate-siege.css';
  const configPath = 'vite.config.ts';

  it('ships elite-animations.js with all animation trigger functions', () => {
    const js = fs.readFileSync(jsPath, 'utf8');

    expect(js).toContain('triggerKillAnimation');
    expect(js).toContain('triggerPhaseTransition');
    expect(js).toContain('triggerTowerFire');
    expect(js).toContain('triggerWeakpointFlash');
    expect(js).toContain('triggerEliteModeTransition');
  });

  it('exposes all animation functions on the global scope', () => {
    const js = fs.readFileSync(jsPath, 'utf8');

    expect(js).toContain('global.triggerKillAnimation');
    expect(js).toContain('global.triggerPhaseTransition');
    expect(js).toContain('global.triggerTowerFire');
    expect(js).toContain('global.triggerWeakpointFlash');
    expect(js).toContain('global.triggerEliteModeTransition');
  });

  it('handles all enemy types in triggerKillAnimation', () => {
    const js = fs.readFileSync(jsPath, 'utf8');

    expect(js).toContain('"boss"');
    expect(js).toContain('"elite"');
    expect(js).toContain('anim-boss-kill');
    expect(js).toContain('anim-elite-kill');
    expect(js).toContain('anim-kill-flash');
  });

  it('defines essential CSS keyframe animations in Syndicate Siege', () => {
    const css = fs.readFileSync(cssPath, 'utf8');

    // v2.0 uses specialized animations
    expect(css).toContain('@keyframes eliteFloat');
    expect(css).toContain('@keyframes bossGlitch');
  });

  it('applies continuous animations to elite and boss enemies', () => {
    const css = fs.readFileSync(cssPath, 'utf8');

    expect(css).toContain('animation: eliteFloat');
    expect(css).toContain('animation: bossGlitch');
  });

  it('calls animation triggers for tower fire and kill events', () => {
    const app = fs.readFileSync(appPath, 'utf8');

    expect(app).toContain('window.triggerTowerFire(cellEl)');
    expect(app).toContain('window.triggerKillAnimation(cellEl, target.type)');
    expect(app).toContain('window.triggerPhaseTransition(cellEl)');
    expect(app).toContain('window.triggerWeakpointFlash(cellEl)');
    expect(app).toContain('window.triggerEliteModeTransition(isElite)');
  });

  it('triggers weakpoint flash only once per enemy by guarding with weakpointFlashed flag', () => {
    const app = fs.readFileSync(appPath, 'utf8');

    expect(app).toContain('target.weakpointFlashed');
    expect(app).toContain('!target.weakpointFlashed');
  });

  it('includes arcadeSyndicateSiege route in Vite build inputs', () => {
    const config = fs.readFileSync(configPath, 'utf8');

    expect(config).toContain('arcadeSyndicateSiege');
    expect(config).toContain('arcade/syndicate-siege/index.html');
  });
});
