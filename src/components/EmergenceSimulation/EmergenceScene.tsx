import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Trail, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useEmergenceData, Sovereign, DeployedTower, getAgentPosition } from './EmergenceDataContext';
import './emergence.css';

// ── 0.1. Defensive Beam Effect ──
const DefensiveBeam: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}> = ({ from, to, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.x = 0.5 + Math.sin(state.clock.getElapsedTime() * 20) * 0.2;
    }
  });

  return (
    <mesh
      ref={ref}
      position={midpoint}
      quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())}
    >
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};

// ── 0.2. Specific Defensive Tower Renderers ──
const PurificationTower: React.FC<{ tower: DeployedTower; targetAgent: Sovereign | null; targetPos: { x: number; z: number } | null }> = ({ tower, targetAgent, targetPos }) => {
  const topRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (topRef.current) {
      topRef.current.rotation.y = state.clock.getElapsedTime() * 2.0;
    }
  });

  return (
    <group position={[tower.x, 0, tower.z]}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={topRef} position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00bcd4" emissiveIntensity={1.5} metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight position={[0, 0.8, 0]} color="#00f0ff" intensity={1.5} distance={4} />
      {targetAgent && targetPos && (
        <DefensiveBeam from={[tower.x, 0.75, tower.z]} to={[targetPos.x, 1.2, targetPos.z]} color="#00f0ff" />
      )}
    </group>
  );
};

const ContainmentField: React.FC<{ tower: DeployedTower; targetAgent: Sovereign | null; targetPos: { x: number; z: number } | null }> = ({ tower, targetAgent, targetPos }) => {
  const domeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (domeRef.current) {
      domeRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group position={[tower.x, 0, tower.z]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.2, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={domeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[tower.range, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#bd00ff" wireframe transparent opacity={0.15} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} color="#bd00ff" intensity={1.0} distance={3} />
      {targetAgent && targetPos && (
        <DefensiveBeam from={[tower.x, 0.1, tower.z]} to={[targetPos.x, 1.2, targetPos.z]} color="#bd00ff" />
      )}
    </group>
  );
};

const SentinelTurret: React.FC<{ tower: DeployedTower; targetAgent: Sovereign | null; targetPos: { x: number; z: number } | null }> = ({ tower, targetAgent, targetPos }) => {
  const topRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (topRef.current) {
      topRef.current.rotation.y = state.clock.getElapsedTime() * 3.0;
      topRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <group position={[tower.x, 0, tower.z]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={topRef} position={[0, 0.95, 0]}>
        <octahedronGeometry args={[0.22]} />
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2.0} metalness={0.8} roughness={0.1} />
      </mesh>
      <pointLight position={[0, 1.0, 0]} color="#ff0055" intensity={2.0} distance={5} />
      {targetAgent && targetPos && (
        <DefensiveBeam from={[tower.x, 0.95, tower.z]} to={[targetPos.x, 1.2, targetPos.z]} color="#ff0055" />
      )}
    </group>
  );
};

const GenesisBeacon: React.FC<{ tower: DeployedTower; targetAgent: Sovereign | null; targetPos: { x: number; z: number } | null }> = ({ tower, targetAgent, targetPos }) => {
  const dodecaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (dodecaRef.current) {
      dodecaRef.current.rotation.y = state.clock.getElapsedTime() * 1.0;
      const scale = 1.0 + Math.sin(state.clock.getElapsedTime() * 4.0) * 0.1;
      dodecaRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[tower.x, 0, tower.z]}>
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={dodecaRef} position={[0, 0.75, 0]}>
        <dodecahedronGeometry args={[0.18]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} metalness={0.7} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 0.8, 0]} color="#10b981" intensity={1.5} distance={4} />
      {targetAgent && targetPos && (
        <DefensiveBeam from={[tower.x, 0.75, tower.z]} to={[targetPos.x, 1.2, targetPos.z]} color="#10b981" />
      )}
    </group>
  );
};

