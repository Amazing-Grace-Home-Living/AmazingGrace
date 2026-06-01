import { useEffect, useMemo, useState, createContext, useContext } from "react";
import "./matrix-of-conscience.css";

const TELEMETRY_ENDPOINT = "https://script.google.com/macros/s/AKfycbxLWV71pwzoZIyxyur7ARSg_snoP25CtrLdPJOp9qD_69B830xUxDjDznC8jUw2Odda/exec";

// Expanded default state to include the macro-economy
const M_CONSCIENCE_DEFAULT = { 
  integrity: 0.85, community: 0.72, karma: 0.78, wisdom: 0.90,
  points: parseInt(localStorage.getItem('playerScore') || '0', 10), 
  stars: JSON.parse(localStorage.getItem("aghl_sevenStarsCompleted") || "[]").length, 
  inventory: JSON.parse(localStorage.getItem("mc_nexus_unlocks") || "[]")
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
      
      if (deltas.points !== undefined) {
        updated.points = prev.points + deltas.points;
        localStorage.setItem('playerScore', updated.points);
      }
      
      if (deltas.stars !== undefined) {
        updated.stars = prev.stars + deltas.stars;
      }

      if (deltas.newItem) {
        updated.inventory = [...prev.inventory, deltas.newItem];
        localStorage.setItem("mc_nexus_unlocks", JSON.stringify(updated.inventory));
      }
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

// Seven Stars Quiz Content
const CHURCHES = [
  { name: 'Ephesus', message: 'The church in Ephesus was known for its hard work and perseverance. However, Jesus warned them that they had abandoned their first love.', question: 'What had the church in Ephesus abandoned?', options: ['Their generosity', 'Their first love', 'Their church building', 'Their daily prayers'], answer: 'Their first love' },
  { name: 'Smyrna', message: 'The church in Smyrna faced tribulation and poverty, yet Jesus praised their faithfulness and told them not to fear suffering.', question: 'What did Jesus tell Smyrna not to fear?', options: ['False prophets', 'Poverty', 'Suffering', 'Travel'], answer: 'Suffering' },
  { name: 'Pergamum', message: 'Pergamum held fast to Jesus’ name in a difficult city, but some there were tolerating false teaching.', question: 'What problem did Pergamum tolerate?', options: ['False teaching', 'Silence', 'No worship songs', 'Lack of elders'], answer: 'False teaching' },
  { name: 'Thyatira', message: 'Thyatira was praised for love, faith, service, and perseverance, but rebuked for tolerating corruption.', question: 'What was Thyatira praised for?', options: ['Military power', 'Love and service', 'Wealth alone', 'Temple size'], answer: 'Love and service' },
  { name: 'Sardis', message: 'Sardis had a reputation for being alive, but Jesus said they were dead and needed to wake up.', question: 'What did Sardis need to do?', options: ['Build larger walls', 'Wake up', 'Move cities', 'Collect offerings'], answer: 'Wake up' },
  { name: 'Philadelphia', message: 'Philadelphia had little strength, but kept Jesus’ word and did not deny His name. An open door was set before them.', question: 'What was set before Philadelphia?', options: ['A closed gate', 'A golden crown', 'An open door', 'A mountain path'], answer: 'An open door' },
  { name: 'Laodicea', message: 'Laodicea was called lukewarm—neither hot nor cold—and was warned against complacency.', question: 'How was Laodicea described?', options: ['Faithful', 'Bold', 'Lukewarm', 'Joyful'], answer: 'Lukewarm' }
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
  const [selectedTile, setSelectedTile] = useState(null);
  
  // Quiz State
  const [completedStars, setCompletedStars] = useState(JSON.parse(localStorage.getItem("aghl_sevenStarsCompleted") || "[]"));
  const [activeChurch, setActiveChurch] = useState(null);

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
    if (selectedTile === null) {
      setSelectedTile({ r, c });
    } else {
      const distance = Math.abs(selectedTile.r - r) + Math.abs(selectedTile.c - c);
      if (distance === 1) {
        const nextGrid = grid.map(row => [...row]);
        const temp = nextGrid[selectedTile.r][selectedTile.c];
        nextGrid[selectedTile.r][selectedTile.c] = nextGrid[r][c];
        nextGrid[r][c] = temp;
        setGrid(nextGrid);
        
        updateMetrics({ integrity: 0.01, points: 50 });
        setTerminalLog(`[M45 Shifter] Node aligned. +50 Points.`);
      }
      setSelectedTile(null);
    }
  };

  const handleQuizAnswer = (churchName, selected, correct) => {
    if (selected === correct) {
      if (!completedStars.includes(churchName)) {
        const nextCompleted = [...completedStars, churchName];
        setCompletedStars(nextCompleted);
        localStorage.setItem("aghl_sevenStarsCompleted", JSON.stringify(nextCompleted));
        updateMetrics({ community: 0.02, points: 500, stars: 1 });
        setTerminalLog(`[Protocol] ${churchName} aligned. +1 Star, +500 Points.`);
      } else {
        setTerminalLog(`[Protocol] ${churchName} already verified.`);
      }
      setActiveChurch(null);
    } else {
      setTerminalLog(`[Protocol] Verification failed for ${churchName}. Reflect on the message.`);
    }
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
            <button className={`mc-nav-btn ${activeTab === "calibration" ? "active" : ""}`} onClick={() => {setActiveTab("calibration"); setActiveChurch(null);}}>
              M45 Grid
            </button>
            <button className={`mc-nav-btn ${activeTab === "sevenstars" ? "active" : ""}`} onClick={() => setActiveTab("sevenstars")}>
              Seven Stars
            </button>
            <button className={`mc-nav-btn ${activeTab === "exchange" ? "active" : ""}`} onClick={() => {setActiveTab("exchange"); setActiveChurch(null);}}>
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
          <section className="mc-card mc-control-panel">
            {activeTab === "calibration" && (
              <>
                <h2>M45 Constellation Shifter</h2>
                <p className="mc-panel-desc">Align neighbor nodes to harvest network points for the Exchange.</p>
                <div className="m45-interactive-grid">
                  {grid.map((row, r) => (
                    <div key={r} className="m45-row">
                      {row.map((tile, c) => {
                        const isSelected = selectedTile && selectedTile.r === r && selectedTile.c === c;
                        return (
                          <button key={c} className={`m45-tile ${isSelected ? "selected-node" : ""}`} onClick={() => handleTileClick(r, c)}>
                            {tile}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "sevenstars" && (
              <>
                <h2>Seven Stars Alignment</h2>
                {!activeChurch ? (
                  <>
                    <p className="mc-panel-desc">Validate nodes to earn Stars. Stars unlock higher tier Exchange assets.</p>
                    <div className="seven-stars-status-box">
                      {CHURCHES.map((church) => {
                        const isDone = completedStars.includes(church.name);
                        return (
                          <div key={church.name} className={`star-status-item ${isDone ? 'checked' : ''}`} onClick={() => setActiveChurch(church)}>
                            <span>✨ {church.name}</span>
                            <span className="status-tag click-trigger">{isDone ? "✔ Aligned" : "⚡ Calibrate (+1⭐)"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="quiz-container">
                    <h3>{activeChurch.name.toUpperCase()}</h3>
                    <p className="mc-panel-desc" style={{background:'rgba(0,0,0,0.3)', padding:'1rem', borderRadius:'10px'}}>{activeChurch.message}</p>
                    <div className="mc-actions-group">
                      <p style={{fontWeight:'bold', color:'var(--neon-gold)', marginBottom:'0.5rem'}}>{activeChurch.question}</p>
                      {activeChurch.options.map(opt => (
                        <button key={opt} onClick={() => handleQuizAnswer(activeChurch.name, opt, activeChurch.answer)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    <button className="mc-btn-danger" style={{marginTop:'1rem'}} onClick={() => setActiveChurch(null)}>← BACK TO MAP</button>
                  </div>
                )}
              </>
            )}

            {activeTab === "exchange" && (
              <>
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
