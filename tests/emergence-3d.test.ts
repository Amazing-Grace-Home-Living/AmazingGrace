import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Emergence 3D Simulation Frontend Integration', () => {
  it('verifies entry point page files exist', () => {
    const htmlExists = fs.existsSync(path.resolve(__dirname, '../arcade/emergence-3d/index.html'));
    expect(htmlExists).toBe(true);

    const htmlContent = fs.readFileSync(path.resolve(__dirname, '../arcade/emergence-3d/index.html'), 'utf8');
    expect(htmlContent).toContain('<div id="root">');
    expect(htmlContent).toContain('src/emergence-main.tsx');
  });

  it('verifies vite.config.ts exposes the multi-page entry point route', () => {
    const configContent = fs.readFileSync(path.resolve(__dirname, '../vite.config.ts'), 'utf8');
    expect(configContent).toContain('arcadeEmergence3D');
    expect(configContent).toContain('arcade/emergence-3d/index.html');
  });

  it('verifies R3F adapter code and component structure', () => {
    const contextContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceDataContext.tsx'),
      'utf8'
    );
    expect(contextContent).toContain('createOmniversalRuntime');
    expect(contextContent).toContain('runIntelligentEngineCycle');
    expect(contextContent).toContain('EmergenceDataProvider');

    const sceneContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceScene.tsx'),
      'utf8'
    );
    expect(sceneContent).toContain('useEmergenceData');
    expect(sceneContent).toContain('Canvas');
    expect(sceneContent).toContain('OrbitControls');
    expect(sceneContent).toContain('TerrainGrid');
    expect(sceneContent).toContain('CentralTowers');
    expect(sceneContent).toContain('SovereignAgent');
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
  });

  it('verifies Tower Defense features and hooks are defined in context and scene', () => {
    const contextContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceDataContext.tsx'),
      'utf8'
    );
    expect(contextContent).toContain('alignmentPoints');
    expect(contextContent).toContain('deployedTowers');
    expect(contextContent).toContain('placementMode');
    expect(contextContent).toContain('deployTower');
    expect(contextContent).toContain('getAgentPosition');

    const sceneContent = fs.readFileSync(
      path.resolve(__dirname, '../src/components/EmergenceSimulation/EmergenceScene.tsx'),
      'utf8'
    );
    expect(sceneContent).toContain('PurificationTower');
    expect(sceneContent).toContain('ContainmentField');
    expect(sceneContent).toContain('SentinelTurret');
    expect(sceneContent).toContain('GenesisBeacon');
    expect(sceneContent).toContain('TowersLayer');
  });
});
