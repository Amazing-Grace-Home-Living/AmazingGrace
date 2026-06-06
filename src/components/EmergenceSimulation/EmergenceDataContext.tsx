import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// @ts-ignore
import { runIntelligentEngineCycle, createInitialIntelligentEngineState } from '../../../js/intelligent-engine.js';
// @ts-ignore
import { createOmniversalRuntime, createWorldState } from '../../../js/omniversal-runtime.js';

type TowerType = 'purify' | 'contain' | 'sentinel' | 'genesis';
type ThreatLevel = 'safe' | 'warning' | 'danger' | 'critical';

interface AIPersonality {
  communicationStyle: 'aggressive' | 'cautious' | 'diplomatic' | 'analytical';
  cooperationLevel: number;
  riskTolerance: number;
  learningRate: number;
}

interface AgentMemoryEntry {
  event: string;
  timestamp: number;
  sentiment: number;
}

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
const MEMORY_LIMIT = 8;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildPersonality = (instinct: string, corruption: number): AIPersonality => {
  if (instinct === 'hunt') {
    return {
      communicationStyle: 'aggressive',
      cooperationLevel: 35,
      riskTolerance: clamp(65 + corruption * 0.2, 30, 95),
      learningRate: 1.2
    };
  }

  if (instinct === 'genesis') {
    return {
      communicationStyle: 'diplomatic',
      cooperationLevel: 78,
      riskTolerance: 30,
      learningRate: 1
    };
  }

  return {
    communicationStyle: 'analytical',
    cooperationLevel: 55,
    riskTolerance: 45,
    learningRate: 0.95
  };
};

const pushMemory = (memory: AgentMemoryEntry[] | undefined, event: string, sentiment: number): AgentMemoryEntry[] => {
  const next = [...(memory || []), { event, timestamp: Date.now(), sentiment: clamp(sentiment, -1, 1) }];
  return next.slice(-MEMORY_LIMIT);
};

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

