import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Shared default metrics
export const M_CONSCIENCE_DEFAULT = {
  integrity: 0.75,
  community: 0.40,
  karma: 0.60,
  wisdom: 0.55
};

export type FactionKey = 'aurion' | 'voidborn' | 'solari';
export type Faction = {
  name: string;
  color: string;
  aggression: number;
  defense: number;
  special: string;
};

export const FACTIONS: Record<FactionKey, Faction> = {
  aurion: { name: "Aurion Ascendancy", color: "#38bdf8", aggression: 0.3, defense: 0.7, special: "Shield harmonics" },
  voidborn: { name: "Voidborn Dominion", color: "#a855f7", aggression: 0.8, defense: 0.4, special: "Gravity distortion" },
  solari: { name: "Solari Imperium", color: "#facc15", aggression: 0.6, defense: 0.6, special: "Solar flares" }
};

type ConscienceState = {
  metrics: typeof M_CONSCIENCE_DEFAULT;
  updateMetrics: (deltas: Partial<typeof M_CONSCIENCE_DEFAULT>) => void;
  globalCollapseRisk: number;
  increaseCollapseRisk: (delta: number) => void;
  userLevel: number;
  setUserLevel: React.Dispatch<React.SetStateAction<number>>;
  unlockedSectors: number[];
  sectorControl: Record<number, FactionKey>;
  factions: Record<FactionKey, Faction>;
  unlockSector: (id: number) => void;
  triggerCosmicEvent: (msg: string) => void;
  cosmicLogs: string[];
};

export const ConscienceContext = createContext<ConscienceState>(null!);

export function ConscienceProvider({ 
  children, 
  initialMetrics = M_CONSCIENCE_DEFAULT 
}: { 
  children: React.ReactNode, 
  initialMetrics?: typeof M_CONSCIENCE_DEFAULT 
}) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const prevMetricsRef = useRef(initialMetrics);

  // Sync metrics changes
  useEffect(() => {
    const changed = (Object.keys(initialMetrics) as Array<keyof typeof M_CONSCIENCE_DEFAULT>).some(
      (key) => initialMetrics[key] !== prevMetricsRef.current[key]
    );
    if (changed) {
      setMetrics(initialMetrics);
      prevMetricsRef.current = initialMetrics;
    }
  }, [initialMetrics]);

  const updateMetrics = useCallback((deltas: Partial<typeof M_CONSCIENCE_DEFAULT>) => {
    setMetrics((prev) => {
      const updated = { ...prev };
      Object.keys(deltas).forEach((key) => {
        const k = key as keyof typeof M_CONSCIENCE_DEFAULT;
        updated[k] = Math.max(0, Math.min(1, prev[k] + (deltas[k] || 0)));
      });
      return updated;
    });
  }, []);

  // Collapse Risk logic with cross-window syncing
  const [globalCollapseRisk, setGlobalCollapseRisk] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aghl_collapseRisk');
      if (stored) return parseFloat(stored);
    }
    return 0.15; // baseline
  });

  const increaseCollapseRisk = useCallback((delta: number) => {
    setGlobalCollapseRisk(prev => {
      const next = Math.min(0.99, prev + delta);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aghl_collapseRisk', next.toString());
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aghl_collapseRisk' && e.newValue) {
        setGlobalCollapseRisk(parseFloat(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // --- Strategic Faction & Galactic map state ---
  const [userLevel, setUserLevel] = useState(1);
  const [unlockedSectors, setUnlockedSectors] = useState([1]);
  const [sectorControl, setSectorControl] = useState<Record<number, FactionKey>>({
    1: 'aurion', 2: 'voidborn', 3: 'solari', 4: 'aurion', 5: 'voidborn'
  });
  const [cosmicLogs, setCosmicLogs] = useState<string[]>([
    "Cosmic network online. Tactical strategy layer engaged."
  ]);

  const unlockSector = useCallback((id: number) => {
    setUnlockedSectors(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const triggerCosmicEvent = useCallback((msg: string) => {
    // Add visual event effect on document
    if (typeof document !== 'undefined') {
      const e = document.createElement('div');
      e.className = 'cosmic-event';
      document.body.appendChild(e);
      setTimeout(() => e.remove(), 1500);
    }
    console.log(`[COSMIC EVENT]: ${msg}`);
    setCosmicLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev
    ].slice(0, 30));
  }, []);

  // Faction wars helper logic
  const resolveBattle = useCallback((defender: FactionKey, attacker: FactionKey): boolean => {
    const d = FACTIONS[defender];
    const a = FACTIONS[attacker];
    const time = typeof document !== 'undefined' ? document.body.dataset.time : 'day';
    let aMod = a.aggression;
    let dMod = d.defense;
    if (time === 'dawn') dMod += 0.2;
    if (time === 'midnight' && attacker === 'voidborn') aMod += 0.3;
    if (time === 'day' && attacker === 'solari') aMod += 0.2;

    const defenseScore = dMod * (0.5 + Math.random());
    const attackScore = aMod * (0.5 + Math.random());
    return attackScore > defenseScore;
  }, []);

  const pickChallenger = useCallback((owner: FactionKey): FactionKey | null => {
    const rivals: FactionKey[] = (['aurion', 'voidborn', 'solari'] as FactionKey[]).filter(f => f !== owner);
    return rivals[Math.floor(Math.random() * rivals.length)] || null;
  }, []);

  const simulateFactionWars = useCallback(() => {
    setSectorControl(prev => {
      const next = { ...prev };
      let changed = false;
      const sectorsList = Object.keys(next).map(Number);
      
      // Select one random sector to battle each interval to avoid complete maps flipping at once
      const targetSector = sectorsList[Math.floor(Math.random() * sectorsList.length)];
      if (targetSector) {
        const owner = next[targetSector];
        const challenger = pickChallenger(owner);
        if (challenger && resolveBattle(owner, challenger)) {
          next[targetSector] = challenger;
          changed = true;
          
          triggerCosmicEvent(`${FACTIONS[challenger].name} conquered Sector ${targetSector}!`);
          if (typeof document !== 'undefined') {
            document.body.style.setProperty('--theme-color', FACTIONS[challenger].color);
          }
        }
      }
      return next;
    });
  }, [pickChallenger, resolveBattle, triggerCosmicEvent]);

  // Background Faction War loop running every 60s
  useEffect(() => {
    const interval = setInterval(simulateFactionWars, 60000);
    return () => clearInterval(interval);
  }, [simulateFactionWars]);

  const value = useMemo(() => ({ 
    metrics, 
    updateMetrics,
    globalCollapseRisk,
    increaseCollapseRisk,
    userLevel,
    setUserLevel,
    unlockedSectors,
    sectorControl,
    factions: FACTIONS,
    unlockSector,
    triggerCosmicEvent,
    cosmicLogs
  }), [
    metrics, 
    updateMetrics, 
    globalCollapseRisk, 
    increaseCollapseRisk,
    userLevel,
    unlockedSectors,
    sectorControl,
    unlockSector,
    triggerCosmicEvent,
    cosmicLogs
  ]);

  return <ConscienceContext.Provider value={value}>{children}</ConscienceContext.Provider>;
}


export function useConscience() {
  const ctx = useContext(ConscienceContext);
  if (!ctx) throw new Error("useConscience must be used inside ConscienceProvider");
  return ctx;
}
