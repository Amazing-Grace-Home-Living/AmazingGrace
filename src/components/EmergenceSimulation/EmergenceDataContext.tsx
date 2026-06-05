import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// @ts-ignore
import { runIntelligentEngineCycle, createInitialIntelligentEngineState } from '../../../js/intelligent-engine.js';
// @ts-ignore
import { createOmniversalRuntime, createWorldState } from '../../../js/omniversal-runtime.js';

type TowerType = 'purify' | 'contain' | 'sentinel' | 'genesis';
type ThreatLevel = 'safe' | 'warning' | 'danger' | 'critical';

interface Tower {
  id: string;
  type: TowerType;
  position: { x: number; z: number };
  range: number;
  cost: number;
  underAttack: boolean;
}

const towerConfigs: Record<TowerType, { range: number; cost: number }> = {
  purify: { range: 2, cost: 500 },
  contain: { range: 1.5, cost: 300 },
  sentinel: { range: 3, cost: 800 },
  genesis: { range: 2.5, cost: 400 },
};

// Balance values tuned for the corruption thresholds below:
// crossing 100 corruption (forced exile) is a large penalty, while recovering below 86 (critical) grants a smaller recovery reward.
const EXILE_PENALTY = 200;
const CRITICAL_RECOVERY_REWARD = 100;

const getDistance = (a: { x: number; z: number }, b: { x: number; z: number }) => {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
};

const getSovereignGridPosition = (index: number, sovereign: any) => {
  if (sovereign.position && typeof sovereign.position.x === 'number' && typeof sovereign.position.z === 'number') {
    return { x: sovereign.position.x, z: sovereign.position.z };
  }
  const angle = (index * (2 * Math.PI)) / 5;
  const radius = 3.2 + (index % 2) * 0.6;
  return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
};

export interface Sovereign {
  name: string;
  instinct: 'hunt' | 'genesis' | string;
  trauma: number;
  loyalty: number;
  metamorphosisStage: number;
  desire: string;
  adaptation: number;
  corruption: number;
  fear: number;
  status: 'active' | 'exiled' | string;
  pulse?: number; // Normalized pulse 0-1
}
interface EmergenceContextType {
  metrics: {
    worldAlignment: number;
    factionTrust: number;
    timelineInstability: number;
    sovereignAffinity: number;
  };
  veilState: string;
  sovereigns: Sovereign[];
  recentEvents: any[];
  recentMutations: any[];
  lastNarrative: string;
  lastEvent: string;
  autoUpdateEnabled: boolean;
  triggerSystemEvent: (key: string) => void;
  applySystemOverride: (action: string, options?: any) => void;
  // New multiplayer and direct AI interaction states
  selectedSovereignName: string | null;
  selectSovereign: (name: string | null) => void;
  multiplayerLogs: Array<{ id: string; time: string; text: string; operator: string; type: string }>;
  agentConversations: Array<{ id: string; from: string; to: string; text: string; time: number }>;
  transmitAgentMessage: (name: string, text: string) => void;
  applyAgentOverride: (name: string, actionType: string) => void;
  towers: Tower[];
  alignmentPoints: number;
  selectedTower: TowerType | null;
  slowedSovereigns: Record<string, boolean>;
  threatFlashes: Record<string, boolean>;
  setSelectedTower: (tower: TowerType | null) => void;
  toggleTowerPlacementMode: () => void;
  placeTower: (gridX: number, gridZ: number) => void;
  validateTowerPlacement: (gridX: number, gridZ: number) => { valid: boolean; reason?: string };
  getThreatLevel: (corruption: number) => ThreatLevel;
}

const EmergenceDataContext = createContext<EmergenceContextType | null>(null);

export const useEmergenceData = () => {
  const context = useContext(EmergenceDataContext);
  if (!context) throw new Error('useEmergenceData must be used within EmergenceDataProvider');
  return context;
};

