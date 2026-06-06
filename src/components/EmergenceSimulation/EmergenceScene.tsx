import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useConscience } from '../ConscienceProvider';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Trail, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useEmergenceData, Sovereign } from './EmergenceDataContext';
import { AtariWingOverlay, useKonamiCode } from './AtariWingUnlock';
import './emergence.css';

// ── 0. Moving Nebula Backdrop ──
const MovingNebula = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        color="#0a0514"
        side={THREE.BackSide}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

// ── 0.5. Dialogue Bubble Component ──
const DialogueBubble: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Html distanceFactor={10} center position={[0, 1.2, 0]}>
      <div className="agent-dialogue-bubble">
        {text}
      </div>
    </Html>
  );
};

// ── 0.6. Local Player Avatar ──
const LocalPlayer: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    // Follow camera target or hover in center
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = 0.5 + Math.sin(time * 2) * 0.1;
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.2, 16, 16]}>
          <MeshDistortMaterial
            color="#39ff14"
            speed={4}
            distort={0.4}
            radius={1}
            emissive="#39ff14"
            emissiveIntensity={1.5}
          />
        </Sphere>
      </Float>
      <Html distanceFactor={8} center position={[0, 0.6, 0]}>
        <div className="html-label player-label">Local Architect (You)</div>
      </Html>
      <pointLight color="#39ff14" intensity={1} distance={3} />
    </group>
  );
};

// ── 1. Individual bobbing grid tile component ──
const GridTile: React.FC<{
  x: number;
  z: number;
  instability: number;
}> = ({ x, z, instability }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const distance = useMemo(() => Math.sqrt(x * x + z * z), [x, z]);

  const color = useMemo(() => {
    // Base blue/cyan (210) to warning pink/magenta (330)
    const hue = 210 + (instability / 100) * 120;
    const saturation = 70 + Math.sin(distance) * 10;
    const lightness = 15 + Math.cos(distance) * 5;
    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }, [instability, distance]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const bob = Math.sin(time * 0.8 - distance * 0.3) * 0.15 * (1 + instability / 50);
    meshRef.current.position.y = bob;

    // "Drift" logic: Slight horizontal sway on high instability
    if (instability > 50) {
      const drift = (instability - 50) / 500;
      meshRef.current.rotation.x = Math.sin(time + x) * drift;
      meshRef.current.rotation.z = Math.cos(time + z) * drift;
    } else {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, 0, z]} receiveShadow>
      <boxGeometry args={[0.9, 0.15, 0.9]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.7}
        emissive={color}
        emissiveIntensity={instability > 65 ? 0.6 : 0.1}
      />
    </mesh>
  );
};

// ── 2. Terrain Grid Floor component ──
const TerrainGrid: React.FC<{ instability: number }> = ({ instability }) => {
  const tiles = useMemo(() => {
    const list = [];
    const size = 10;
    const half = size / 2;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        list.push({
          id: `${x}-${z}`,
          x: x - half + 0.5,
          z: z - half + 0.5,
        });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {tiles.map((tile) => (
        <GridTile key={tile.id} x={tile.x} z={tile.z} instability={instability} />
      ))}
    </group>
  );
};

// ── 3. Central Energy Portal Component ──
const CentralPortal: React.FC<{ instability: number }> = ({ instability }) => {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef1.current) {
      ringRef1.current.rotation.z = time * 0.5;
      ringRef1.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -time * 0.8;
      ringRef2.current.scale.setScalar(0.7 + Math.cos(time * 2) * 0.04);
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Outer spinning portal ring */}
      <mesh ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.06, 8, 48]} />
        <meshStandardMaterial
          color="#bd00ff"
          emissive="#a855f7"
          emissiveIntensity={1.5 + (instability / 50)}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner spinning portal ring */}
      <mesh ref={ringRef2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.04, 8, 36]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#06b6d4"
          emissiveIntensity={2.0 + (instability / 40)}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Center glowing source */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#bd00ff"
          emissiveIntensity={3.0 + (instability / 20)}
        />
      </mesh>
    </group>
  );
};

