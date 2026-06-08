import React, { useEffect } from 'react';
import { useConscience, FactionKey } from '../../src/components/ConscienceProvider';
import { motion } from 'framer-motion';

export type SectorData = {
  id: number;
  x: number; // % position
  y: number;
  requiredLevel: number;
  name: string;
  isBoss?: boolean;
};

export const SECTORS: SectorData[] = [
  { id: 1, x: 50, y: 50, requiredLevel: 1, name: "Origin Point" },
  { id: 2, x: 25, y: 30, requiredLevel: 2, name: "Aurion Gate" },
  { id: 3, x: 75, y: 30, requiredLevel: 3, name: "Voidborn Rift" },
  { id: 4, x: 30, y: 75, requiredLevel: 4, name: "Solari Forge" },
  { id: 5, x: 70, y: 75, requiredLevel: 5, name: "Eclipse Reach", isBoss: true },
  { id: 6, x: 10, y: 15, requiredLevel: 6, name: "Outer Rim Alpha" },
  { id: 7, x: 90, y: 15, requiredLevel: 7, name: "Outer Rim Omega" },
  { id: 8, x: 50, y: 10, requiredLevel: 8, name: "Core Worlds Gate", isBoss: true },
  { id: 9, x: 10, y: 90, requiredLevel: 9, name: "Abyssal Trench" },
  { id: 10, x: 90, y: 90, requiredLevel: 10, name: "Zenith Pinnacle", isBoss: true }
];

interface UniverseMapProps {
  onSelectSector: (sectorId: number) => void;
}

export default function UniverseMap({ onSelectSector }: UniverseMapProps) {
  const {
    userLevel,
    sectorControl,
    factions,
    triggerCosmicEvent,
    unlockedSectors,
    unlockSector
  } = useConscience();

  // Auto-unlock sectors based on level
  useEffect(() => {
    SECTORS.forEach(s => {
      if (userLevel >= s.requiredLevel && !unlockedSectors.includes(s.id)) {
        unlockSector(s.id);
        triggerCosmicEvent(`SECTOR UNLOCKED: ${s.name}`);
      }
    });
  }, [userLevel, unlockedSectors, unlockSector, triggerCosmicEvent]);

  return (
    <div className="universe-map-viewport">
      {/* Parallax depth layers */}
      <div className="cosmic-depth">
        <div className="cosmic-layer" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 2px)' }} />
        <div className="cosmic-layer mid" style={{ backgroundImage: 'radial-gradient(circle, #a855f7 1px, transparent 3px)' }} />
        <div className="cosmic-layer deep" style={{ backgroundImage: 'radial-gradient(circle, #facc15 1px, transparent 4px)' }} />
      </div>

      {SECTORS.map(sector => {
        const unlocked = unlockedSectors.includes(sector.id);
        const factionKey = sectorControl[sector.id] as FactionKey | undefined;
        const faction = factionKey ? factions[factionKey] : undefined;

        // Custom glow and theme colors
        const themeColor = faction ? faction.color : '#64748b';
        const glow = unlocked ? `0 0 25px ${themeColor}cc, inset 0 0 10px ${themeColor}` : 'none';
        const bossStyle = sector.isBoss ? { borderStyle: 'dashed', borderWidth: '3px' } : {};

        return (
          <motion.div
            key={sector.id}
            className={`sector-node ${unlocked ? 'unlocked' : ''}`}
            style={{
              left: `${sector.x}%`,
              top: `${sector.y}%`,
              borderColor: themeColor,
              boxShadow: glow,
              ...bossStyle,
              // Custom CSS property passed to stylesheet
              // @ts-ignore
              '--theme-color': themeColor,
              '--sector-glow': themeColor
            }}
            onClick={() => {
              if (unlocked) {
                onSelectSector(sector.id);
              }
            }}
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={unlocked ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.35 }}
            transition={{ duration: 0.8 }}
          >
            {/* Visual glow overlay */}
            {unlocked && (
              <div 
                className="absolute inset-0 rounded-full" 
                style={{ 
                  background: `radial-gradient(circle, ${themeColor}1a, transparent)`,
                  pointerEvents: 'none'
                }} 
              />
            )}
            
            {/* Sector Details */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                fontWeight: 'bold',
                color: '#fff',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {sector.name}
              </p>
              {unlocked && faction ? (
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '8px',
                  fontWeight: 600,
                  color: themeColor,
                  margin: '4px 0 0 0',
                  textTransform: 'uppercase'
                }}>
                  {faction.name.split(' ')[0]}
                </p>
              ) : (
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '8px',
                  color: '#64748b',
                  margin: '4px 0 0 0'
                }}>
                  Req Lv {sector.requiredLevel}
                </p>
              )}
              {sector.isBoss && (
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  color: '#ef4444',
                  margin: '4px 0 0 0',
                  fontWeight: 800,
                  textShadow: '0 0 5px #ef4444'
                }}>
                  BOSS
                </p>
              )}
            </div>

            {/* Aura Ring animation */}
            {unlocked && (
              <div 
                className="aura-ring-layer" 
                style={{ color: themeColor }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
