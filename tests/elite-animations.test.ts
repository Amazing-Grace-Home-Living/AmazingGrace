import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Elite Animations system', () => {
  const jsPath = 'arcade/js/elite-animations.js';
  const htmlPath = 'arcade/syndicate-siege/index.html';
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

  it('defines all CSS keyframe animations in Syndicate Siege', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).toContain('@keyframes killFlash');
    expect(html).toContain('@keyframes eliteKillFlash');
    expect(html).toContain('@keyframes bossKillFlash');
    expect(html).toContain('@keyframes elitePulse');
    expect(html).toContain('@keyframes bossFlicker');
    expect(html).toContain('@keyframes phaseShift');
    expect(html).toContain('@keyframes towerFire');
    expect(html).toContain('@keyframes weakpoint');
    expect(html).toContain('@keyframes eliteModeOn');
    expect(html).toContain('@keyframes eliteModeOff');
  });

  it('applies continuous animations to elite and boss enemies', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).toContain('animation: elitePulse');
    expect(html).toContain('animation: bossFlicker');
  });

  it('loads elite-animations.js in Syndicate Siege', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).toContain('../js/elite-animations.js');
  });

  it('calls animation triggers for tower fire and kill events', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).toContain('triggerTowerFire(t.cellEl)');
    expect(html).toContain('triggerKillAnimation(killCell, target.type)');
    expect(html).toContain('triggerPhaseTransition(killCell)');
    expect(html).toContain('triggerWeakpointFlash(cell)');
    expect(html).toContain('triggerEliteModeTransition(eliteMode)');
  });

  it('includes arcadeSyndicateSiege route in Vite build inputs', () => {
    const config = fs.readFileSync(configPath, 'utf8');

    expect(config).toContain('arcadeSyndicateSiege');
    expect(config).toContain('arcade/syndicate-siege/index.html');
  });
});