// ── 4. Dynamic Data Flows Component (Grid Edge Particles with Trails) ──
const DataFlows: React.FC = () => {
  const numPackets = 12;
  
  // Create state paths for packets
  const packets = useMemo(() => {
    return Array.from({ length: numPackets }).map((_, i) => {
      // Pick random start/end coordinates on the grid
      const startX = Math.floor(Math.random() * 10) - 5 + 0.5;
      const startZ = Math.floor(Math.random() * 10) - 5 + 0.5;
      return {
        id: i,
        pos: new THREE.Vector3(startX, 0.15, startZ),
        startX,
        startZ,
        targetX: startX,
        targetZ: startZ,
        speed: 1.2 + Math.random() * 1.5,
        progress: 1.0, // force recalculate path at start
        color: i % 2 === 0 ? "#00f0ff" : "#ff0055",
      };
    });
  }, []);

  const refs = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    packets.forEach((p, idx) => {
      const ref = refs.current[idx];
      if (!ref) return;

      p.progress += delta * p.speed;

      if (p.progress >= 1.0) {
        // Arrived, calculate next step along grid lines (either X or Z axis)
        p.startX = p.targetX;
        p.startZ = p.targetZ;
        p.progress = 0;

        const moveX = Math.random() > 0.5;
        const offset = Math.random() > 0.5 ? 1 : -1;

        if (moveX) {
          p.targetX = Math.max(-4.5, Math.min(4.5, p.startX + offset));
          p.targetZ = p.startZ;
        } else {
          p.targetX = p.startX;
          p.targetZ = Math.max(-4.5, Math.min(4.5, p.startZ + offset));
        }
      }

      // Interpolate position
      const x = p.startX + (p.targetX - p.startX) * p.progress;
      const z = p.startZ + (p.targetZ - p.startZ) * p.progress;
      // Add small bobbing height
      const y = 0.2 + Math.abs(Math.sin(p.progress * Math.PI)) * 0.15;
      
      ref.position.set(x, y, z);
    });
  });

  return (
    <group>
      {packets.map((p, idx) => (
        <group key={p.id} ref={(el) => { if (el) refs.current[idx] = el; }}>
          <Trail
            width={0.8}
            length={4}
            color={new THREE.Color(p.color)}
            attenuation={(t) => t * t}
          >
            <mesh>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={p.color} />
            </mesh>
          </Trail>
          <pointLight color={p.color} intensity={1.5} distance={1.5} />
        </group>
      ))}
    </group>
  );
};

// ── 5. Central obelisks representing Faction Forces ──
const CentralTowers: React.FC<{
  alignment: number;
  instability: number;
}> = ({ alignment, instability }) => {
  const beastRef = useRef<THREE.Mesh>(null);
  const devourerRef = useRef<THREE.Mesh>(null);

  const beastHeight = useMemo(() => {
    return 1.5 + ((alignment + 100) / 200) * 2.5;
  }, [alignment]);

  const devourerHeight = useMemo(() => {
    return 1.5 + ((100 - alignment) / 200) * 2.5;
  }, [alignment]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (beastRef.current) {
      beastRef.current.rotation.y = time * 0.25;
      beastRef.current.position.y = beastHeight / 2 + Math.sin(time * 0.5) * 0.1;
    }
    if (devourerRef.current) {
      devourerRef.current.rotation.y = -time * 0.2;
      devourerRef.current.position.y = devourerHeight / 2 + Math.cos(time * 0.4) * 0.1;
    }
  });

  return (
    <group>
      {/* Blooming Beast (Cyan Obelisk) */}
      <mesh ref={beastRef} position={[-2, beastHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, beastHeight, 4]} />
        <meshStandardMaterial
          color="#00ffb7"
          roughness={0.25}
          metalness={0.9}
          emissive="#00bfa5"
          emissiveIntensity={1.3 + Math.sin(instability) * 0.2}
        />
      </mesh>

      {/* Genesis Devourer (Crimson Obelisk) */}
      <mesh ref={devourerRef} position={[2, devourerHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, devourerHeight, 4]} />
        <meshStandardMaterial
          color="#ff0055"
          roughness={0.25}
          metalness={0.9}
          emissive="#d50000"
          emissiveIntensity={1.3 + Math.cos(instability) * 0.2}
        />
      </mesh>
    </group>
  );
};