export const EmergenceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State Setup
  const [engineState, setEngineState] = useState(() => createInitialIntelligentEngineState());
  const runtimeRef = useRef<any>(null);
  const [renderState, setRenderState] = useState<any>(null);

  // Direct AI Interaction state
  const [selectedSovereignName, setSelectedSovereignName] = useState<string | null>(null);
  const [multiplayerLogs, setMultiplayerLogs] = useState<Array<{ id: string; time: string; text: string; operator: string; type: string }>>(() => [
    { id: '1', time: '15:20:00', operator: 'System', text: 'Multiplayer Lobby Node operational. Listening for peers...', type: 'system' },
    { id: '2', time: '15:20:05', operator: 'Operator_Bakersfield', text: 'Attuned Bakersfield gateway, streaming telemetry data.', type: 'network' },
  ]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [alignmentPoints, setAlignmentPoints] = useState(1000);
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
  const [slowedSovereigns, setSlowedSovereigns] = useState<Record<string, boolean>>({});
  const [threatFlashes, setThreatFlashes] = useState<Record<string, boolean>>({});
  const previousCorruptionRef = useRef<Record<string, number>>({});
  const [agentConversations, setAgentConversations] = useState<Array<{ id: string; from: string; to: string; text: string; time: number }>>([]);

  useEffect(() => {
    // Instantiate the omniversal runtime locally
    runtimeRef.current = createOmniversalRuntime({
      metrics: {
        worldAlignment: engineState.worldAlignment,
        factionTrust: engineState.factionTrust,
        timelineInstability: engineState.timelineInstability,
        sovereignAffinity: engineState.sovereignAffinity.genesis - engineState.sovereignAffinity.hunt,
      }
    });
    setRenderState(runtimeRef.current.getRenderState());
  }, []);

  // 2. Loop tick execution
  useEffect(() => {
    if (!runtimeRef.current) return;

    const interval = setInterval(() => {
      const runtime = runtimeRef.current;
      if (runtime.getRenderState().autoUpdateEnabled) {
        // Run tick cycle on runtime
        runtime.tick();
        const nextRender = runtime.getRenderState();
        setRenderState(nextRender);

        // Run engine cycle on the intelligent engine using runtime metrics as pressures
        setEngineState((prev: any) => {
          const pressures = {
            sovereignPressure: (nextRender.metrics.sovereignAffinity / 100) * 1.5,
            factionConflict: (50 - nextRender.metrics.factionTrust) / 100 * 2,
            apexInfluence: nextRender.veilState === 'unveiled' ? 3.0 : 1.0,
            stabilityResistance: (nextRender.metrics.timelineInstability / 100) * 0.8,
          };
          const { state: nextEngine } = runIntelligentEngineCycle(prev, pressures, 1);
          
          // Inject dynamic pulse data for the 3D visualization
          nextEngine.sovereigns = nextEngine.sovereigns.map((s: any) => {
            const time = Date.now() / 1000;
            const frequency = 0.5 + (s.metamorphosisStage * 0.5) + (s.corruption / 50);
            return {
              ...s,
              pulse: (Math.sin(time * Math.PI * frequency) + 1) / 2
            };
          });

          return nextEngine;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engineState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlignmentPoints((prev) => {
        if (engineState.worldAlignment > 0) return prev + 50;
        if (engineState.worldAlignment < 0) return Math.max(0, prev - 30);
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [engineState.worldAlignment]);

  const getThreatLevel = (corruption: number): ThreatLevel => {
    if (corruption <= 30) return 'safe';
    if (corruption <= 60) return 'warning';
    if (corruption <= 85) return 'danger';
    return 'critical';
  };

  const validateTowerPlacement = (gridX: number, gridZ: number) => {
    const occupiedByTower = towers.some((tower) => getDistance(tower.position, { x: gridX, z: gridZ }) < 0.5);
    if (occupiedByTower) {
      return { valid: false, reason: 'Grid cell occupied by another tower.' };
    }

    const occupiedByAgent = engineState.sovereigns.some((sovereign: any, index: number) => {
      const pos = getSovereignGridPosition(index, sovereign);
      return Math.abs(pos.x - gridX) < 0.5 && Math.abs(pos.z - gridZ) < 0.5;
    });
    if (occupiedByAgent) {
      return { valid: false, reason: 'Grid cell occupied by sovereign agent.' };
    }

    return { valid: true };
  };

  const placeTower = (gridX: number, gridZ: number) => {
    if (!selectedTower) return;
    const config = towerConfigs[selectedTower];
    if (alignmentPoints < config.cost) {
      const timeString = new Date().toTimeString().split(' ')[0];
      setMultiplayerLogs((prev) => [...prev, {
        id: `insufficient-${Date.now()}`,
        time: timeString,
        operator: 'System',
        text: `Insufficient alignment budget. Need ${config.cost} points.`,
        type: 'error'
      }].slice(-30));
      return;
    }

    const validation = validateTowerPlacement(gridX, gridZ);
    if (!validation.valid) {
      const timeString = new Date().toTimeString().split(' ')[0];
      setMultiplayerLogs((prev) => [...prev, {
        id: `tower-invalid-${Date.now()}`,
        time: timeString,
        operator: 'System',
        text: validation.reason || 'Invalid placement location.',
        type: 'error'
      }].slice(-30));
      return;
    }

    const tower: Tower = {
      id: `tower-${Date.now()}`,
      type: selectedTower,
      position: { x: gridX, z: gridZ },
      range: config.range,
      cost: config.cost,
      underAttack: false
    };
    const timeString = new Date().toTimeString().split(' ')[0];
    setTowers((prev) => [...prev, tower]);
    setAlignmentPoints((prev) => prev - config.cost);
    setSelectedTower(null);
    setMultiplayerLogs((prev) => [...prev, {
      id: `tower-place-${Date.now()}`,
      time: timeString,
      operator: 'You (Architect)',
      text: `Deployed ${tower.type} tower at grid [${gridX}, ${gridZ}]`,
      type: 'command'
    }].slice(-30));
  };

  const toggleTowerPlacementMode = () => {
    setSelectedTower((prev) => prev ? null : 'purify');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let budgetDelta = 0;
      const logsToAdd: Array<{ id: string; time: string; text: string; operator: string; type: string }> = [];
      const nextSlowed: Record<string, boolean> = {};
      const nextThreatFlashes: Record<string, boolean> = {};
      const timeString = new Date().toTimeString().split(' ')[0];
      const workingTowers = towers;
      let nextSovereigns: any[] = [];

      setEngineState((prev: any) => {
        const updatedSovereigns = prev.sovereigns.map((sovereign: any, index: number) => {
          const pos = getSovereignGridPosition(index, sovereign);
          const previousCorruption = previousCorruptionRef.current[sovereign.name] ?? sovereign.corruption;
          const purifierCount = workingTowers.filter((tower) => (
            tower.type === 'purify' && getDistance(pos, tower.position) <= tower.range
          )).length;
          const genesisCount = workingTowers.filter((tower) => (
            tower.type === 'genesis' && getDistance(pos, tower.position) <= tower.range
          )).length;
          const sentinelInRange = workingTowers.some((tower) => (
            tower.type === 'sentinel' && getDistance(pos, tower.position) <= tower.range
          ));
          const contained = workingTowers.some((tower) => (
            tower.type === 'contain' &&
            sovereign.corruption > 60 &&
            getDistance(pos, tower.position) <= tower.range
          ));

          nextSlowed[sovereign.name] = contained;

          let nextCorruption = sovereign.corruption;
          if (purifierCount > 0) {
            nextCorruption = Math.max(0, nextCorruption - (5 * purifierCount));
          }

          if (previousCorruption < 100 && nextCorruption >= 100) {
            budgetDelta -= EXILE_PENALTY;
          }

          if (previousCorruption >= 86 && nextCorruption < 86) {
            budgetDelta += CRITICAL_RECOVERY_REWARD;
          }

          if (nextCorruption - previousCorruption > 10) {
            nextThreatFlashes[sovereign.name] = true;
            logsToAdd.push({
              id: `threat-spike-${sovereign.name}-${Date.now()}`,
              time: timeString,
              operator: 'System',
              text: `THREAT DETECTED [RAPID INCREASE]: ${sovereign.name} corruption surged to ${nextCorruption.toFixed(0)}%.`,
              type: 'error'
            });
          }

          if (previousCorruption < 86 && nextCorruption >= 86) {
            logsToAdd.push({
              id: `threat-critical-${sovereign.name}-${Date.now()}`,
              time: timeString,
              operator: 'System',
              text: `THREAT DETECTED [CRITICAL]: ${sovereign.name} crossed critical corruption (${nextCorruption.toFixed(0)}%).`,
              type: 'error'
            });
          }

          previousCorruptionRef.current[sovereign.name] = nextCorruption;

          return {
            ...sovereign,
            corruption: nextCorruption,
            loyalty: sovereign.instinct === 'genesis' ? Math.min(100, sovereign.loyalty + (10 * genesisCount)) : sovereign.loyalty,
            status: sentinelInRange && nextCorruption >= 100 ? 'exiled' : sovereign.status,
          };
        });
        nextSovereigns = updatedSovereigns;

        return { ...prev, sovereigns: updatedSovereigns };
      });

      setThreatFlashes(nextThreatFlashes);
      if (Object.keys(nextThreatFlashes).length > 0) {
        setTimeout(() => setThreatFlashes({}), 900);
      }
      setSlowedSovereigns(nextSlowed);
      setAlignmentPoints((prev) => Math.max(0, prev + budgetDelta));
      if (logsToAdd.length > 0) {
        setMultiplayerLogs((prev) => [...prev, ...logsToAdd].slice(-30));
      }

      setTowers((prev) => prev.map((tower) => {
        const underAttack = nextSovereigns.some((sovereign: any, index: number) => {
          const pos = getSovereignGridPosition(index, sovereign);
          return sovereign.corruption > 60 && getDistance(pos, tower.position) <= tower.range;
        });
        return { ...tower, underAttack };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [towers]);

  // 3. Simulated Multiplayer Operator loop
  useEffect(() => {
    const peers = ['Operator_Sanctuary', 'Operator_Pleiades', 'Operator_Janus', 'Operator_Aeon', 'Operator_Bakersfield'];
    const actions = [
      { text: 'Broadcasting stability calibrations across Bakersfield grid coordinates.', type: 'network' },
      { text: 'Monitoring sovereign mutational drift. scarletGrowth expansion is within limits.', type: 'network' },
      { text: 'Attuning World Alignment metrics towards whiteClarity.', type: 'network' },
      { text: 'Compiling real-time telemetry logs. Faction Trust bounds look secure.', type: 'network' },
      { text: 'Bypassing local safety filter weight for short-term compute recovery.', type: 'command' },
    ];

    const interval = setInterval(() => {
      const randomPeer = peers[Math.floor(Math.random() * peers.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const timeString = new Date().toTimeString().split(' ')[0];

      setMultiplayerLogs((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          time: timeString,
          operator: randomPeer,
          text: randomAction.text,
          type: randomAction.type
        }
      ].slice(-30)); // Cap logs at last 30 entries
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // 4. Simulated Agent-to-Agent dialogue loop
  useEffect(() => {
    const dialogueLines = [
      "Targeting coordinates for hunt cycle 442.",
      "The whiteClarity frequency is drifting. Calibrating...",
      "I sense a fracture in the local lattice. Are you witnessing this?",
      "Genesis protocol initiated. Preparing for blooming phase.",
      "Corruption levels rising in the scarletGrowth sector. Caution recommended.",
      "Awaiting directive from the Architect. Do you have signal?",
    ];

    const interval = setInterval(() => {
      if (engineState.sovereigns.length < 2) return;
      
      const fromIdx = Math.floor(Math.random() * engineState.sovereigns.length);
      let toIdx = Math.floor(Math.random() * engineState.sovereigns.length);
      while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * engineState.sovereigns.length);

      const fromAgent = engineState.sovereigns[fromIdx];
      const toAgent = engineState.sovereigns[toIdx];
      const text = dialogueLines[Math.floor(Math.random() * dialogueLines.length)];

      const newConv = {
        id: `${Date.now()}`,
        from: fromAgent.name,
        to: toAgent.name,
        text,
        time: Date.now()
      };

      setAgentConversations((prev) => [...prev, newConv].slice(-5));
      
      const timeString = new Date().toTimeString().split(' ')[0];
      setMultiplayerLogs((prev) => [
        ...prev,
        {
          id: `conv-${Date.now()}`,
          time: timeString,
          operator: fromAgent.name,
          text: `[Intercepted] To ${toAgent.name}: "${text}"`,
          type: 'network'
        }
      ].slice(-30));
    }, 12000);

    return () => clearInterval(interval);
  }, [engineState.sovereigns]);

  // 5. User Controls mapping
  const triggerSystemEvent = (key: string) => {
    if (!runtimeRef.current) return;
    runtimeRef.current.triggerEvent(key);
    const nextRender = runtimeRef.current.getRenderState();
    setRenderState(nextRender);

    const timeString = new Date().toTimeString().split(' ')[0];
    setMultiplayerLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        time: timeString,
        operator: 'You (Local Architect)',
        text: `Triggered critical system event: ${key.toUpperCase()}`,
        type: 'event'
      }
    ].slice(-30));
  };

  const applySystemOverride = (action: string, options?: any) => {
    if (!runtimeRef.current) return;
    runtimeRef.current.applyOverride(action, options);
    const nextRender = runtimeRef.current.getRenderState();
    setRenderState(nextRender);

    const timeString = new Date().toTimeString().split(' ')[0];
    setMultiplayerLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        time: timeString,
        operator: 'You (Local Architect)',
        text: `Applied global override: ${action.toUpperCase()}`,
        type: 'command'
      }
    ].slice(-30));
  };

  // 5. Direct AI Selection & Interaction functions
  const selectSovereign = (name: string | null) => {
    setSelectedSovereignName(name);
  };

  const transmitAgentMessage = (name: string, text: string) => {
    const timeString = new Date().toTimeString().split(' ')[0];
    const targetAgent = engineState.sovereigns.find((s: any) => s.name === name);
    if (!targetAgent) return;

    // Generate responsive dialogue based on instinct, corruption, and desire
    let reply = '';
    const isCorrupted = targetAgent.corruption > 60;
    const isExiled = targetAgent.status === 'exiled';

    if (isExiled) {
      reply = `[Transmission Fractured] Exiled from Conscience mainframe. Static interference... Cannot execute directive.`;
    } else if (isCorrupted) {
      reply = `The scarletGrowth is beautiful, Architect. Why resist? The Devourer commands adaptation. Instability is our catalyst.`;
    } else {
      switch (targetAgent.instinct) {
        case 'hunt':
          reply = `Hunt vector set. Order preserve bias: ${targetAgent.desire}. Loyalty at ${targetAgent.loyalty}%. Awaiting next targeting coordinates.`;
          break;
        case 'genesis':
          reply = `White clarity frequency aligned. Metamorphosis Stage ${targetAgent.metamorphosisStage} initialized. Creation blooms in this sector.`;
          break;
        default:
          reply = `Directive acknowledged. Order coefficient aligned. Resolving system technical debt.`;
      }
    }

    setMultiplayerLogs((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        time: timeString,
        operator: 'You (Transmit)',
        text: `To ${name}: "${text}"`,
        type: 'chat'
      },
      {
        id: `msg-reply-${Date.now()}`,
        time: timeString,
        operator: name,
        text: reply,
        type: 'reply'
      }
    ].slice(-30));
  };

  const applyAgentOverride = (name: string, actionType: string) => {
    const timeString = new Date().toTimeString().split(' ')[0];
    
    setEngineState((prev: any) => {
      const nextSovereigns = prev.sovereigns.map((s: any) => {
        if (s.name !== name) return s;
        
        const next = { ...s };
        if (actionType === 'purify') {
          next.corruption = Math.max(0, next.corruption - 40);
          next.trauma = Math.max(0, next.trauma - 20);
        } else if (actionType === 'attune_genesis') {
          next.instinct = 'genesis';
          next.loyalty = Math.min(100, next.loyalty + 15);
        } else if (actionType === 'attune_hunt') {
          next.instinct = 'hunt';
          next.loyalty = Math.min(100, next.loyalty + 10);
        } else if (actionType === 'overclock') {
          next.metamorphosisStage = Math.min(5, next.metamorphosisStage + 1);
          next.corruption = Math.min(100, next.corruption + 15);
        }
        return next;
      });

      return {
        ...prev,
        sovereigns: nextSovereigns
      };
    });

    setMultiplayerLogs((prev) => [
      ...prev,
      {
        id: `override-${Date.now()}`,
        time: timeString,
        operator: 'You (Architect)',
        text: `Dispatched direct override: [${actionType.toUpperCase()}] to agent ${name}`,
        type: 'command'
      }
    ].slice(-30));
  };

  const currentMetrics = renderState?.metrics || {
    worldAlignment: engineState.worldAlignment,
    factionTrust: engineState.factionTrust,
    timelineInstability: engineState.timelineInstability,
    sovereignAffinity: 0
  };

  return (
    <EmergenceDataContext.Provider value={{
      metrics: currentMetrics,
      veilState: renderState?.veilState || 'veiled',
      sovereigns: engineState.sovereigns || [],
      recentEvents: engineState.recentEvents || [],
      recentMutations: engineState.recentMutations || [],
      lastNarrative: renderState?.lastNarrative || 'Awaiting simulation pulse...',
      lastEvent: renderState?.lastEvent || 'Telemetry engine online.',
      autoUpdateEnabled: renderState?.autoUpdateEnabled ?? true,
      triggerSystemEvent,
      applySystemOverride,
      selectedSovereignName,
      selectSovereign,
      multiplayerLogs,
      agentConversations,
      transmitAgentMessage,
      applyAgentOverride,
      towers,
      alignmentPoints,
      selectedTower,
      slowedSovereigns,
      threatFlashes,
      setSelectedTower,
      toggleTowerPlacementMode,
      placeTower,
      validateTowerPlacement,
      getThreatLevel
    }}>
      {children}
    </EmergenceDataContext.Provider>
  );
};
