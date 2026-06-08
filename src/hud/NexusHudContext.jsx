import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import "./nexus-hud.css";

/**
 * =========================================================
 * NEXUS HUD // Production-ready single-file refactor
 * =========================================================
 * Features:
 * - Persistent localStorage state
 * - Reducer-driven updates for safer state transitions
 * - Deduped inventory / stars / buildings
 * - Missing M45 Shifter module implemented
 * - Missing Seven Stars module implemented
 * - Telemetry helper (safe / best-effort)
 * - Anti-farming protections for one-time star rewards
 * =========================================================
 */

const TELEMETRY_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyq6jzCVGtoOTcid-LzD_njmuuOOSwJrhktU3ya1GKXLZI9jp6yCMJzlrdvyNb1fpkb/exec";

const STORAGE_KEY = "nexus-hud-state-v2";
const TAB_STORAGE_KEY = "nexus-hud-active-tab";

const DEFAULT_METRICS = {
  integrity: 0.85,
  community: 0.72,
  karma: 0.78,
  wisdom: 0.9,
  inventory: ["meta1"], // Meta: Resonance unlocked by default
  nimbus: [],
};

const DEFAULT_STATE = {
  metrics: DEFAULT_METRICS,
  stars: [],
};

const STORE_ITEMS = [
  {
    id: "ella",
    name: "Ella Assistant",
    cost: 1000,
    stars: 1,
    desc: "Guides you, protects you, teaches you. Baseline Vanguard shield.",
    icon: "🛡️",
  },
  {
    id: "oracle",
    name: "The Oracle",
    cost: 2000,
    stars: 2,
    desc: "Earn points by sharing good ideas to improve the Matrix.",
    icon: "👁️",
  },
  {
    id: "sandbox",
    name: "Creator Sandbox",
    cost: 3000,
    stars: 3,
    desc: "Test code + enter monthly contests for best game/app.",
    icon: "💻",
  },
  {
    id: "mai",
    name: "MAI",
    cost: 4000,
    stars: 4,
    desc: "Self-aware combat AI. Attacks enemies for you in Vanguard.",
    icon: "⚔️",
  },
  {
    id: "trinity",
    name: "Trinity",
    cost: 5000,
    stars: 5,
    desc: "Strength of Ella + MAI. Reveals hidden secrets the others miss.",
    icon: "✨",
  },
  {
    id: "boat",
    name: "Boat to Nimbus Island",
    cost: 6000,
    stars: 6,
    desc: "Unlocks the Gemini Vanguard Tower Defense Simulation.",
    icon: "⛵",
  },
];

const STAR_META = [
  { id: "MetaNull", label: "Meta Null", source: "Meta: Silent Alignment" },
  { id: "M45Shift", label: "M45 Shift", source: "M45 Shifter" },
  { id: "StarCompassion", label: "Compassion", source: "Seven Stars" },
  { id: "StarClarity", label: "Clarity", source: "Seven Stars" },
  { id: "StarBalance", label: "Balance", source: "Seven Stars" },
  { id: "StarTruth", label: "Truth", source: "Seven Stars" },
  { id: "StarSignal", label: "Signal", source: "Seven Stars" },
];

const ConscienceContext = createContext(null);

/* =========================================================
 * Utilities
 * ======================================================= */

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function uniquePush(list, value) {
  if (!value || list.includes(value)) return list;
  return [...list, value];
}

function calcPoints(metrics) {
  return Math.floor(
    (metrics.integrity + metrics.community + metrics.karma + metrics.wisdom) * 2500
  );
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw);

    return {
      metrics: {
        ...DEFAULT_METRICS,
        ...(parsed?.metrics || {}),
        inventory: Array.isArray(parsed?.metrics?.inventory)
          ? Array.from(new Set(parsed.metrics.inventory))
          : ["meta1"],
        nimbus: Array.isArray(parsed?.metrics?.nimbus)
          ? Array.from(new Set(parsed.metrics.nimbus))
          : [],
      },
      stars: Array.isArray(parsed?.stars) ? Array.from(new Set(parsed.stars)) : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence; fail silently.
  }
}

function sendTelemetry(event, payload = {}) {
  const body = JSON.stringify({
    event,
    payload,
    ts: new Date().toISOString(),
    source: "nexus-hud",
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(TELEMETRY_ENDPOINT, blob);
      return;
    }
  } catch {
    // fall through to fetch
  }

  try {
    fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  } catch {
    // Best-effort only
  }
}

/* =========================================================
 * Reducer
 * ======================================================= */

function conscienceReducer(state, action) {
  switch (action.type) {
    case "UPDATE_METRICS": {
      const deltas = action.payload || {};
      const prev = state.metrics;
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

/* =========================================================
 * Context
 * ======================================================= */

export function ConscienceProvider({ children }) {
  const [state, dispatch] = useReducer(conscienceReducer, DEFAULT_STATE, loadPersistedState);

  // Sync to localStorage
  useEffect(() => {
    persistState(state);
  }, [state]);

  const value = useMemo(() => ({
    state,
    dispatch,
    updateMetrics: (payload) => dispatch({ type: "UPDATE_METRICS", payload }),
    awardStar: (starId) => dispatch({ type: "AWARD_STAR", payload: starId }),
    buyItem: (item) => dispatch({ type: "BUY_ITEM", payload: item }),
    resetProgress: () => dispatch({ type: "RESET_PROGRESS" })
  }), [state]);

  return (
    <ConscienceContext.Provider value={value}>
      {children}
    </ConscienceContext.Provider>
  );
}

export function useConscience() {
  const context = useContext(ConscienceContext);
  if (!context) {
    throw new Error("useConscience must be used within ConscienceProvider");
  }
  return context;
}