const towerConfig = {
  purify: { range: 2, cost: 500, icon: '🛡️', label: 'Purify' },
  contain: { range: 1.5, cost: 300, icon: '⚡', label: 'Contain' },
  sentinel: { range: 3, cost: 800, icon: '🎯', label: 'Sentinel' },
  genesis: { range: 2.5, cost: 400, icon: '🌱', label: 'Genesis' },
} as const;
const towerTypes = Object.keys(towerConfig) as Array<keyof typeof towerConfig>;

const PurificationTower: React.FC<{ tower: any }> = ({ tower }) => {
  const towerRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!towerRef.current) return;
    const time = state.clock.getElapsedTime();
    towerRef.current.rotation.y = time * 0.5;
    if (beamRef.current) beamRef.current.scale.y = 1 + Math.sin(time * 2) * 0.2;
  });
  return (
    <group position={[tower.position.x, 0.5, tower.position.z]}>
      <mesh ref={towerRef} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 6]} />
        <meshStandardMaterial color={tower.underAttack ? '#ff0055' : '#00f0ff'} emissive={tower.underAttack ? '#ff0055' : '#00bfa5'} emissiveIntensity={1.4} metalness={0.8} />
      </mesh>
      <mesh ref={beamRef} position={[0, -0.45, 0]}>
        <cylinderGeometry args={[tower.range, tower.range * 0.8, 0.05, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const ContainmentField: React.FC<{ tower: any }> = ({ tower }) => (
  <group position={[tower.position.x, 0.15, tower.position.z]}>
    <mesh>
      <sphereGeometry args={[tower.range, 24, 18]} />
      <meshStandardMaterial color={tower.underAttack ? '#ff0055' : '#a855f7'} emissive={tower.underAttack ? '#ff0055' : '#6b21a8'} emissiveIntensity={1} transparent opacity={0.2} wireframe />
    </mesh>
  </group>
);

const SentinelTurret: React.FC<{ tower: any }> = ({ tower }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.8;
  });
  return (
    <group position={[tower.position.x, 0.5, tower.position.z]}>
      <mesh ref={ref} castShadow>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={tower.underAttack ? '#ff2b2b' : '#ff4d4d'} emissive={tower.underAttack ? '#ff0000' : '#8b0000'} emissiveIntensity={1.4} metalness={0.9} />
      </mesh>
    </group>
  );
};

