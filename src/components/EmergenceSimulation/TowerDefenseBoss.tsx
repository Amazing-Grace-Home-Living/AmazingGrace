import React, { useEffect, useState } from 'react';
import { useConscience, FactionKey } from '../ConscienceProvider';
import { motion, AnimatePresence } from 'framer-motion';

export const FACTION_BOSSES: Record<FactionKey, { name: string; hp: number; color: string; desc: string }> = {
  aurion: { name: "Celestial Warden", hp: 150, color: "#38bdf8", desc: "Emits shield dampening fields." },
  voidborn: { name: "Eclipse Devourer", hp: 120, color: "#a855f7", desc: "Bends gravity to slow and damage nodes." },
  solari: { name: "Solar Archon", hp: 180, color: "#facc15", desc: "Fires concentrated solar flares at the core." }
};

interface TowerDefenseBossProps {
  sectorId: number;
  onBossAttack?: (damage: number) => void;
  onBossDefeated?: () => void;
}

export default function TowerDefenseBoss({ sectorId, onBossAttack, onBossDefeated }: TowerDefenseBossProps) {
  const { sectorControl, triggerCosmicEvent, increaseCollapseRisk } = useConscience();
  const [boss, setBoss] = useState<{ key: FactionKey; hp: number; maxHp: number } | null>(null);
  const [phase, setPhase] = useState(1);

  // Spawn boss on loading
  useEffect(() => {
    const factionKey = sectorControl[sectorId] as FactionKey | undefined;
    if (!factionKey) return;

    // Spawn boss on loading
    const shouldSpawn = true;

    if (shouldSpawn && !boss) {
      const data = FACTION_BOSSES[factionKey];
      setBoss({ key: factionKey, hp: data.hp, maxHp: data.hp });
      setPhase(1);
      triggerCosmicEvent(`BOSS INTRUSION: ${data.name} active in Sector ${sectorId}`);
      increaseCollapseRisk(0.08);
    }
  }, [sectorId, sectorControl, triggerCosmicEvent, increaseCollapseRisk]);

  // Expose global damage hook so high-frequency canvas loops can hit the boss
  useEffect(() => {
    if (!boss) {
      // @ts-ignore
      window.damageActiveBoss = undefined;
      return;
    }

    // @ts-ignore
    window.damageActiveBoss = (amount: number) => {
      setBoss(prev => {
        if (!prev) return null;
        const newHp = Math.max(0, prev.hp - amount);
        
        if (newHp <= prev.maxHp * 0.5 && phase === 1) {
          setPhase(2);
          triggerCosmicEvent(`WARNING: ${FACTION_BOSSES[prev.key].name} entered Phase 2!`);
        }

        if (newHp === 0) {
          triggerCosmicEvent(`VICTORY: ${FACTION_BOSSES[prev.key].name} defeated!`);
          if (onBossDefeated) {
            onBossDefeated();
          }
          // @ts-ignore
          window.damageActiveBoss = undefined;
          return null;
        }

        return { ...prev, hp: newHp };
      });
    };

    return () => {
      // @ts-ignore
      window.damageActiveBoss = undefined;
    };
  }, [boss, phase, triggerCosmicEvent, onBossDefeated]);

  // Boss attack pattern interval
  useEffect(() => {
    if (!boss) return;

    const interval = setInterval(() => {
      const bossData = FACTION_BOSSES[boss.key];
      const damage = phase === 2 ? 2 : 1;
      
      triggerCosmicEvent(`BOSS ATTACK: ${bossData.name} discharges anomaly field.`);
      
      if (onBossAttack) {
        onBossAttack(damage);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [boss, phase, triggerCosmicEvent, onBossAttack]);

  if (!boss) return null;

  const data = FACTION_BOSSES[boss.key];
  const hpPct = (boss.hp / boss.maxHp) * 100;

  return (
    <AnimatePresence>
      <motion.div
        className="boss-entity"
        style={{
          left: '50%',
          top: '30%',
          borderColor: data.color,
          boxShadow: `0 0 30px #000 inset, 0 0 25px ${data.color}`,
          // @ts-ignore
          '--theme-color': data.color
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: phase === 2 ? 1.15 : 1.0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        onClick={() => {
          // Manual debugging support: click to damage boss
          // @ts-ignore
          if (typeof window.damageActiveBoss === 'function') {
            // @ts-ignore
            window.damageActiveBoss(15);
          }
        }}
      >
        <div className="boss-hp-container">
          <div
            className="boss-hp-bar"
            style={{
              width: `${hpPct}%`,
              background: data.color,
              boxShadow: `0 0 10px ${data.color}`
            }}
          />
        </div>
        
        <div style={{ padding: '10px', textAlign: 'center', pointerEvents: 'none' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {data.name}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '8px', color: '#64748b', textTransform: 'uppercase' }}>
            PHASE {phase} ({Math.round(boss.hp)}/{boss.maxHp})
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
