import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import "./nexus-hud.css";

const TELEMETRY_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyq6jzCVGtoOTcid-LzD_njmuuOOSwJrhktU3ya1GKXLZI9jp6yCMJzlrdvyNb1fpkb/exec";

const STORAGE_KEY = "nexus-hud-state-v2";

const DEFAULT_METRICS = {
  integrity: 0.85,
  community: 0.72,
  karma: 0.78,
  wisdom: 0.9,
  inventory: ["meta1"], // Meta: Resonance unlocked by default
  nimbus: [] as string[],
};

const DEFAULT_STATE = {
  metrics: DEFAULT_METRICS,
  stars: [] as string[],
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

const ConscienceContext = createContext<any>(null);

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function uniquePush<T>(list: T[], value: T) {
  if (!value || list.includes(value)) return list;
  return [...list, value];
}

function calcPoints(metrics: typeof DEFAULT_METRICS) {
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
          ? Array.from(new Set(parsed.metrics.inventory as string[]))
          : ["meta1"],
        nimbus: Array.isArray(parsed?.metrics?.nimbus)
          ? Array.from(new Set(parsed.metrics.nimbus as string[]))
          : [],
      },
      stars: Array.isArray(parsed?.stars) ? Array.from(new Set(parsed.stars as string[])) : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function persistState(state: typeof DEFAULT_STATE) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence; fail silently.
  }
}

