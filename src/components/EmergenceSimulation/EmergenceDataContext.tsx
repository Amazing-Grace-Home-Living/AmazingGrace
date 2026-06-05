import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// @ts-ignore
import { runIntelligentEngineCycle, createInitialIntelligentEngineState } from '../../../js/intelligent-engine.js';
// @ts-ignore
import { createOmniversalRuntime, createWorldState } from '../../../js/omniversal-runtime.js';

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
  x?: number;
  z?: number;
  isSlowed?: boolean;
  hadCriticalCorruption?: boolean;
}

export interface DeployedTower {
  id: string;
  type: 'purification' | 'containment' | 'sentinel' | 'genesis' | string;
  x: number;
  z: number;
  range: number;
}

export const getAgentPosition = (index: number, t: number, isSlowed?: boolean) => {
  const angle = (index * (2 * Math.PI)) / 5;
  const radius = 3.2 + (index % 2) * 0.6;
  const startX = Math.cos(angle) * radius;
  const startZ = Math.sin(angle) * radius;
  
  const speed = isSlowed ? 0.08 : 0.35;
  const driftX = Math.sin(t * speed + index * 1.5) * 1.2;
  const driftZ = Math.cos(t * speed + index * 2.2) * 1.2;
  
  return { x: startX + driftX, z: startZ + driftZ };
};

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
  selectedSovereignName: string | null;
  selectSovereign: (name: string | null) => void;
  multiplayerLogs: Array<{ id: string; time: string; text: string; operator: string; type: string }>;
  agentConversations: Array<{ id: string; from: string; to: string; text: string; time: number }>;
  transmitAgentMessage: (name: string, text: string) => void;
  applyAgentOverride: (name: string, actionType: string) => void;
  // Tower Defense states
  alignmentPoints: number;
  deployedTowers: DeployedTower[];
  placementMode: string | null;
  setPlacementMode: (mode: string | null) => void;
  deployTower: (type: string, x: number, z: number) => boolean;
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
  const [agentConversations, setAgentConversations] = useState<Array<{ id: string; from: string; to: string; text: string; time: number }>>([]);

  // Tower Defense states
  const [alignmentPoints, setAlignmentPoints] = useState(1000);
  const [deployedTowers, setDeployedTowers] = useState<DeployedTower[]>([]);
  const [placementMode, setPlacementMode] = useState<string | null>(null);

  const deployedTowersRef = useRef<DeployedTower[]>([]);
  deployedTowersRef.current = deployedTowers;

  const alignmentPointsRef = useRef<number>(1000);
  alignmentPointsRef.current = alignmentPoints;

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

        // Economy tick
        const currentAlign = nextRender.metrics.worldAlignment;
        if (currentAlign > 0) {
          setAlignmentPoints(prev => prev + 50);
        } else if (currentAlign < 0) {
          setAlignmentPoints(prev => Math.max(0, prev - 30));
        }

        // Run engine cycle on the intelligent engine using runtime metrics as pressures
        setEngineState((prev: any) => {
          const pressures = {
            sovereignPressure: (nextRender.metrics.sovereignAffinity / 100) * 1.5,
            factionConflict: (50 - nextRender.metrics.factionTrust) / 100 * 2,
            apexInfluence: nextRender.veilState === 'unveiled' ? 3.0 : 1.0,
            stabilityResistance: (nextRender.metrics.timelineInstability / 100) * 0.8,
          };
          const { state: nextEngine } = runIntelligentEngineCycle(prev, pressures, 1);
          
          const t = Date.now() / 1000;
          const activeTowers = deployedTowersRef.current;
          const timeString = new Date().toTimeString().split(' ')[0];

          // Update sovereigns with coordinates & tower interaction effects
          nextEngine.sovereigns = nextEngine.sovereigns.map((s: any, i: number) => {
            const prevAgent = prev.sovereigns[i] || s;
            const agentPos = getAgentPosition(i, t);
            let nextAgent = { ...s, x: agentPos.x, z: agentPos.z, isSlowed: false };

            if (prevAgent.hadCriticalCorruption !== undefined) {
              nextAgent.hadCriticalCorruption = prevAgent.hadCriticalCorruption;
            }

            if (nextAgent.corruption > 85) {
              nextAgent.hadCriticalCorruption = true;
            }

            // Deduct penalty when agent hits 100% corruption
            if (prevAgent.corruption < 100 && nextAgent.corruption === 100) {
              setAlignmentPoints(prevPts => Math.max(0, prevPts - 200));
              setMultiplayerLogs(prevLogs => [
                ...prevLogs,
                {
                  id: `penalty-${Date.now()}-${nextAgent.name}`,
                  time: timeString,
                  operator: 'System Alert',
                  text: `Agent ${nextAgent.name} went full 100% corruption! -200 alignment points penalty.`,
                  type: 'event'
                }
              ].slice(-30));
            }

            // Tower effect updates
            activeTowers.forEach(tower => {
              const dx = agentPos.x - tower.x;
              const dz = agentPos.z - tower.z;
              const dist = Math.sqrt(dx * dx + dz * dz);
              if (dist <= tower.range) {
                if (tower.type === 'purification') {
                  nextAgent.corruption = Math.max(0, nextAgent.corruption - 5);
                  if (nextAgent.hadCriticalCorruption && nextAgent.corruption < 50) {
                    nextAgent.hadCriticalCorruption = false;
                    setAlignmentPoints(prevPts => prevPts + 100);
                    setMultiplayerLogs(prevLogs => [
                      ...prevLogs,
                      {
                        id: `purify-bonus-${Date.now()}-${nextAgent.name}`,
                        time: timeString,
                        operator: 'Defense Grid',
                        text: `Purification Tower successfully cleansed ${nextAgent.name}! +100 alignment points bonus.`,
                        type: 'event'
                      }
                    ].slice(-30));
                  }
                } else if (tower.type === 'containment') {
                  if (nextAgent.corruption > 60) {
                    nextAgent.isSlowed = true;
                    nextAgent.fear = Math.max(0, nextAgent.fear - 5);
                  }
                } else if (tower.type === 'sentinel') {
                  if (nextAgent.corruption === 100 && nextAgent.status !== 'exiled') {
                    nextAgent.status = 'exiled';
                    setMultiplayerLogs(prevLogs => [
                      ...prevLogs,
                      {
                        id: `sentinel-exile-${Date.now()}-${nextAgent.name}`,
                        time: timeString,
                        operator: 'Defense Grid',
                        text: `Sentinel Turret auto-exiled corrupted agent ${nextAgent.name}!`,
                        type: 'command'
                      }
                    ].slice(-30));
                  }
                } else if (tower.type === 'genesis') {
                  if (nextAgent.instinct === 'genesis') {
                    nextAgent.loyalty = Math.min(100, nextAgent.loyalty + 10);
                  }
                }
              }
            });

            // Inject dynamic pulse data for the 3D visualization
            const frequency = 0.5 + (nextAgent.metamorphosisStage * 0.5) + (nextAgent.corruption / 50);
            nextAgent.pulse = (Math.sin(t * Math.PI * frequency) + 1) / 2;

            return nextAgent;
          });

          return nextEngine;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engineState]);

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
      ].slice(-30));
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

  // 6. Direct AI Selection & Interaction functions
  const selectSovereign = (name: string | null) => {
    setSelectedSovereignName(name);
  };

  const transmitAgentMessage = (name: string, text: string) => {
    const timeString = new Date().toTimeString().split(' ')[0];
    const targetAgent = engineState.sovereigns.find((s: any) => s.name === name);
    if (!targetAgent) return;

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
          next.metamorphosisStage = (next.metamorphosisStage || 1) + 1;
          next.adaptation = Math.min(100, next.adaptation + 25);
        } else if (actionType === 'neutralize') {
          next.corruption = Math.max(0, next.corruption - 20);
        }
        return next;
      });

      return { ...prev, sovereigns: nextSovereigns };
    });

    setMultiplayerLogs((prev) => [
      ...prev,
      {
        id: `override-${Date.now()}`,
        time: timeString,
        operator: 'You (Local Architect)',
        text: `Transmitted direct override [${actionType.toUpperCase()}] to Sovereign ${name}`,
        type: 'command'
      }
    ].slice(-30));
  };

  const deployTower = (type: string, x: number, z: number) => {
    let cost = 0;
    let range = 0;
    switch (type) {
      case 'purification':
        cost = 500;
        range = 2.0;
        break;
      case 'containment':
        cost = 300;
        range = 1.5;
        break;
      case 'sentinel':
        cost = 800;
        range = 3.0;
        break;
      case 'genesis':
        cost = 400;
        range = 2.5;
        break;
      default:
        return false;
    }

    if (alignmentPointsRef.current < cost) {
      return false;
    }

    const occupied = deployedTowersRef.current.some(t => Math.abs(t.x - x) < 0.1 && Math.abs(t.z - z) < 0.1);
    if (occupied) {
      return false;
    }

    setAlignmentPoints(prev => prev - cost);
    const newTower: DeployedTower = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      z,
      range
    };
    setDeployedTowers(prev => [...prev, newTower]);

    const timeString = new Date().toTimeString().split(' ')[0];
    setMultiplayerLogs(prev => [
      ...prev,
      {
        id: `deploy-${Date.now()}`,
        time: timeString,
        operator: 'You (Architect)',
        text: `Deployed ${type.charAt(0).toUpperCase() + type.slice(1)} Tower at [${x.toFixed(1)}, ${z.toFixed(1)}]`,
        type: 'command'
      }
    ].slice(-30));

    return true;
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
      alignmentPoints,
      deployedTowers,
      placementMode,
      setPlacementMode,
      deployTower
    }}>
      {children}
    </EmergenceDataContext.Provider>
  );
};
