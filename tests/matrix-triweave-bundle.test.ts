import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Tri-Weave Bundle engine in Matrix of Conscience', () => {
  const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');

  it('includes a weave canvas element', () => {
    expect(html).toContain('id="weave-canvas"');
  });

  it('declares core weave state variables', () => {
    expect(html).toContain('let weaveTick');
    expect(html).toContain('let weaveStrength');
    expect(html).toContain('let weaveClarity');
    expect(html).toContain('let weaveStability');
    expect(html).toContain('window.currentCommunity');
  });

  it('implements drawTriWeaveStrand with quadratic curve and pulse', () => {
    expect(html).toContain('function drawTriWeaveStrand(');
    expect(html).toContain('quadraticCurveTo(cpX, cpY, x2, y2)');
    expect(html).toContain('Math.sin(t * weaveClarity + phase)');
    expect(html).toContain('Math.cos(t * weaveClarity + phase)');
    expect(html).toContain('rgba(255, 215, 0,');
  });

  it('implements drawTriWeaveBundle with 3 strands 120° apart', () => {
    expect(html).toContain('function drawTriWeaveBundle(');
    expect(html).toContain('for (let strand = 0; strand < 3; strand++)');
    expect(html).toContain('strand * Math.PI * 0.66');
  });

  it('implements updateThreadWeave with stat-driven properties', () => {
    expect(html).toContain('function updateThreadWeave(');
    expect(html).toContain('stats.karma');
    expect(html).toContain('stats.wisdom');
    expect(html).toContain('stats.integrity');
    expect(html).toContain('stats.community');
  });

  it('implements triWeavePulse golden flare with overlap guard', () => {
    expect(html).toContain('function triWeavePulse(');
    expect(html).toContain('weaveStrength += 1.5');
    expect(html).toContain('weaveClarity  += 0.4');
    expect(html).toContain('Math.max(0.5, weaveStrength)');
    expect(html).toContain('Math.max(0.8, weaveClarity)');
  });

  it('implements corruptTriWeave Red Queen interference', () => {
    expect(html).toContain('function corruptTriWeave(');
    expect(html).toContain('weaveStability = Math.max(0.2');
    expect(html).toContain('weaveClarity   = Math.max(0.5');
  });

  it('uses community-driven bundle count in the draw loop', () => {
    expect(html).toContain('COMMUNITY_BUNDLE_THRESHOLD');
    expect(html).toContain('bundleCount = 1 + Math.floor((window.currentCommunity || 0) / COMMUNITY_BUNDLE_THRESHOLD)');
    expect(html).toContain('for (let b = 0; b < bundleCount; b++)');
    expect(html).toContain('drawTriWeaveBundle(coreX, coreY, px, py, b, bundleCount)');
  });

  it('exposes weave API globally', () => {
    expect(html).toContain('window.updateThreadWeave = updateThreadWeave');
    expect(html).toContain('window.triWeavePulse     = triWeavePulse');
    expect(html).toContain('window.corruptTriWeave   = corruptTriWeave');
  });

  it('calls updateThreadWeave and triWeavePulse from updateScore', () => {
    expect(html).toContain('updateThreadWeave({');
    expect(html).toContain('triWeavePulse()');
  });
});
