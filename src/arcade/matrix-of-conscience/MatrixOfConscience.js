import { useEffect, useMemo, useState, createContext, useContext } from "react";
import "./matrix-of-conscience.css";

const TELEMETRY_ENDPOINT = "https://script.google.com/macros/s/AKfycbxLWV71pwzoZIyxyur7ARSg_snoP25CtrLdPJOp9qD_69B830xUxDjDznC8jUw2Odda/exec";

// Expanded default state to include the macro-economy
const M_CONSCIENCE_DEFAULT = { 
  integrity: 0.85, community: 0.72, karma: 0.78, wisdom: 0.90,
  points: 0, stars: 0, inventory: [] 
};

const ConscienceContext = createContext(null);

export function ConscienceProvider({ children }) {
  const [metrics, setMetrics] = useState(M_CONSCIENCE_DEFAULT);
  
  const updateMetrics = (deltas) => {
    setMetrics((prev) => {
      const updated = { ...prev };
      if (deltas.integrity) updated.integrity = Math.max(0, Math.min(1, prev.integrity + deltas.integrity));
      if (deltas.community) updated.community = Math.max(0, Math.min(1, prev.community + deltas.community));
      if (deltas.karma) updated.karma = Math.max(0, Math.min(1, prev.karma + deltas.karma));
      if (deltas.wisdom) updated.wisdom = Math.max(0, Math.min(1, prev.wisdom + deltas.wisdom));
      if (deltas.points !== undefined) updated.points = prev.points + deltas.points;
      if (deltas.stars !== undefined) updated.stars = prev.stars + deltas.stars;
      if (deltas.newItem) updated.inventory = [...prev.inventory, deltas.newItem];
      return updated;
    });
  };

  const value = useMemo(() => ({ metrics, updateMetrics }), [metrics]);
  return <ConscienceContext.Provider value={value}>{children}</ConscienceContext.Provider>;
}

function useConscience() {
  return useContext(ConscienceContext);
}

// Nexus Exchange Store Inventory Database
const NEXUS_STORE_ITEMS = [
  { id: "ella", name: "Ella Assistant", cost: 1000, starsReq: 1, desc: "Guides, protects, and teaches. Grants a baseline shield in Vanguard.", icon: "🛡️" },
  { id: "oracle", name: "The Oracle", cost: 2000, starsReq: 2, desc: "Submit real ideas to improve the Matrix for massive point bounties.", icon: "👁️" },
  { id: "sandbox", name: "The Sandbox", cost: 3000, starsReq: 3, desc: "Live code-testing environment. Enter monthly developer contests.", icon: "💻" },
  { id: "mai", name: "MAI (Combat AI)", cost: 4000, starsReq: 4, desc: "Self-aware AI with X-Ray vision. Deploys clones to fight Red Queen agents.", icon: "⚔️" },
  { id: "trinity", name: "Trinity", cost: 5000, starsReq: 5, desc: "Ultimate sensory AI. Reveals hidden secret pathways MAI and Ella miss.", icon: "✨" },
  { id: "nimbus_boat", name: "Boat to Nimbus Island", cost: 6000, starsReq: 6, desc: "Unlocks the Vanguard Tower Defense node and island building macro-economy.", icon: "⛵" }
];

export default function MatrixOfConscience() {
  return (
    <ConscienceProvider>
      <MatrixCoreMaster />
    </ConscienceProvider>
  );
}

