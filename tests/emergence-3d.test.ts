import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Emergence 3D Simulation Frontend Integration', () => {
  it('verifies entry point page files exist', () => {
    const htmlPath = path.resolve(__dirname, '../arcade/matrix-of-conscience/index.html');
    const tsxPath = path.resolve(__dirname, '../arcade/matrix-of-conscience/main.tsx');
    
    expect(fs.existsSync(htmlPath)).toBe(true);
    expect(fs.existsSync(tsxPath)).toBe(true);
  });

  it('verifies vite.config.ts exposes the multi-page entry point route', () => {
    const configPath = path.resolve(__dirname, '../vite.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    expect(configContent).toContain('arcadeMatrix');
    expect(configContent).toContain('arcade/matrix-of-conscience/index.html');
  });

  it('verifies R3F adapter code and component structure', () => {
    const sceneContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceScene.tsx'),
      'utf8'
    );
    
    // Core R3F components
    expect(sceneContent).toContain('<Canvas');
    expect(sceneContent).toContain('<OrbitControls');
    expect(sceneContent).toContain('<Stars');
    expect(sceneContent).toContain('<EffectComposer');
    expect(sceneContent).toContain('<Bloom');
    
    // Custom domain components
    expect(sceneContent).toContain('TerrainGrid');
    expect(sceneContent).toContain('CentralPortal');
    expect(sceneContent).toContain('SovereignAgent');
    expect(sceneContent).toContain('DataFlows');
    expect(sceneContent).toContain('LocalPlayer');
    expect(sceneContent).toContain('DialogueBubble');
  });

  it('verifies multiplayer log schemas and AI interaction methods are defined in context', () => {
    const contextContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceDataContext.tsx'),
      'utf8'
    );
    expect(contextContent).toContain('selectedSovereignName');
    expect(contextContent).toContain('multiplayerLogs');
    expect(contextContent).toContain('agentConversations');
    expect(contextContent).toContain('transmitAgentMessage');
    expect(contextContent).toContain('applyAgentOverride');
    expect(contextContent).toContain('attune_genesis');
    expect(contextContent).toContain('attune_hunt');
    
    const sceneContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceScene.tsx'),
      'utf8'
    );
    // Updated strings for Nexus Defense feature
    expect(sceneContent).toContain('NEXUS DEFENSE');
    expect(sceneContent).toContain('useTowerDefenseEngine');
    expect(sceneContent).toContain('Toggle Towers (T)');
  });
});