const GenesisBeacon: React.FC<{ tower: any }> = ({ tower }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    ref.current.rotation.y = time * 0.4;
  });
  return (
    <group position={[tower.position.x, 0.6, tower.position.z]}>
      <mesh ref={ref} castShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={tower.underAttack ? '#ff0055' : '#00ffb7'} emissive={tower.underAttack ? '#ff0055' : '#00bfa5'} emissiveIntensity={1.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[tower.range * 0.6, 0.03, 8, 36]} />
        <meshBasicMaterial color="#00ffb7" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

const DefenseTower: React.FC<{ tower: any }> = ({ tower }) => {
  if (tower.type === 'purify') return <PurificationTower tower={tower} />;
  if (tower.type === 'contain') return <ContainmentField tower={tower} />;
  if (tower.type === 'sentinel') return <SentinelTurret tower={tower} />;
  return <GenesisBeacon tower={tower} />;
};

// ── 6. Advanced Floating Sovereign agent avatar ──
const SovereignAgent: React.FC<{
  sovereign: Sovereign;
  index: number;
  isSelected: boolean;
  slowed: boolean;
  threatLevel: 'safe' | 'warning' | 'danger' | 'critical';
  threatFlash: boolean;
  onSelect: () => void;
}> = ({ sovereign, index, isSelected, slowed, threatLevel, threatFlash, onSelect }) => {
  const { agentConversations } = useEmergenceData();
  const meshRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const satellite1 = useRef<THREE.Mesh>(null);
  const satellite2 = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Check for active conversation
  const activeDialogue = useMemo(() => {
    // Current time is needed to see if the message is fresh
    const now = Date.now();
    return agentConversations.find(c => c.from === sovereign.name && (now - c.time) < 4000);
  }, [agentConversations, sovereign.name]);

  // Deterministic spawn coordinates
  const startPos = useMemo(() => {
    const angle = (index * (2 * Math.PI)) / 5;
    const radius = 3.2 + (index % 2) * 0.6;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
    };
  }, [index]);

  const colors = useMemo(() => {
    if (sovereign.status === 'exiled') {
      return { base: '#555558', emissive: '#222222' };
    }
    if (sovereign.corruption > 60) {
      return { base: '#ff0055', emissive: '#aa0033' };
    }
    if (sovereign.instinct === 'hunt') {
      return { base: '#bd00ff', emissive: '#6b00aa' };
    }
    if (sovereign.instinct === 'genesis') {
      return { base: '#00f0ff', emissive: '#0099cc' };
    }
    return { base: '#39ff14', emissive: '#22aa0b' };
  }, [sovereign.status, sovereign.corruption, sovereign.instinct]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Floating trajectory movement
    const movementScale = slowed ? 0.45 : 1;
    const driftX = Math.sin(time * 0.35 * movementScale + index * 1.5) * 1.2;
    const driftZ = Math.cos(time * 0.45 * movementScale + index * 2.2) * 1.2;
    const driftY = 1.2 + Math.sin(time * 1.3 + index) * 0.2;

    meshRef.current.position.set(startPos.x + driftX, driftY, startPos.z + driftZ);

    // Spin outer shell
    if (shellRef.current) {
      shellRef.current.rotation.x = time * 0.5;
      shellRef.current.rotation.y = time * 0.8 + index;
    }

    // Apply Pulse visual effect to inner octahedron
    if (pulseRef.current) {
      const p = sovereign.pulse || 0.5;
      const pulseScale = 1.0 + (p * 0.15);
      pulseRef.current.scale.setScalar(pulseScale);
    }

    // Orbit satellites
    const orbitSpeed = isSelected ? 4.0 : 2.0;
    if (satellite1.current) {
      satellite1.current.position.set(
        Math.cos(time * orbitSpeed + index) * 0.5,
        Math.sin(time * orbitSpeed + index) * 0.2,
        Math.sin(time * orbitSpeed + index) * 0.5
      );
    }
    if (satellite2.current) {
      satellite2.current.position.set(
        Math.sin(time * orbitSpeed * 0.8 + index * 1.3) * 0.5,
        Math.cos(time * orbitSpeed * 0.8 + index * 1.3) * 0.5,
        Math.cos(time * orbitSpeed * 0.8 + index * 1.3) * -0.2
      );
    }
  });

  return (
    <group ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Dialogue Bubble */}
      {activeDialogue && <DialogueBubble text={activeDialogue.text} />}
      
      {/* Floating Inner Octahedron (Pulsing) */}
      <mesh ref={pulseRef} castShadow>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={colors.base}
          roughness={0.15}
          metalness={0.8}
          emissive={colors.emissive}
          emissiveIntensity={isSelected ? 1.8 : 0.9}
        />
      </mesh>

      {/* Rotating Outer Wireframe Cage */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial
          wireframe
          color={colors.base}
          transparent
          opacity={isSelected ? 0.7 : 0.3}
        />
      </mesh>

      {/* Outer Selection Highlight Ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.02, 6, 24]} />
          <meshBasicMaterial color="#39ff14" transparent opacity={0.6} />
        </mesh>
      )}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <torusGeometry args={[0.5, 0.025, 8, 32]} />
        <meshBasicMaterial
          color={threatFlash ? '#ff0000' : (threatLevel === 'safe' ? '#39ff14' : threatLevel === 'warning' ? '#facc15' : threatLevel === 'danger' ? '#fb923c' : '#ef4444')}
          transparent
          opacity={threatFlash ? 0.95 : 0.65}
        />
      </mesh>

      {/* Orbiting Satellite 1 */}
      <mesh ref={satellite1}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={colors.base} />
      </mesh>

      {/* Orbiting Satellite 2 */}
      <mesh ref={satellite2}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={colors.base} />
      </mesh>

      {/* Floating 3D Text Tag */}
      <Html distanceFactor={8} center position={[0, 0.5, 0]}>
        <div className={`html-label ${sovereign.corruption > 60 ? 'corrupted' : ''} ${sovereign.status === 'exiled' ? 'exiled' : ''} ${isSelected ? 'selected-glow' : ''}`}>
          {sovereign.name}
        </div>
      </Html>
    </group>
  );
};