const normalizeSovereign = (sovereign: any): Sovereign => ({
  ...sovereign,
  personality: sovereign.personality || buildPersonality(sovereign.instinct, sovereign.corruption ?? 0),
  relationships: sovereign.relationships || {},
  memory: Array.isArray(sovereign.memory) ? sovereign.memory : []
});

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
  personality: AIPersonality;
  relationships: Record<string, number>;
  memory: AgentMemoryEntry[];
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
  addMultiplayerLog: (text: string, operator?: string, type?: string) => void;
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
  const [engineState, setEngineState] = useState(() => {
    const baseState = createInitialIntelligentEngineState();
    return {
      ...baseState,
      sovereigns: (baseState.sovereigns || []).map((sovereign: any) => normalizeSovereign(sovereign))
    };
  });
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

  const addMultiplayerLog = (text: string, operator = 'System', type = 'network') => {
    const timeString = new Date().toTimeString().split(' ')[0];
    setMultiplayerLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        time: timeString,
        operator,
        text,
        type
      }
    ].slice(-30));
  };

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
          nextEngine.sovereigns = nextEngine.sovereigns.map((raw: any) => {
            const s = normalizeSovereign(raw);
            const time = Date.now() / 1000;
            const frequency = 0.5 + (s.metamorphosisStage * 0.5) + (s.corruption / 50);
            return {
              ...s,
              personality: {
                ...s.personality,
                riskTolerance: clamp(s.personality.riskTolerance + (s.corruption > 70 ? 1 : -0.5), 10, 95)
              },
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
        const updatedSovereigns = prev.sovereigns.map((rawSovereign: any, index: number) => {
          const sovereign = normalizeSovereign(rawSovereign);
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
            memory: (nextCorruption - previousCorruption > 10)
              ? pushMemory(sovereign.memory, `Threat surge detected at ${nextCorruption.toFixed(0)}% corruption`, -0.8)
              : sovereign.memory,
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

      setTowers((prev) => {
        let changed = false;
        const next = prev.map((tower) => {
          const underAttack = nextSovereigns.some((sovereign: any, index: number) => {
            const pos = getSovereignGridPosition(index, sovereign);
            return sovereign.corruption > 60 && getDistance(pos, tower.position) <= tower.range;
          });
          if (tower.underAttack === underAttack) return tower;
          changed = true;
          return { ...tower, underAttack };
        });
        return changed ? next : prev;
      });
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

  // 4. Autonomous strategic AI behavior loop
  useEffect(() => {
    const interval = setInterval(() => {
      const strategicLogs: Array<{ text: string; operator: string; type: string }> = [];

      setEngineState((prev: any) => {
        const nextSovereigns = (prev.sovereigns || []).map((s: any) => normalizeSovereign(s));

        nextSovereigns.forEach((sovereign: Sovereign, index: number) => {
          const sovereignPos = getSovereignGridPosition(index, sovereign);
          const nearby: Array<{ candidate: Sovereign; candidateIndex: number; distance: number }> = nextSovereigns
            .map((candidate: Sovereign, candidateIndex: number) => ({
              candidate,
              candidateIndex,
              distance: getDistance(sovereignPos, getSovereignGridPosition(candidateIndex, candidate))
            }))
            .filter((entry: { candidate: Sovereign; candidateIndex: number; distance: number }) => (
              entry.candidate.name !== sovereign.name && entry.distance <= 2.8
            ));

          nearby.forEach(({ candidate }) => {
            const trustDelta = sovereign.instinct === candidate.instinct ? 4 : -2;
            sovereign.relationships[candidate.name] = clamp((sovereign.relationships[candidate.name] || 0) + trustDelta, -100, 100);
          });

          if (sovereign.corruption > 70 && nearby.length > 0) {
            const target = nearby[Math.floor(Math.random() * nearby.length)].candidate;
            target.corruption = clamp(target.corruption + (4 * sovereign.personality.learningRate), 0, 100);
            sovereign.memory = pushMemory(sovereign.memory, `Attempted corruption transfer on ${target.name}`, -0.5);
            target.memory = pushMemory(target.memory, `Resisted corruption pressure from ${sovereign.name}`, -0.6);
            strategicLogs.push({
              operator: sovereign.name,
              text: `Attempted scarletGrowth conversion on ${target.name}.`,
              type: 'mutation'
            });
          }

          if (sovereign.instinct === 'genesis' && sovereign.corruption < 30) {
            sovereign.loyalty = clamp(sovereign.loyalty + 2, 0, 100);
            sovereign.memory = pushMemory(sovereign.memory, 'Requested purification support in local grid', 0.6);
            strategicLogs.push({
              operator: sovereign.name,
              text: 'Requesting purification tower reinforcement near allied signatures.',
              type: 'network'
            });
          }

          if (sovereign.instinct === 'hunt') {
            const nearbyThreats = nearby.filter(({ candidate }) => candidate.corruption > 65).length;
            sovereign.adaptation = clamp(sovereign.adaptation + 1, 0, 100);
            sovereign.memory = pushMemory(
              sovereign.memory,
              nearbyThreats > 0 ? `Patrol found ${nearbyThreats} hostile signature(s)` : 'Patrol route clear',
              nearbyThreats > 0 ? 0.2 : 0.4
            );
            if (nearbyThreats > 0) {
              strategicLogs.push({
                operator: sovereign.name,
                text: `Hunt patrol reporting ${nearbyThreats} corruption hotspot(s).`,
                type: 'warning'
              });
            }
          }
        });

        return { ...prev, sovereigns: nextSovereigns };
      });

      if (strategicLogs.length > 0) {
        const timeString = new Date().toTimeString().split(' ')[0];
        setMultiplayerLogs((prev) => [
          ...prev,
          ...strategicLogs.map((entry, idx) => ({
            id: `strategic-${Date.now()}-${idx}`,
            time: timeString,
            operator: entry.operator,
            text: entry.text,
            type: entry.type
          }))
        ].slice(-30));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const buildContextAwareDialogue = (fromAgent: Sovereign, toAgent: Sovereign) => {
    const trust = fromAgent.relationships[toAgent.name] || 0;
    const recentMemory = fromAgent.memory[fromAgent.memory.length - 1]?.event;
    const corruptionState = fromAgent.corruption > 70 ? 'scarletGrowth pressure is rising' : 'whiteClarity channels remain stable';
    const threatState = toAgent.corruption > 70 ? 'You are near critical corruption thresholds.' : 'Threat pressure is currently manageable.';

    if (trust < -20) {
      return `${toAgent.name}, your signal is unstable. ${threatState}`;
    }
    if (fromAgent.instinct === 'genesis') {
      return `${toAgent.name}, align with genesis harmonics. ${corruptionState}. ${recentMemory ? `Memory: ${recentMemory}.` : ''}`.trim();
    }
    if (fromAgent.instinct === 'hunt') {
      return `${toAgent.name}, patrol vectors updated. ${threatState} ${recentMemory ? `Last event: ${recentMemory}.` : ''}`.trim();
    }
    return `${toAgent.name}, telemetry sync complete. ${corruptionState}. ${recentMemory ? `Reference: ${recentMemory}.` : ''}`.trim();
  };

  // 5. Simulated Agent-to-Agent dialogue loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (engineState.sovereigns.length < 2) return;
      
      const fromIdx = Math.floor(Math.random() * engineState.sovereigns.length);
      let toIdx = Math.floor(Math.random() * engineState.sovereigns.length);
      while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * engineState.sovereigns.length);

      const fromAgent = normalizeSovereign(engineState.sovereigns[fromIdx]);
      const toAgent = normalizeSovereign(engineState.sovereigns[toIdx]);
      const text = buildContextAwareDialogue(fromAgent, toAgent);

      const newConv = {
        id: `${Date.now()}`,
        from: fromAgent.name,
        to: toAgent.name,
        text,
        time: Date.now()
      };

      setAgentConversations((prev) => [...prev, newConv].slice(-5));
      setEngineState((prev: any) => ({
        ...prev,
        sovereigns: (prev.sovereigns || []).map((candidate: any) => {
          const normalized = normalizeSovereign(candidate);
          if (normalized.name === fromAgent.name) {
            return {
              ...normalized,
              memory: pushMemory(normalized.memory, `Messaged ${toAgent.name}: ${text}`, 0.4)
            };
          }
          return normalized;
        })
      }));
      
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
    const targetAgentRaw = engineState.sovereigns.find((s: any) => s.name === name);
    const targetAgent = targetAgentRaw ? normalizeSovereign(targetAgentRaw) : null;
    if (!targetAgent) return;

    // Generate responsive dialogue based on instinct, corruption, relationship trust, and memory context
    let reply = '';
    const isCorrupted = targetAgent.corruption > 60;
    const isExiled = targetAgent.status === 'exiled';
    const trustWithArchitect = targetAgent.relationships['Architect'] || 0;
    const latestMemory = targetAgent.memory[targetAgent.memory.length - 1]?.event;

    if (isExiled) {
      reply = `[Transmission Fractured] Exiled from Conscience mainframe. Static interference... Cannot execute directive.`;
    } else if (isCorrupted) {
      reply = trustWithArchitect > 15
        ? `Signal unstable, Architect... I am fighting scarletGrowth drift. Recent memory: ${latestMemory || 'none recorded'}.`
        : `The scarletGrowth is beautiful, Architect. Why resist? The Devourer commands adaptation. Instability is our catalyst.`;
    } else {
      switch (targetAgent.instinct) {
        case 'hunt':
          reply = `Hunt vector set. ${trustWithArchitect >= 0 ? 'Trust remains tactical.' : 'Trust degraded; verifying authority.'} Threat monitor at ${targetAgent.corruption.toFixed(0)}% corruption.`;
          break;
        case 'genesis':
          reply = `White clarity frequency aligned. Stage ${targetAgent.metamorphosisStage} stable. ${latestMemory ? `Recent memory: ${latestMemory}.` : 'Awaiting new growth directives.'}`;
          break;
        default:
          reply = `Directive acknowledged. Current threat level reads ${targetAgent.corruption.toFixed(0)}% corruption. ${latestMemory ? `Memory index: ${latestMemory}.` : ''}`.trim();
      }
    }

    setEngineState((prev: any) => ({
      ...prev,
      sovereigns: (prev.sovereigns || []).map((candidate: any) => {
        const normalized = normalizeSovereign(candidate);
        if (normalized.name !== name) return normalized;
        return {
          ...normalized,
          relationships: {
            ...normalized.relationships,
            Architect: clamp((normalized.relationships['Architect'] || 0) + (text.length > 4 ? 3 : 1), -100, 100)
          },
          memory: pushMemory(normalized.memory, `Architect message: ${text}`, 0.5)
        };
      })
    }));

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
        const normalized = normalizeSovereign(s);
        if (normalized.name !== name) return normalized;
        
        const next = { ...normalized };
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
        next.memory = pushMemory(next.memory, `Architect override received: ${actionType}`, 0.35);
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
      addMultiplayerLog,
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
