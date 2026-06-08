import React, { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback } from "react";
import "../hud/nexus-hud.css";

const TELEMETRY_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyq6jzCVGtoOTcid-LzD_njmuuOOSwJrhktU3ya1GKXLZI9jp6yCMJzlrdvyNb1fpkb/exec";

const STORAGE_KEY = "nexus-hud-state-v2";

export const M_CONSCIENCE_DEFAULT = {
  integrity: 0.85,
  community: 0.72,
  karma: 0.78,
  wisdom: 0.9,
  inventory: ["meta1"] as string[], // Meta: Resonance unlocked by default
  nimbus: [] as string[],
};

export const DEFAULT_METRICS = M_CONSCIENCE_DEFAULT;

export interface ConscienceState {
  metrics: typeof M_CONSCIENCE_DEFAULT;
  stars: string[];
}

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

const DEFAULT_STATE: ConscienceState = {
  metrics: M_CONSCIENCE_DEFAULT,
  stars: [] as string[],
};

export const STORE_ITEMS = [
  { id: "ella", name: "Ella Assistant", cost: 1000, stars: 1, desc: "Guides you, protects you, teaches you. Baseline Vanguard shield.", icon: "🛡️" },
  { id: "oracle", name: "The Oracle", cost: 2000, stars: 2, desc: "Earn points by sharing good ideas to improve the Matrix.", icon: "👁️" },
  { id: "sandbox", name: "Creator Sandbox", cost: 3000, stars: 3, desc: "Test code + enter monthly contests for best game/app.", icon: "💻" },
  { id: "mai", name: "MAI", cost: 4000, stars: 4, desc: "Self-aware combat AI. Attacks enemies for you in Vanguard.", icon: "⚔️" },
  { id: "trinity", name: "Trinity", cost: 5000, stars: 5, desc: "Strength of Ella + MAI. Reveals hidden secrets the others miss.", icon: "✨" },
  { id: "boat", name: "Boat to Nimbus Island", cost: 6000, stars: 6, desc: "Unlocks the Gemini Vanguard Tower Defense Simulation.", icon: "⛵" },
];

const ConscienceContext = createContext<any>(null);

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function uniquePush<T>(list: T[], value: T) {
  if (!value || list.includes(value)) return list;
  return [...list, value];
}

function calcPoints(metrics: typeof M_CONSCIENCE_DEFAULT) {
  return Math.floor(
    (metrics.integrity + metrics.community + metrics.karma + metrics.wisdom) * 2500
  );
}

function loadPersistedState(): ConscienceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw);

    return {
      metrics: {
        ...M_CONSCIENCE_DEFAULT,
        ...(parsed?.metrics || {}),
        inventory: Array.isArray(parsed?.metrics?.inventory)
          ? Array.from(new Set<string>(parsed.metrics.inventory))
          : ["meta1"],
        nimbus: Array.isArray(parsed?.metrics?.nimbus)
          ? Array.from(new Set<string>(parsed.metrics.nimbus))
          : [],
      },
      stars: Array.isArray(parsed?.stars) ? Array.from(new Set<string>(parsed.stars)) : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function persistState(state: ConscienceState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence; fail silently.
  }
}

function conscienceReducer(state: ConscienceState, action: any): ConscienceState {
  switch (action.type) {
    case "UPDATE_METRICS": {
      const deltas = action.payload || {};
      const prev = state.metrics as any;
      const next = { ...prev };

      Object.keys(deltas).forEach((key) => {
        if (typeof prev[key] === "number") {
          next[key] = clamp01(prev[key] + Number(deltas[key] || 0));
        }
      });

      if (deltas.newItem) {
        next.inventory = uniquePush(prev.inventory, deltas.newItem);
      }

      if (deltas.newBuilding) {
        next.nimbus = uniquePush(prev.nimbus, deltas.newBuilding);
      }

      return { ...state, metrics: next };
    }

    case "AWARD_STAR": {
      const starId = action.payload;
      if (!starId || state.stars.includes(starId)) return state;
      return { ...state, stars: [...state.stars, starId] };
    }

    case "BUY_ITEM": {
      const item = action.payload;
      if (!item) return state;

      const points = calcPoints(state.metrics);
      const alreadyOwned = state.metrics.inventory.includes(item.id);
      const hasPoints = points >= item.cost;
      const hasStars = state.stars.length >= item.stars;

      if (alreadyOwned || !hasPoints || !hasStars) return state;

      const drain = item.cost / 10000;
      const nextMetrics = {
        ...state.metrics,
        integrity: clamp01(state.metrics.integrity - drain),
        community: clamp01(state.metrics.community - drain),
        karma: clamp01(state.metrics.karma - drain),
        wisdom: clamp01(state.metrics.wisdom - drain),
        inventory: uniquePush(state.metrics.inventory, item.id),
      };

      return { ...state, metrics: nextMetrics };
    }

    case "RESET_PROGRESS":
      return DEFAULT_STATE;

    default:
      return state;
  }
}

export function ConscienceProvider({ children, initialMetrics }: { children: React.ReactNode, initialMetrics?: any }) {
  const [state, dispatch] = useReducer(conscienceReducer, null, () => {
    const loaded = loadPersistedState();
    if (initialMetrics) {
        loaded.metrics = { ...loaded.metrics, ...initialMetrics };
    }
    return loaded;
  });

  useEffect(() => {
    persistState(state);
  }, [state]);

  const updateMetrics = useCallback((deltas: any) => dispatch({ type: "UPDATE_METRICS", payload: deltas }), []);
  const awardStar = useCallback((starId: string) => dispatch({ type: "AWARD_STAR", payload: starId }), []);
  const buyItem = useCallback((item: any) => dispatch({ type: "BUY_ITEM", payload: item }), []);

  const points = calcPoints(state.metrics);

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

  const value = useMemo(
    () => ({
      metrics: state.metrics,
      stars: state.stars,
      points,
      updateMetrics,
      awardStar,
      buyItem,
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
    }),
    [
      state.metrics, 
      state.stars, 
      points, 
      updateMetrics, 
      awardStar, 
      buyItem,
      globalCollapseRisk,
      increaseCollapseRisk,
      userLevel,
      unlockedSectors,
      sectorControl,
      unlockSector,
      triggerCosmicEvent,
      cosmicLogs
    ]
  );

  return <ConscienceContext.Provider value={value}>{children}</ConscienceContext.Provider>;
}

export function useConscience() {
  const ctx = useContext(ConscienceContext);
  if (!ctx) {
    throw new Error("useConscience must be used within a ConscienceProvider");
  }
  return ctx;
}
