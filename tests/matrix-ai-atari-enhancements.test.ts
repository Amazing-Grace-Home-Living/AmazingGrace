import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Matrix of Conscience AI and Atari enhancements', () => {
  it('keeps matrix entrypoint wired to emergence 3D app and atari css', () => {
    const html = fs.readFileSync('arcade/matrix-of-conscience/index.html', 'utf8');
    expect(html).toContain('src="../emergence-3d/main.tsx"');
    expect(html).toContain('href="./atari-wing.css"');
  });

  it('adds enhanced sovereign AI structures and autonomous behavior loop', () => {
    const context = fs.readFileSync('src/components/EmergenceSimulation/EmergenceDataContext.tsx', 'utf8');
    expect(context).toContain('interface AIPersonality');
    expect(context).toContain('relationships: Record<string, number>');
    expect(context).toContain('memory: AgentMemoryEntry[]');
    expect(context).toContain('buildContextAwareDialogue');
    expect(context).toContain('Autonomous strategic AI behavior loop');
    expect(context).toContain('Attempted scarletGrowth conversion');
  });

  it('adds konami unlock support in scene and standalone atari unlock module', () => {
    const scene = fs.readFileSync('src/components/EmergenceSimulation/EmergenceScene.tsx', 'utf8');
    const unlockModule = fs.readFileSync('arcade/matrix-of-conscience/AtariWingUnlock.tsx', 'utf8');
    const unlockCss = fs.readFileSync('arcade/matrix-of-conscience/atari-wing.css', 'utf8');

    expect(scene).toContain('useKonamiCode');
    expect(scene).toContain("sessionStorage.setItem('atari_attuned', 'true')");
    expect(scene).toContain('SYSTEM BREACH DETECTED: Atari Wing protocols activated.');
    expect(scene).toContain('[ATARI_WING] - FORBIDDEN ACCESS');

    expect(unlockModule).toContain('export { useKonamiCode, AtariWingOverlay }');
    expect(unlockCss).toContain('.atari-crack-overlay');
    expect(unlockCss).toContain('.atari-whisper');
    expect(unlockCss).toContain('.atari-wing-btn');
  });
});