// ── 0.3. Towers Container/Layer ──
const TowersLayer: React.FC = () => {
  const { deployedTowers, sovereigns } = useEmergenceData();

  return (
    <group>
      {deployedTowers.map((tower) => {
        let targetAgent: Sovereign | null = null;
        let targetPos: { x: number; z: number } | null = null;

        const activeSovereignsWithIndices = sovereigns
          .map((s, idx) => ({ s, idx }))
          .filter(({ s }) => s.status === 'active');

        let closestDist = Infinity;
        const t = Date.now() / 1000;

        activeSovereignsWithIndices.forEach(({ s, idx }) => {
          const pos = getAgentPosition(idx, t);
          const dx = pos.x - tower.x;
          const dz = pos.z - tower.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist <= tower.range) {
            let matches = false;
            if (tower.type === 'purification') {
              matches = s.corruption > 0;
            } else if (tower.type === 'containment') {
              matches = s.corruption > 60;
            } else if (tower.type === 'sentinel') {
              matches = s.corruption === 100;
            } else if (tower.type === 'genesis') {
              matches = s.instinct === 'genesis';
            }

            if (matches && dist < closestDist) {
              closestDist = dist;
              targetAgent = s;
              targetPos = pos;
            }
          }
        });

        if (tower.type === 'purification') {
          return <PurificationTower key={tower.id} tower={tower} targetAgent={targetAgent} targetPos={targetPos} />;
        }
        if (tower.type === 'containment') {
          return <ContainmentField key={tower.id} tower={tower} targetAgent={targetAgent} targetPos={targetPos} />;
        }
        if (tower.type === 'sentinel') {
          return <SentinelTurret key={tower.id} tower={tower} targetAgent={targetAgent} targetPos={targetPos} />;
        }
        if (tower.type === 'genesis') {
          return <GenesisBeacon key={tower.id} tower={tower} targetAgent={targetAgent} targetPos={targetPos} />;
        }
        return null;
      })}
    </group>
  );
};

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
  const { placementMode, alignmentPoints, deployedTowers, deployTower, setPlacementMode } = useEmergenceData();
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const distance = useMemo(() => Math.sqrt(x * x + z * z), [x, z]);

  const isOccupied = useMemo(() => {
    return deployedTowers.some(t => Math.abs(t.x - x) < 0.1 && Math.abs(t.z - z) < 0.1);
  }, [deployedTowers, x, z]);

  const towerCost = useMemo(() => {
    if (!placementMode) return 0;
    if (placementMode === 'purification') return 500;
    if (placementMode === 'containment') return 300;
    if (placementMode === 'sentinel') return 800;
    if (placementMode === 'genesis') return 400;
    return 0;
  }, [placementMode]);

  const canAffordAndPlace = alignmentPoints >= towerCost && !isOccupied;

  const color = useMemo(() => {
    if (placementMode && hovered) {
      return new THREE.Color(canAffordAndPlace ? '#10b981' : '#ef4444');
    }
    const hue = 210 + (instability / 100) * 120;
    const saturation = 70 + Math.sin(distance) * 10;
    const lightness = 15 + Math.cos(distance) * 5;
    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }, [instability, distance, placementMode, hovered, canAffordAndPlace]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const bob = Math.sin(time * 0.8 - distance * 0.3) * 0.15 * (1 + instability / 50);
    meshRef.current.position.y = bob;

    if (instability > 50) {
      const drift = (instability - 50) / 500;
      meshRef.current.rotation.x = Math.sin(time + x) * drift;
      meshRef.current.rotation.z = Math.cos(time + z) * drift;
    } else {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    }
  });

  const handlePointerOver = (e: any) => {
    if (!placementMode) return;
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: any) => {
    if (!placementMode) return;
    e.stopPropagation();
    setHovered(false);
  };

  const handleClick = (e: any) => {
    if (!placementMode) return;
    e.stopPropagation();
    if (canAffordAndPlace) {
      deployTower(placementMode, x, z);
      setPlacementMode(null);
      setHovered(false);
    }
  };

  return (
    <mesh 
      ref={meshRef} 
      position={[x, 0, z]} 
      receiveShadow 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <boxGeometry args={[0.9, 0.15, 0.9]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.7}
        emissive={color}
        emissiveIntensity={placementMode && hovered ? 1.5 : (instability > 65 ? 0.6 : 0.1)}
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
        <GridTile 
          key={tile.id} 
          x={tile.x} 
          z={tile.z} 
          instability={instability} 
        />
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
  
  const packets = useMemo(() => {
    return Array.from({ length: numPackets }).map((_, i) => {
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
        progress: 1.0,
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

      const x = p.startX + (p.targetX - p.startX) * p.progress;
      const z = p.startZ + (p.targetZ - p.startZ) * p.progress;
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

// ── 6. Advanced Floating Sovereign agent avatar ──
const SovereignAgent: React.FC<{
  sovereign: Sovereign;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ sovereign, index, isSelected, onSelect }) => {
  const { agentConversations } = useEmergenceData();
  const meshRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const satellite1 = useRef<THREE.Mesh>(null);
  const satellite2 = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const threatRingRef = useRef<THREE.Mesh>(null);

  const activeDialogue = useMemo(() => {
    const now = Date.now();
    return agentConversations.find(c => c.from === sovereign.name && (now - c.time) < 4000);
  }, [agentConversations, sovereign.name]);

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

  const threatColor = useMemo(() => {
    const c = sovereign.corruption;
    if (c <= 30) return '#10b981';
    if (c <= 60) return '#f59e0b';
    if (c <= 85) return '#f97316';
    return '#ef4444';
  }, [sovereign.corruption]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = Date.now() / 1000;
    const pos = getAgentPosition(index, time, sovereign.isSlowed);
    const driftY = 1.2 + Math.sin(time * (sovereign.isSlowed ? 0.35 : 1.3) + index) * 0.2;

    meshRef.current.position.set(pos.x, driftY, pos.z);

    if (shellRef.current) {
      shellRef.current.rotation.x = time * 0.5;
      shellRef.current.rotation.y = time * 0.8 + index;
    }

    if (pulseRef.current) {
      const p = sovereign.pulse || 0.5;
      const pulseScale = 1.0 + (p * 0.15);
      pulseRef.current.scale.setScalar(pulseScale);
    }

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

    if (threatRingRef.current) {
      const scale = 1.0 + Math.sin(state.clock.getElapsedTime() * 4.0) * 0.08;
      threatRingRef.current.scale.set(scale, scale, 1.0);
    }
  });

  return (
    <group ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {activeDialogue && <DialogueBubble text={activeDialogue.text} />}
      
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

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial
          wireframe
          color={colors.base}
          transparent
          opacity={isSelected ? 0.7 : 0.3}
        />
      </mesh>

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.02, 6, 24]} />
          <meshBasicMaterial color="#39ff14" transparent opacity={0.6} />
        </mesh>
      )}

      {sovereign.status === 'active' && (
        <mesh ref={threatRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
          <torusGeometry args={[0.48, 0.015, 6, 32]} />
          <meshBasicMaterial color={threatColor} transparent opacity={0.5} />
        </mesh>
      )}

      <mesh ref={satellite1}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={colors.base} />
      </mesh>

      <mesh ref={satellite2}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={colors.base} />
      </mesh>

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
    transmitAgentMessage,
    applyAgentOverride,
    alignmentPoints,
    deployedTowers,
    placementMode,
    setPlacementMode,
  } = useEmergenceData();

  const [chatMessage, setChatMessage] = useState('');

  const activeSovereign = useMemo(() => {
    return sovereigns.find((s: any) => s.name === selectedSovereignName) || null;
  }, [sovereigns, selectedSovereignName]);

  const handleSendTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedSovereignName) return;
    transmitAgentMessage(selectedSovereignName, chatMessage.trim());
    setChatMessage('');
  };

  return (
    <div className="emergence-viewport" onClick={() => selectSovereign(null)}>
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

        {/* Defense Grid Control Panel */}
        <div className="panel-section defense-grid-panel">
          <div className="section-title">Defense Grid Control</div>
          <div className="defense-points-row">
            <span>Alignment Points:</span>
            <strong className="points-display">⚡ {alignmentPoints}</strong>
          </div>

          {placementMode && (
            <div className="placement-mode-alert">
              <span>DEPLOYING: {placementMode.toUpperCase()} TOWER</span>
              <button className="cancel-placement-btn" onClick={() => setPlacementMode(null)}>✕ Cancel</button>
            </div>
          )}

          <div className="towers-selection-grid">
            <button
              className={`tower-card ${placementMode === 'purification' ? 'active' : ''} ${alignmentPoints < 500 ? 'disabled' : ''}`}
              onClick={() => alignmentPoints >= 500 && setPlacementMode(placementMode === 'purification' ? null : 'purification')}
            >
              <div className="tower-icon">🛡️</div>
              <div className="tower-info">
                <span className="tower-name">Purification</span>
                <span className="tower-cost">500 pts</span>
              </div>
            </button>

            <button
              className={`tower-card ${placementMode === 'containment' ? 'active' : ''} ${alignmentPoints < 300 ? 'disabled' : ''}`}
              onClick={() => alignmentPoints >= 300 && setPlacementMode(placementMode === 'containment' ? null : 'containment')}
            >
              <div className="tower-icon">⚡</div>
              <div className="tower-info">
                <span className="tower-name">Containment</span>
                <span className="tower-cost">300 pts</span>
              </div>
            </button>

            <button
              className={`tower-card ${placementMode === 'sentinel' ? 'active' : ''} ${alignmentPoints < 800 ? 'disabled' : ''}`}
              onClick={() => alignmentPoints >= 800 && setPlacementMode(placementMode === 'sentinel' ? null : 'sentinel')}
            >
              <div className="tower-icon">🎯</div>
              <div className="tower-info">
                <span className="tower-name">Sentinel</span>
                <span className="tower-cost">800 pts</span>
              </div>
            </button>

            <button
              className={`tower-card ${placementMode === 'genesis' ? 'active' : ''} ${alignmentPoints < 400 ? 'disabled' : ''}`}
              onClick={() => alignmentPoints >= 400 && setPlacementMode(placementMode === 'genesis' ? null : 'genesis')}
            >
              <div className="tower-icon">🌱</div>
              <div className="tower-info">
                <span className="tower-name">Genesis Beacon</span>
                <span className="tower-cost">400 pts</span>
              </div>
            </button>
          </div>

          {deployedTowers.length > 0 && (
            <div className="deployed-towers-list">
              <div className="deployed-list-title">Active Towers ({deployedTowers.length})</div>
              <div className="deployed-list-container">
                {deployedTowers.map(t => (
                  <div key={t.id} className="deployed-tower-item">
                    <span>{t.type.toUpperCase()}</span>
                    <span>[{t.x.toFixed(1)}, {t.z.toFixed(1)}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

              <div className="comm-actions-row">
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'purify')}>🛡️ Purify</button>
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'attune_genesis')}>🌱 Genesis</button>
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'attune_hunt')}>⚔️ Hunt</button>
                <button className="comm-small-btn" onClick={() => applyAgentOverride(activeSovereign.name, 'overclock')}>⚡ Overclock</button>
              </div>

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
          </div>
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

          <Stars radius={120} depth={40} count={4500} factor={6} saturation={0.8} fade speed={1.5} />
          <MovingNebula />
          <LocalPlayer />

          <TerrainGrid instability={metrics.timelineInstability} />
          <CentralPortal instability={metrics.timelineInstability} />
          <DataFlows />
          <CentralTowers alignment={metrics.worldAlignment} instability={metrics.timelineInstability} />
          <TowersLayer />

          {sovereigns.map((sov: any, i: number) => (
            <SovereignAgent
              key={sov.name || i}
              sovereign={sov}
              index={i}
              isSelected={selectedSovereignName === sov.name}
              onSelect={() => selectSovereign(sov.name)}
            />
          ))}

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            minDistance={4}
            maxDistance={22}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />

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
    </div>
  );
};
