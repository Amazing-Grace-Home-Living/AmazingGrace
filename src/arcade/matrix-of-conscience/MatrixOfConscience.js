import { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import "./matrix-of-conscience.css";

// Unified Apps Script Telemetry Sink Gateway
const TELEMETRY_ENDPOINT = "https://script.google.com/macros/s/AKfycbyq6jzCVGtoOTcid-LzD_njmuuOOSwJrhktU3ya1GKXLZI9jp6yCMJzlrdvyNb1fpkb/exec";

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

function MatrixCoreMaster() {
  const { metrics, updateMetrics } = useConscience();
  const [terminalLog, setTerminalLog] = useState("System online. Seven Stars Protocol loaded safely.");
  const [activeTab, setActiveTab] = useState("calibration");
  const currentUserId = "nicholai_madias";

  // Automated Telemetry Sync Loop
  useEffect(() => {
    const syncController = new AbortController();

    async function transmitMetrics() {
      try {
        await fetch(TELEMETRY_ENDPOINT, {
          method: "POST",
          mode: "no-cors", // Essential to bypass CORS preflight validation blockers on script macros
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            white: metrics.integrity,      // Synced to White Thread parameters
            scarlet: metrics.karma,         // Synced to Scarlet Thread parameters
            coherence: metrics.wisdom,      // Synced to Coherence Matrix parameters
            updatedAt: Date.now()
          }),
          signal: syncController.signal
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Conscience Matrix telemetry drop-off on sync cycle:", err);
        }
      }
    }

    transmitMetrics();
    return () => syncController.abort();
  }, [metrics]);

  const handleCalibration = (dimension, value, logMessage) => {
    updateMetrics({ [dimension]: value, wisdom: 0.01 });
    setTerminalLog(`[Calibration] ${logMessage}`);
  };

  // Seven Stars Localized Verification Routine
  const handleSevenStarsReset = () => {
    updateMetrics({ integrity: 0.10, community: 0.10, karma: 0.10, wisdom: 0.05 });
    setTerminalLog("[Protocol] Seven Stars parameters clear. Relocating alignment vectors.");
  };

  return (
    <div className="mc-matrix-root">
      <div className="mc-container">
        
        {/* Navigation Header */}
        <header className="mc-header">
          <p className="mc-badge">NEXUS ARCADE // CORE UNIFICATION</p>
          <h1>MATRIX OF CONSCIENCE</h1>
          <div className="mc-nav-row">
            <button className={`mc-nav-btn ${activeTab === "calibration" ? "active" : ""}`} onClick={() => setActiveTab("calibration")}>
              Calibration Core
            </button>
            <button className={`mc-nav-btn ${activeTab === "sevenstars" ? "active" : ""}`} onClick={() => setActiveTab("sevenstars")}>
              Seven Stars Status
            </button>
          </div>
        </header>

        {/* Dynamic Display Tier */}
        <div className="mc-main-layout">
          
          {/* Constant Left Hand Telemetry Dashboard */}
          <section className="mc-card mc-telemetry-panel">
            <h2>System Telemetry</h2>
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

          {/* Right Hand Context Control Panels */}
          {activeTab === "calibration" ? (
            <section className="mc-card mc-control-panel">
              <h2>Calibration Interface</h2>
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
            </section>
          ) : (
            <section className="mc-card mc-control-panel">
              <h2>Seven Stars Protocol</h2>
              <p className="mc-panel-desc">Status tracking verification matrix for the Philippines deployment.</p>
              
              <div className="seven-stars-status-box">
                <div className="star-status-item checked"><span> Ephesus</span> <span className="status-tag">✔ Aligned</span></div>
                <div className="star-status-item checked"><span> Smyrna</span> <span className="status-tag">✔ Aligned</span></div>
                <div className="star-status-item checked"><span> Pergamum</span> <span className="status-tag">✔ Aligned</span></div>
                <div className="star-status-item checked"><span> Thyatira</span> <span className="status-tag">✔ Aligned</span></div>
                <div className="star-status-item checked"><span> Sardis</span> <span className="status-tag">✔ Aligned</span></div>
                <div className="star-status-item checked"><span> Philadelphia</span> <span className="status-tag">✔ Aligned</span></div>
                <div className="star-status-item checked"><span> Laodicea</span> <span className="status-tag">✔ Aligned</span></div>
              </div>

              <div className="mc-actions-group" style={{ marginTop: "1.5rem" }}>
                <a href="../certificates/" className="mc-action-anchor text-center">
                  📜 View & Download Certificates
                </a>
                <button className="mc-btn-danger" onClick={handleSevenStarsReset}>
                  ↺ Recalibrate Seven Stars Matrix
                </button>
              </div>
            </section>
          )}

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