function MatrixCoreMaster() {
  const { metrics, updateMetrics } = useConscience();
  const [terminalLog, setTerminalLog] = useState("System online. Standalone Unification Model deployed safely.");
  const [activeTab, setActiveTab] = useState("calibration");
  const [selectedStar, setSelectedStar] = useState(null);
  
  const currentUserId = "nicholai_madias";

  // M45 Grid
  const [grid, setGrid] = useState([
    ["🔷", "⭐", "★", "⭐", "🔷", "♦", "🔷"],
    ["♦", "🔷", "⭐", "♦", "⬢", "⬢", "★"],
    ["★", "♦", "🔷", "★", "★", "🔷", "⬢"],
    ["♦", "⬢", "⭐", "⬢", "⭐", "⭐", "⬢"],
    ["🔷", "♦", "🔷", "🔷", "⭐", "⭐", "🔷"],
    ["★", "★", "⬢", "⬢", "🔷", "⬢", "⬢"],
    ["🔷", "⭐", "★", "🔷", "⭐", "⬢", "🔷"]
  ]);

  // Telemetry Sync
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
            points: metrics.points,
            stars: metrics.stars,
            updatedAt: Date.now()
          }),
          signal: syncController.signal
        });
      } catch (err) {
        if (err.name !== "AbortError") console.warn("Telemetry missed sync cycle:", err);
      }
    }
    transmitMetrics();
    return () => syncController.abort();
  }, [metrics]);

  const handleTileClick = (r, c) => {
    if (selectedStar === null) {
      setSelectedStar({ r, c });
    } else {
      const distance = Math.abs(selectedStar.r - r) + Math.abs(selectedStar.c - c);
      if (distance === 1) {
        const nextGrid = grid.map(row => [...row]);
        const temp = nextGrid[selectedStar.r][selectedStar.c];
        nextGrid[selectedStar.r][selectedStar.c] = nextGrid[r][c];
        nextGrid[r][c] = temp;
        setGrid(nextGrid);
        
        // Economy Hook: Swapping earns points
        updateMetrics({ integrity: 0.01, points: 50 });
        setTerminalLog(`[M45 Shifter] Node aligned. +50 Points.`);
      }
      setSelectedStar(null);
    }
  };

  const handleSevenStarsCalibration = (starName) => {
    // Economy Hook: Calibrating a star earns a Star and 500 points
    updateMetrics({ community: 0.02, stars: 1, points: 500 });
    setTerminalLog(`[Protocol] ${starName} calibrated. +1 Star, +500 Points.`);
  };

  const handlePurchase = (item) => {
    if (metrics.inventory.includes(item.id)) {
      setTerminalLog(`[Exchange] ${item.name} is already acquired.`);
      return;
    }
    if (metrics.stars < item.starsReq) {
      setTerminalLog(`[Exchange] Insufficient Stars. Requires ${item.starsReq} ⭐.`);
      return;
    }
    if (metrics.points < item.cost) {
      setTerminalLog(`[Exchange] Insufficient Points. Requires ${item.cost} PTS.`);
      return;
    }
    
    updateMetrics({ points: -item.cost, newItem: item.id });
    setTerminalLog(`[Exchange] Acquired ${item.name}. Asset integrated into local matrix.`);
  };

  return (
    <div className="mc-matrix-root">
      <div className="mc-container">
        <header className="mc-header">
          <p className="mc-badge">NEXUS ARCADE // CORE UNIFICATION</p>
          <h1>MATRIX OF CONSCIENCE</h1>
          <div className="mc-nav-row">
            <button className={`mc-nav-btn ${activeTab === "calibration" ? "active" : ""}`} onClick={() => setActiveTab("calibration")}>
              M45 Grid
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
          {/* Constant Telemetry Panel */}
          <section className="mc-card mc-telemetry-panel">
            <h2>System Telemetry</h2>
            
            <div className="mc-economy-readout">
              <div className="econ-stat"><span>Bank</span> <span className="econ-val cyan">{metrics.points} PTS</span></div>
              <div className="econ-stat"><span>Clearance</span> <span className="econ-val gold">{metrics.stars} ⭐</span></div>
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

          {/* Dynamic Right Panel */}
          {activeTab === "calibration" && (
            <section className="mc-card mc-control-panel">
              <h2>M45 Constellation Shifter</h2>
              <p className="mc-panel-desc">Align neighbor nodes to harvest network points for the Exchange.</p>
              <div className="m45-interactive-grid">
                {grid.map((row, r) => (
                  <div key={r} className="m45-row">
                    {row.map((tile, c) => {
                      const isSelected = selectedStar && selectedStar.r === r && selectedStar.c === c;
                      return (
                        <button key={c} className={`m45-tile ${isSelected ? "selected-node" : ""}`} onClick={() => handleTileClick(r, c)}>
                          {tile}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "sevenstars" && (
            <section className="mc-card mc-control-panel">
              <h2>Seven Stars Alignment</h2>
              <p className="mc-panel-desc">Validate nodes to earn Stars. Stars unlock higher tier Exchange assets.</p>
              <div className="seven-stars-status-box">
                {["Ephesus", "Smyrna", "Pergamum", "Thyatira", "Sardis", "Philadelphia", "Laodicea"].map((star) => (
                  <div key={star} className="star-status-item" onClick={() => handleSevenStarsCalibration(star)}>
                    <span>✨ {star}</span>
                    <span className="status-tag click-trigger">⚡ Calibrate (+1⭐)</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "exchange" && (
            <section className="mc-card mc-control-panel">
              <h2>Nexus Exchange</h2>
              <p className="mc-panel-desc">Deploy harvested resources to unlock advanced AI modules and domains.</p>
              
              <div className="nexus-store-grid">
                {NEXUS_STORE_ITEMS.map((item) => {
                  const isOwned = metrics.inventory.includes(item.id);
                  const canAfford = metrics.points >= item.cost && metrics.stars >= item.starsReq;
                  const cardStatus = isOwned ? "owned" : (canAfford ? "available" : "locked");

                  return (
                    <div key={item.id} className={`store-card ${cardStatus}`}>
                      <div className="store-card-header">
                        <span className="store-icon">{item.icon}</span>
                        <h3>{item.name}</h3>
                      </div>
                      <p className="store-desc">{item.desc}</p>
                      
                      <div className="store-reqs">
                        <span className={metrics.stars >= item.starsReq ? "met" : "unmet"}>{item.starsReq} ⭐</span>
                        <span className={metrics.points >= item.cost ? "met" : "unmet"}>{item.cost} PTS</span>
                      </div>

                      <button 
                        className="store-buy-btn"
                        disabled={isOwned || !canAfford}
                        onClick={() => handlePurchase(item)}
                      >
                        {isOwned ? "ASSET INTEGRATED" : (canAfford ? "AUTHORIZE ACQUISITION" : "REQUIREMENTS NOT MET")}
                      </button>
                    </div>
                  );
                })}
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
