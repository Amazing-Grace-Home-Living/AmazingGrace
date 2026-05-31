import { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import "./matrix-of-conscience.css";

// Unified Apps Script Telemetry Sink Gateway
const TELEMETRY_ENDPOINT = "https://script.google.com/macros/s/AKfycbxLWV71pwzoZIyxyur7ARSg_snoP25CtrLdPJOp9qD_69B830xUxDjDznC8jUw2Odda/exec";

const M_CONSCIENCE_DEFAULT = { integrity: 0.85, community: 0.72, karma: 0.78, wisdom: 0.90 };
const ConscienceContext = createContext(null);

export function ConscienceProvider({ children }) {
  const [metrics, setMetrics] = useState(M_CONSCIENCE_DEFAULT);
  const updateMetrics = (deltas) => {
    setMetrics((prev) => {
      const updated = { ...prev };
      Object.keys(deltas).forEach((key) => {
        updated[key] = Math.max(0, Math.min(1, prev[key] + deltas[key]));
      });
      return updated;
    });
  };

  const value = useMemo(() => ({ metrics, updateMetrics }), [metrics]);
  return <ConscienceContext.Provider value={value}>{children}</ConscienceContext.Provider>;
}

function useConscience() {
  const context = useContext(ConscienceContext);
  if (!context) throw new Error("useConscience must be used within a ConscienceProvider");
  return context;
}

export default function MatrixOfConscience() {
  return (
    <ConscienceProvider>
      <MatrixCoreMaster />
    </ConscienceProvider>
  );
}

const EXCHANGE_TIERS = [
  { id: 1, name: "Ella Assistant", cost: 1000, stars: 1, desc: "Baseline guardian. Unlocks UI hints and Vanguard shield." },
  { id: 2, name: "The Oracle", cost: 2000, stars: 2, desc: "Feedback terminal. Submit ideas for point bounties." },
  { id: 3, name: "The Sandbox", cost: 3000, stars: 3, desc: "Live code-testing. Entry to monthly developer contests." },
  { id: 4, name: "MAI (Combat AI)", cost: 4000, stars: 4, desc: "Self-aware combatant. Eye lasers and clone deployment." },
  { id: 5, name: "Trinity AI", cost: 5000, stars: 5, desc: "Sensory AI. Unlocks hidden secret pathways and Easter eggs." },
  { id: 6, name: "Boat to Nimbus Island", cost: 6000, stars: 6, desc: "Macro-economy layer. Sponsor Students and build towers." }
];

function MatrixCoreMaster() {
  const { metrics, updateMetrics } = useConscience();
  const [terminalLog, setTerminalLog] = useState("System online. Seven Stars Protocol loaded safely.");
  const [activeTab, setActiveTab] = useState("calibration");
  const [points, setPoints] = useState(parseInt(localStorage.getItem("playerScore") || "0", 10));
  const [unlockedStars, setUnlockedStars] = useState(JSON.parse(localStorage.getItem("aghl_sevenStarsCompleted") || "[]").length);
  const [unlocks, setUnlocks] = useState(JSON.parse(localStorage.getItem("mc_nexus_unlocks") || "[]"));

  const currentUserId = "nicholai_madias";

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("mc_nexus_unlocks", JSON.stringify(unlocks));
  }, [unlocks]);

  // Automated Telemetry Sync Loop
  useEffect(() => {
    const syncController = new AbortController();

    async function transmitMetrics() {
      try {
        await fetch(TELEMETRY_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            white: metrics.integrity,
            scarlet: metrics.karma,
            coherence: metrics.wisdom,
            points: points,
            unlockCount: unlocks.length,
            updatedAt: Date.now()
          }),
          signal: syncController.signal
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Conscience Matrix telemetry sync failed:", err);
        }
      }
    }

    transmitMetrics();
    return () => syncController.abort();
  }, [metrics, points, unlocks]);

  const handleCalibration = (dimension, value, logMessage) => {
    updateMetrics({ [dimension]: value, wisdom: 0.01 });
    setTerminalLog(`[Calibration] ${logMessage}`);
  };

  const handleBuy = (tier) => {
    if (unlocks.includes(tier.id)) {
      setTerminalLog(`[Exchange] ${tier.name} is already active.`);
      return;
    }
    if (points >= tier.cost && unlockedStars >= tier.stars) {
      const newPoints = points - tier.cost;
      setPoints(newPoints);
      localStorage.setItem("playerScore", String(newPoints));
      setUnlocks([...unlocks, tier.id]);
      setTerminalLog(`[Exchange] Success! ${tier.name} provisioned. Subsystems merging.`);
    } else {
      const missing = [];
      if (points < tier.cost) missing.push(`${tier.cost - points} more pts`);
      if (unlockedStars < tier.stars) missing.push(`${tier.stars - unlockedStars} more stars`);
      setTerminalLog(`[Exchange] Insufficient resources: Requires ${missing.join(' and ')}.`);
    }
  };

  return (
    <div className="mc-matrix-root">
      <div className="mc-container">

        <header className="mc-header">
          <p className="mc-badge">NEXUS ARCADE // CORE UNIFICATION</p>
          <h1>MATRIX OF CONSCIENCE</h1>
          <div className="mc-nav-row">
            <button className={`mc-nav-btn ${activeTab === "calibration" ? "active" : ""}`} onClick={() => setActiveTab("calibration")}>
              Calibration
            </button>
            <button className={`mc-nav-btn ${activeTab === "sevenstars" ? "active" : ""}`} onClick={() => setActiveTab("sevenstars")}>
              Seven Stars
            </button>
            <button className={`mc-nav-btn ${activeTab === "exchange" ? "active" : ""}`} onClick={() => setActiveTab("exchange")}>
              Nexus Exchange
            </button>
          </div>
        </header>

        <div className="mc-main-layout">

          <section className="mc-card mc-telemetry-panel">
            <h2>System Telemetry</h2>
            <div className="mc-points-box">
              <span className="pts-label">AVAILABLE POINTS</span>
              <span className="pts-value">{points.toLocaleString()}</span>
            </div>
            <div className="mc-bars-list">
              <MetricRow label="Integrity Matrix" value={metrics.integrity} color="var(--neon-blue)" />
              <MetricRow label="Community Thread" value={metrics.community} color="var(--neon-purple)" />
              <MetricRow label="Karma Continuum" value={metrics.karma} color="#f43f5e" />
              <MetricRow label="Wisdom Index" value={metrics.wisdom} color="var(--neon-gold)" />
            </div>
            <div className="mc-console-log">
              <div className="mc-log-terminal">{terminalLog}</div>
            </div>
          </section>

          <section className="mc-card mc-control-panel">
            {activeTab === "calibration" && (
              <>
                <h2>Calibration Core</h2>
                <p className="mc-panel-desc">Fine-tune behavioral parameters to eliminate entropy across the node.</p>
                <div className="mc-actions-group">
                  <button onClick={() => handleCalibration("integrity", 0.04, "Enforced strict truth bounds. Integrity incremented.")}>
                    Elevate Integrity
                  </button>
                  <button onClick={() => handleCalibration("community", 0.05, "Synchronized user network nodes. Community expanded.")}>
                    Harmonize Community
                  </button>
                  <button onClick={() => handleCalibration("karma", 0.03, "Balanced systemic transaction records. Karma stabilized.")}>
                    Calibrate Karma
                  </button>
                </div>
              </>
            )}

            {activeTab === "sevenstars" && (
              <>
                <h2>Seven Stars Protocol</h2>
                <p className="mc-panel-desc">Status tracking verification matrix for the Asia Minor deployment.</p>
                <div className="seven-stars-status-box">
                  {['Ephesus', 'Smyrna', 'Pergamum', 'Thyatira', 'Sardis', 'Philadelphia', 'Laodicea'].map(name => {
                    const isDone = JSON.parse(localStorage.getItem("aghl_sevenStarsCompleted") || "[]").includes(name);
                    return (
                      <div key={name} className={`star-status-item ${isDone ? 'checked' : ''}`}>
                        <span>{name}</span>
                        <span className="status-tag">{isDone ? "✔ Aligned" : "Pending"}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mc-actions-group" style={{ marginTop: "1.5rem" }}>
                  <a href="../certificates/" className="mc-action-anchor text-center">📜 View Certificates</a>
                </div>
              </>
            )}

            {activeTab === "exchange" && (
              <>
                <h2>Nexus Exchange</h2>
                <p className="mc-panel-desc">Acquire high-tier assets using verified stars and points.</p>
                <div className="mc-exchange-list">
                  {EXCHANGE_TIERS.map(tier => (
                    <div key={tier.id} className={`exchange-item ${unlocks.includes(tier.id) ? 'owned' : ''}`}>
                      <div className="tier-info">
                        <span className="tier-name">{tier.name}</span>
                        <span className="tier-desc">{tier.desc}</span>
                        <span className="tier-req">Req: {tier.stars} ⭐ + {tier.cost} pts</span>
                      </div>
                      <button 
                        className={`buy-btn ${unlocks.includes(tier.id) ? 'disabled' : ''}`}
                        onClick={() => handleBuy(tier)}
                        disabled={unlocks.includes(tier.id)}
                      >
                        {unlocks.includes(tier.id) ? "ACTIVE" : "ACQUIRE"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, color }) {
  const percentage = Math.round(value * 100);
  return (
    <div className="mc-metric-row">
      <div className="mc-row-header">
        <span className="mc-row-label">{label}</span>
        <span className="mc-row-pct" style={{ color }}>{percentage}%</span>
      </div>
      <div className="mc-progress-outer">
        <div className="mc-progress-inner" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
