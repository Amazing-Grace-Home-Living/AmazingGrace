import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

const NEXUS_HTML = 'arcade/nexus.html';

describe('nexus clue-shake animation', () => {
  it('defines the @keyframes clue-shake rule', () => {
    const html = fs.readFileSync(NEXUS_HTML, 'utf8');
    expect(html).toContain('@keyframes clue-shake');
  });

  it('applies clue-shake animation to .clue-card elements', () => {
    const html = fs.readFileSync(NEXUS_HTML, 'utf8');
    expect(html).toMatch(/\.clue-card\.clue-shake[^}]*animation:\s*clue-shake/s);
  });

  it('applies clue-shake animation to .suspect-panel elements (selector is broad enough)', () => {
    const html = fs.readFileSync(NEXUS_HTML, 'utf8');
    expect(html).toMatch(/\.suspect-panel\.clue-shake[^}]*animation:\s*clue-shake/s);
  });

  it('defines the revealClue function', () => {
    const html = fs.readFileSync(NEXUS_HTML, 'utf8');
    expect(html).toContain('function revealClue(');
    expect(html).toContain("classList.add('clue-shake')");
  });

  it('includes a .suspect-panel element in the DOM', () => {
    const html = fs.readFileSync(NEXUS_HTML, 'utf8');
    expect(html).toContain('class="suspect-panel');
  });
});