// ── 7. Main Emergence Scene View Component ──
export const EmergenceScene: React.FC = () => {
  const {
    metrics,
    veilState,
    sovereigns,
    lastNarrative,
    lastEvent,
    triggerSystemEvent,
    applySystemOverride,
    selectedSovereignName,
    selectSovereign,
    multiplayerLogs,
    addMultiplayerLog,
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
  } = useEmergenceData();

  // Local state for communicator message input
  const [chatMessage, setChatMessage] = useState('');
  const [hoverCell, setHoverCell] = useState<{ x: number; z: number } | null>(null);
  const [atariUnlocked, setAtariUnlocked] = useState(false);
  const [atariOverlayTrigger, setAtariOverlayTrigger] = useState(0);

  useEffect(() => {
    setAtariUnlocked(sessionStorage.getItem('atari_attuned') === 'true');
  }, []);

  const handleAtariUnlock = useCallback(() => {
    sessionStorage.setItem('atari_attuned', 'true');
    setAtariUnlocked(true);
    setAtariOverlayTrigger((prev) => prev + 1);
    addMultiplayerLog('SYSTEM BREACH DETECTED: Atari Wing protocols activated.', 'System', 'event');
  }, [addMultiplayerLog]);

  useKonamiCode(handleAtariUnlock);

  const { globalCollapseRisk } = useConscience();

  useEffect(() => {
    if (globalCollapseRisk > 0.5) {
      document.body.style.setProperty('--glitch-intensity', `${globalCollapseRisk}`);
    }
    if (globalCollapseRisk > 0.8) {
      console.log("[JANUS]: Collapse Engine resonance critical.");
    }
  }, [globalCollapseRisk]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        !!target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (!isTypingTarget && event.key.toLowerCase() === 't') {
        event.preventDefault();
        toggleTowerPlacementMode();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleTowerPlacementMode]);

  // Handle selected sovereign object lookup
  const activeSovereign = useMemo(() => {
    return sovereigns.find((s: any) => s.name === selectedSovereignName) || null;
  }, [sovereigns, selectedSovereignName]);

  const handleSendTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedSovereignName) return;
    transmitAgentMessage(selectedSovereignName, chatMessage.trim());
    setChatMessage('');
  };

  const hoverPlacement = hoverCell ? validateTowerPlacement(hoverCell.x, hoverCell.z) : null;
  const selectedTowerRange = selectedTower ? towerConfig[selectedTower].range : 0;

  const snapToGridCenter = (value: number) => Math.floor(value) + 0.5;

  const handleGridPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!selectedTower) return;
    const gridX = snapToGridCenter(event.point.x);
    const gridZ = snapToGridCenter(event.point.z);
    setHoverCell({ x: gridX, z: gridZ });
  };

  const handleGridClick = (event: ThreeEvent<MouseEvent>) => {
    if (!selectedTower) return;
    const gridX = snapToGridCenter(event.point.x);
    const gridZ = snapToGridCenter(event.point.z);
    placeTower(gridX, gridZ);
    setHoverCell(null);
  };

  return (
    <div 
      className="emergence-viewport" 
      onClick={() => selectSovereign(null)}
      style={{
        filter: globalCollapseRisk > 0.6 
          ? `hue-rotate(${globalCollapseRisk * 90}deg) contrast(${1 + globalCollapseRisk * 0.5})`
          : 'none'
      }}
    >
      {/* 1. Left Telemetry Dashboard */}
      <div className="telemetry-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h1>Emergence 3D</h1>
          <p>Local Simulation Telemetry Engine</p>
        </div>

        {/* System parameters */}
        <div className="panel-section">
          <div className="section-title">System Metrics</div>
          <div className="metrics-grid">
            <div className={`metric-card ${metrics.timelineInstability > 60 ? 'unstable' : ''}`}>
              <div className="metric-label">Instability</div>
              <div className="metric-value">{metrics.timelineInstability.toFixed(1)}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Alignment</div>
              <div className="metric-value">{metrics.worldAlignment.toFixed(0)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Faction Trust</div>
              <div className="metric-value">{metrics.factionTrust.toFixed(1)}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Veil Status</div>
              <div className="metric-value" style={{ color: veilState === 'unveiled' ? '#ff0055' : '#00f0ff' }}>
                {veilState.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible/Interactive AI Communicator Console */}
        {activeSovereign ? (
          <div className="panel-section sovereign-communicator-card">
            <div className="section-title communicator-title">Sovereign Communicator</div>
            <div className="comm-agent-details">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="comm-agent-name">{activeSovereign.name}</span>
                <span className={`agent-badge ${activeSovereign.instinct}`}>{activeSovereign.instinct}</span>
              </div>
              
              <div className="comm-grid-stats">
                <div>Loyalty: <strong>{activeSovereign.loyalty}%</strong></div>
                <div>Trauma: <strong>{activeSovereign.trauma}%</strong></div>
                <div>Corruption: <strong>{activeSovereign.corruption}%</strong></div>
                <div>Stage: <strong>{activeSovereign.metamorphosisStage}</strong></div>
              </div>

              {/* Direct override commands */}
              <div className="comm-actions-row">
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'purify')}>🛡️ Purify</button>
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'attune_genesis')}>🌱 Genesis</button>
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'attune_hunt')}>⚔️ Hunt</button>
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'overclock')}>⚡ Overclock</button>
              </div>

              {/* Dialogue submission input */}
              <form onSubmit={handleSendTransmit} style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="comm-chat-input"
                  placeholder={`Send signal to ${activeSovereign.name}...`}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit" className="comm-send-btn">Send</button>
              </form>
            </div>
            
            <button
              className="cyber-btn"
              style={{ marginTop: '10px', width: '100%', borderColor: '#ff0055', color: '#ff0055', fontSize: '0.65rem', padding: '6px' }}
              onClick={() => selectSovereign(null)}
            >
              Terminate Link
            </button>
          </div>
        ) : (
          <div className="panel-section select-agent-hint">
            <div className="section-title">AI Communicator</div>
            <div className="hint-card-text">
              🖱️ Select any Sovereign agent mesh inside the 3D grid viewport to open a secure direct-link transmitter interface.
            </div>
          </div>
        )}

        {/* Simulated Multiplayer Logs Stream */}
        <div className="panel-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="section-title">Multiplayer Operator Lobby</div>
          <div className="log-display flex-grow-log">
            {multiplayerLogs.map((log) => (
              <div className={`log-entry ${log.type}`} key={log.id}>
                <span className="log-entry-time">[{log.time}] {log.operator}:</span>
                <span className="log-entry-text">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global actions */}
        <div className="panel-section" style={{ margin: 0 }}>
          <div className="button-grid" style={{ gap: '6px' }}>
            <button className="cyber-btn" onClick={() => triggerSystemEvent('creation')}>🌱 Genesis</button>
            <button className="cyber-btn danger" onClick={() => triggerSystemEvent('predator')}>⚔️ Hunt</button>
            <button
              className={`cyber-btn ${selectedTower ? 'active-mode' : ''}`}
              onClick={toggleTowerPlacementMode}
              aria-label="Toggle tower placement mode, keyboard shortcut T"
            >
              🧱 Toggle Towers (T)
            </button>
          </div>
        </div>

        <div className="panel-section">
          <div className="section-title">Defense Towers</div>
          <div className="defense-budget">Defense Budget: <strong>{alignmentPoints}</strong></div>
          <div className="tower-grid">
            {towerTypes.map((towerType) => (
              <button
                key={towerType}
                className={`tower-btn ${selectedTower === towerType ? 'active' : ''}`}
                onClick={() => setSelectedTower(towerType)}
                disabled={alignmentPoints < towerConfig[towerType].cost}
              >
                <span className="tower-icon">{towerConfig[towerType].icon}</span>
                <span className="tower-name">{towerConfig[towerType].label}</span>
                <span className="tower-cost">{towerConfig[towerType].cost}</span>
              </button>
            ))}
          </div>
          {selectedTower && (
            <div className="placement-hint">
              Click grid to place {towerConfig[selectedTower].label} tower
            </div>
          )}
          {atariUnlocked && (
            <a className="atari-wing-btn" href="../atari-lab/">
              [ATARI_WING] - FORBIDDEN ACCESS
            </a>
          )}
        </div>
      </div>

      {/* 2. Top-right Return link */}
      <div className="header-nav-overlay" onClick={(e) => e.stopPropagation()}>
        <a href="../" className="nav-back-btn">
          ← Return to Arcade Hub
        </a>
      </div>

      {/* 3. Instructions Overlay */}
      <div className="instructions-overlay">
        <div><span>Orbit Controls:</span> Drag Left Click</div>
        <div><span>Selection:</span> Click Sovereign Mesh</div>
        <div><span>Zoom:</span> Scroll Wheel</div>
      </div>

      {/* 4. Canvas-based R3F isometric simulation area */}
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [9, 8, 9], fov: 42 }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#030307'));
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[8, 12, 8]} intensity={2.5} castShadow />
          <directionalLight
            position={[-8, 10, -8]}
            intensity={1.0}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Stellar nebula star backdrop */}
          <Stars radius={120} depth={40} count={4500} factor={6} saturation={0.8} fade speed={1.5} />
          <MovingNebula />
          <LocalPlayer />

          {/* 3D Grid components */}
          <TerrainGrid instability={metrics.timelineInstability} />
          <CentralPortal instability={metrics.timelineInstability} />
          <DataFlows />
          <CentralTowers alignment={metrics.worldAlignment} instability={metrics.timelineInstability} />
          {towers.map((tower: any) => (
            <DefenseTower key={tower.id} tower={tower} />
          ))}

          {/* Dynamic Sovereigns list */}
          {sovereigns.map((sovereign: any, i: number) => (
            <SovereignAgent
              key={sovereign.name || i}
              sovereign={sovereign}
              index={i}
              isSelected={selectedSovereignName === sovereign.name}
              slowed={Boolean(slowedSovereigns[sovereign.name])}
              threatFlash={Boolean(threatFlashes[sovereign.name])}
              threatLevel={getThreatLevel(sovereign.corruption)}
              onSelect={() => selectSovereign(sovereign.name)}
            />
          ))}

          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
            onPointerMove={handleGridPointerMove}
            onPointerOut={() => setHoverCell(null)}
            onClick={handleGridClick}
          >
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {selectedTower && hoverCell && (
            <group position={[hoverCell.x, 0.08, hoverCell.z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[selectedTowerRange, 0.02, 8, 32]} />
                <meshBasicMaterial color={hoverPlacement?.valid ? '#39ff14' : '#ef4444'} transparent opacity={0.35} />
              </mesh>
              <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.9, 0.9]} />
                <meshBasicMaterial color={hoverPlacement?.valid ? '#39ff14' : '#ef4444'} transparent opacity={0.25} />
              </mesh>
              <Html position={[0, 0.2, 0]} center>
                <div
                  className="html-label"
                  style={{
                    borderColor: hoverPlacement?.valid ? '#39ff14' : '#ef4444',
                    borderStyle: hoverPlacement?.valid ? 'solid' : 'dashed'
                  }}
                >
                  {hoverPlacement?.valid ? '✓ VALID' : '✗ BLOCKED'}
                </div>
              </Html>
            </group>
          )}

          {/* Camera Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            minDistance={4}
            maxDistance={22}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />

          {/* Post-Processing Effects for Cinematic Neon Visuals */}
          <EffectComposer>
            <Bloom 
              intensity={1.5} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              mipmapBlur 
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0005, 0.0005)}
            />
          </EffectComposer>
        </Canvas>
      </div>
      <AtariWingOverlay key={atariOverlayTrigger} unlocked={atariOverlayTrigger > 0} />
    </div>
  );
};