function conscienceReducer(state: typeof DEFAULT_STATE, action: any) {
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

export function ConscienceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(conscienceReducer, null, loadPersistedState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const updateMetrics = (deltas: any) => dispatch({ type: "UPDATE_METRICS", payload: deltas });
  const awardStar = (starId: string) => dispatch({ type: "AWARD_STAR", payload: starId });
  const buyItem = (item: any) => dispatch({ type: "BUY_ITEM", payload: item });

  const points = calcPoints(state.metrics);

  const value = useMemo(
    () => ({
      metrics: state.metrics,
      stars: state.stars,
      points,
      updateMetrics,
      awardStar,
      buyItem,
    }),
    [state, points]
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

export default function NexusHUD() {
  return (
    <ConscienceProvider>
      <NexusCoreMaster />
    </ConscienceProvider>
  );
}

function NexusCoreMaster() {
  const { metrics, updateMetrics, awardStar, points } = useConscience();
  const [terminalLog, setTerminalLog] = useState("Nexus HUD online. Routing telemetry to central matrix.");
  const [activeTab, setActiveTab] = useState("exchange");
  
  // Dynamic Tab Rendering based on Inventory
  const hasVanguard = metrics.inventory.includes('boat');
  const hasMeta1 = metrics.inventory.includes('meta1');

  return (
    <div className="mc-matrix-root">
      <div className="mc-container">
        <header className="mc-header">
          <p className="mc-badge">NEXUS HUD // COMMAND CENTER</p>
          <h1>MATRIX OF CONSCIENCE</h1>
          <div className="mc-nav-row flex flex-wrap justify-center gap-2">
            <button className={`mc-nav-btn ${activeTab === "exchange" ? "active" : ""}`} onClick={() => setActiveTab("exchange")}>Nexus Exchange</button>
            <button className={`mc-nav-btn ${activeTab === "calibration" ? "active" : ""}`} onClick={() => setActiveTab("calibration")}>M45 Shifter</button>
            <button className={`mc-nav-btn ${activeTab === "sevenstars" ? "active" : ""}`} onClick={() => setActiveTab("sevenstars")}>Seven Stars</button>
            
            {hasMeta1 && (
              <button className={`mc-nav-btn ${activeTab === "meta1" ? "active" : ""}`} onClick={() => setActiveTab("meta1")}>Meta: Resonance</button>
            )}
            {hasVanguard && (
              <button className={`mc-nav-btn ${activeTab === "vanguard" ? "active" : ""}`} onClick={() => setActiveTab("vanguard")}>Nimbus Vanguard</button>
            )}
          </div>
        </header>

        <div className="mc-main-layout">
          {/* Constant Telemetry Panel */}
          <section className="mc-card mc-telemetry-panel">
            <h2>System Telemetry</h2>
            <div className="mc-bars-list">
              <MetricRow label="Integrity Matrix" value={metrics.integrity} color="var(--neon-blue)" />
              <MetricRow label="Community Thread" value={metrics.community} color="var(--neon-purple)" />
              <MetricRow label="Karma Continuum" value={metrics.karma} color="#f43f5e" />
              <MetricRow label="Wisdom Index" value={metrics.wisdom} color="var(--neon-gold)" />
            </div>
            <div className="mc-console-log mt-6">
              <div className="mc-log-terminal">{terminalLog}</div>
            </div>
          </section>

          {/* Dynamic App Views */}
          {activeTab === "exchange" && <StoreProtocol setLog={setTerminalLog} />}
          {activeTab === "meta1" && <MetaSilentAlignment setLog={setTerminalLog} />}
          {activeTab === "vanguard" && <GeminiVanguardWrapper />}
          
          {/* Legacy Placeholder Views (M45 / Seven Stars logic remains here in full implementation) */}
          {activeTab === "calibration" && (
            <section className="mc-card flex items-center justify-center text-slate-500">
               <p>[ M45 Shifter Component Loaded ]</p>
            </section>
          )}
          {activeTab === "sevenstars" && (
            <section className="mc-card flex items-center justify-center text-slate-500">
               <p>[ Seven Stars Protocol Loaded ]</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MODULE: META SILENT ALIGNMENT ---
function MetaSilentAlignment({ setLog }: { setLog: (msg: string) => void }) {
  const { updateMetrics, awardStar } = useConscience();
  const [f1, setF1] = useState(30);
  const [f2, setF2] = useState(70);
  const [f3, setF3] = useState(10);
  
  // Hidden targets that equal perfect silence
  const targets = useMemo(() => [55, 42, 88], []);
  
  const noiseLevel = Math.abs(f1 - targets[0]) + Math.abs(f2 - targets[1]) + Math.abs(f3 - targets[2]);
  const isAligned = noiseLevel < 5;

  useEffect(() => {
    if (isAligned) {
      updateMetrics({ integrity: 0.05, community: 0.02 });
      if (awardStar('MetaNull')) {
        setLog("[RESONANCE ACHIEVED] Meta: Silent Alignment complete. Star Awarded.");
      } else {
        setLog("[RESONANCE ACHIEVED] Frequencies matched. Entropy reduced.");
      }
    }
  }, [isAligned, updateMetrics, awardStar, setLog]);

  return (
    <section className="mc-card mc-control-panel flex flex-col">
      <h2>Meta: Silent Alignment</h2>
      <p className="mc-panel-desc">Adjust the localized frequency dials until the spectrogram reaches absolute zero.</p>
      
      <div className="flex-1 bg-slate-950/80 rounded-xl border border-white/5 p-6 flex flex-col justify-center gap-6 relative overflow-hidden">
        {/* Procedural Spectrogram Visualizer */}
        <div className="h-24 w-full border-b border-rose-500/30 flex items-end justify-center gap-1 opacity-70">
           {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="w-full bg-cyan-400/50 transition-all duration-100"
                style={{ height: `${isAligned ? 2 : Math.random() * (noiseLevel / 2) + 5}px` }}
              />
           ))}
        </div>

        {isAligned && <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm z-10 font-black text-emerald-400 tracking-widest uppercase">Null Reached</div>}

        <div className="space-y-4 relative z-20">
          <input type="range" min="0" max="100" value={f1} onChange={(e) => setF1(Number(e.target.value))} className="w-full accent-cyan-400" />
          <input type="range" min="0" max="100" value={f2} onChange={(e) => setF2(Number(e.target.value))} className="w-full accent-purple-400" />
          <input type="range" min="0" max="100" value={f3} onChange={(e) => setF3(Number(e.target.value))} className="w-full accent-rose-400" />
        </div>
      </div>
    </section>
  );
}

// --- MODULE: GEMINI VANGUARD TD ---
function GeminiVanguardWrapper() {
  return (
    <section className="mc-card mc-control-panel flex flex-col p-0 overflow-hidden border-sky-500/30">
      <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
        <h2 className="m-0 text-sky-400 font-bold tracking-widest text-xs">GEMINI: VANGUARD SIMULATION</h2>
        <span className="text-[10px] text-emerald-400 px-2 py-1 bg-emerald-900/30 rounded border border-emerald-500/20">LIVE MODULE</span>
      </div>
      <iframe 
        src="./vanguard.html" 
        title="Gemini Vanguard TD"
        className="w-full flex-1 border-0 min-h-[500px]"
        sandbox="allow-scripts allow-same-origin"
      />
    </section>
  );
}

// --- MODULE: NEXUS EXCHANGE STORE ---
function StoreProtocol({ setLog }: { setLog: (msg: string) => void }) {
  const { stars, metrics, buyItem, points } = useConscience();
  
  const handleBuy = (item: any) => {
    if (buyItem(item)) {
      setLog(`[ACQUIRED] ${item.name} unlocked. Access granted in Nexus HUD.`);
    } else {
      setLog(`[DENIED] Requires ${item.cost} pts & ${item.stars} Stars.`);
    }
  };

  return (
    <section className="mc-card mc-control-panel">
      <h2>Nexus Exchange</h2>
      
      <div className="flex justify-between bg-slate-950/50 p-4 rounded-xl border border-white/5 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bank</span>
          <span className="text-xl font-black text-cyan-400 font-mono">{points} PTS</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Clearance</span>
          <span className="text-xl font-black text-yellow-400 font-mono">{stars.length}/7 ⭐</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {STORE_ITEMS.map(item => {
          const owned = metrics.inventory.includes(item.id);
          const canAfford = points >= item.cost && stars.length >= item.stars;
          return (
            <div key={item.id} className={`p-4 rounded-xl border transition-all ${owned ? 'border-emerald-500/30 bg-emerald-950/10' : (canAfford ? 'border-sky-500/30 bg-slate-900/50 hover:border-sky-400' : 'border-slate-800 bg-slate-950/50 opacity-60')}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-slate-200">{item.icon} {item.name}</h4>
                <div className="text-[10px] font-bold font-mono">
                  <span className={stars.length >= item.stars ? 'text-emerald-400' : 'text-rose-400'}>{item.stars}⭐ </span>
                  <span className={points >= item.cost ? 'text-emerald-400' : 'text-rose-400'}>{item.cost}C</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">{item.desc}</p>
              <button 
                onClick={() => handleBuy(item)} 
                disabled={owned || !canAfford}
                className={`w-full py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${owned ? 'bg-emerald-500/10 text-emerald-500 cursor-default' : (canAfford ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed')}`}
              >
                {owned ? 'Module Active' : canAfford ? 'Authorize Requisition' : 'Locked'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetricRow({ label, value, color }: { label: string, value: number, color: string }) {
  const percentage = Math.round(value * 100);
  return (
    <div className="w-full mb-3">
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono" style={{ color }}>{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
