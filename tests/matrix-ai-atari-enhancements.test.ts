import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Matrix of Conscience AI and Atari enhancements', () => {
  it('keeps matrix entrypoint wired to the standalone app entrypoint', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    // It now points to its own main.tsx since it's a standalone module
    expect(html).toContain('src="./main.tsx"');
  });

  it('verifies AI communication interface is present in the scene components', () => {
    const scene = fs.readFileSync('src/components/EmergenceSimulation/EmergenceScene.tsx', 'utf8');
    expect(scene).toContain('Sovereign Communicator');
    expect(scene).toContain('transmitAgentMessage');
    expect(scene).toContain('applyAgentOverride');
    expect(scene).toContain('DialogueBubble');
  });

  it('verifies Konami code hook and Atari Wing overlay integration', () => {
    const scene = fs.readFileSync('src/components/EmergenceSimulation/EmergenceScene.tsx', 'utf8');
    expect(scene).toContain('useKonamiCode');
    expect(scene).toContain('AtariWingOverlay');
    expect(scene).toContain('atari_attuned');
  });
});
