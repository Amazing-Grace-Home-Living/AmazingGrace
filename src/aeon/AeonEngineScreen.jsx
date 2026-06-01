import React from "react";
import { useHUD } from "../hud/HUDContext";
import { useAeonEngine } from "./useAeonEngine";
import { useNexusRouter } from "../router/useNexusRouter";
import Button from "../ui/Button";

export default function AeonEngineScreen() {
  const { hud } = useHUD();
  const { generateCycle } = useAeonEngine();
  const { go } = useNexusRouter();

  const aeon = hud?.aeon || {
    cycle: 0,
    cosmicVirtues: { illumination: 0, resonance: 0, transcendence: 0 },
    destinyPaths: [],
    resonanceEvents: [],
    overdrive: false,
    virtueStorm: null,
    mutatedRealms: [],
    crownUnlocked: false
  };

  const virtues = aeon.cosmicVirtues || { illumination: 0, resonance: 0, transcendence: 0 };
  const destinyPaths = aeon.destinyPaths || [];
  const resonanceEvents = aeon.resonanceEvents || [];
  const mutatedRealms = aeon.mutatedRealms || [];
  const isOverdrive = aeon.overdrive;
  const activeStorm = aeon.virtueStorm;
  const isCrownReady = aeon.crownUnlocked;

  return (
    <div className={`celestial-ladder aeon-screen ${isOverdrive ? "overdrive-active" : ""}`}>
      {/* Reusing parallax scrolling stars for celestial ambiance */}
      <div className="ladder-background starfield-far" />
      <div className="ladder-background starfield-close" />
      <div className="ladder-scanlines" />

      {/* Weather Storm Flash Overlay */}
      {activeStorm && (
        <div 
          className="virtue-storm-flash" 
          style={{
            position: "absolute",
            inset: 0,
            background: activeStorm === "Illumination Storm" 
              ? "rgba(255,255,255,0.06)" 
              : activeStorm === "Resonance Tempest" 
                ? "rgba(79, 209, 255, 0.05)" 
                : "rgba(236, 72, 153, 0.05)",
            pointerEvents: "none",
            zIndex: 1,
            animation: "pulse-storm 2s infinite ease-in-out"
          }}
        />
      )}

      {/* Main UI Header */}
      <header className="ladder-header">
        <h1 
          className="ladder-title" 
          style={{ 
            color: isOverdrive ? "#ec4899" : "#8b5cf6", 
            textShadow: isOverdrive 
              ? "0 0 20px rgba(236, 72, 153, 0.6)" 
              : "0 0 15px rgba(139, 92, 246, 0.5)" 
          }}
        >
          {isOverdrive ? "Aeon Engine (OVERDRIVE)" : "The Aeon Engine"}
        </h1>
        <p className="ladder-subtitle">
          {isOverdrive 
            ? "⚠️ CRITICAL LEVEL: Virtue Storms & Quantum mutations stabilized" 
            : "Fractal Destiny Generator & Metaphysical Reactor"}
        </p>
        
        {/* Active Weather Storm Badge */}
        {activeStorm && (
          <div style={{ marginTop: "10px" }}>
            <span 
              className="ui-alert ui-alert-warning" 
              style={{ 
                padding: "4px 12px", 
                borderRadius: "20px", 
                fontSize: "0.75rem", 
                fontWeight: "bold",
                background: "rgba(234, 179, 8, 0.15)",
                borderColor: "#eab308",
                boxShadow: "0 0 10px rgba(234, 179, 8, 0.3)"
              }}
            >
              🌀 ACTIVE WEATHER EVENT: {activeStorm.toUpperCase()}
            </span>
          </div>
        )}
      </header>

      {/* Split Dashboard Workspace */}
      <div className="ladder-workspace">
        {/* LEFT COLUMN: Reactor Core & Virtues */}
        <div className="ladder-climber-view" style={{ flexDirection: "column", padding: "30px", justifyContent: "flex-start", gap: "25px" }}>
          <div 
            className="aeon-reactor-core" 
            style={{ 
              borderColor: isOverdrive ? "#ec4899" : "rgba(139, 92, 246, 0.25)",
              boxShadow: isOverdrive 
                ? "inset 0 0 40px rgba(236, 72, 153, 0.3), 0 0 35px rgba(236, 72, 153, 0.2)" 
                : "inset 0 0 30px rgba(139, 92, 246, 0.2), 0 0 30px rgba(0, 0, 0, 0.6)"
            }}
          >
            <div className="aeon-cycle-display">
              <span className="aeon-cycle-label" style={{ color: isOverdrive ? "#f472b6" : "#a78bfa" }}>ACTIVE CYCLE</span>
              <span className="aeon-cycle-value" style={{ color: isOverdrive ? "#f472b6" : "#c084fc" }}>{aeon.cycle}</span>
            </div>
            <div 
              className="aeon-core-glow" 
              style={{ 
                borderColor: isOverdrive ? "rgba(236, 72, 153, 0.4)" : "rgba(139, 92, 246, 0.15)",
                animation: isOverdrive ? "aeonPulseGlow 2s infinite linear" : "aeonPulseGlow 4s infinite linear"
              }}
            />
          </div>

          <div className="hud-panel virtues-calibrator" style={{ width: "100%", background: "rgba(0,0,0,0.3)" }}>
            <h3 style={{ color: isOverdrive ? "#ec4899" : "#8b5cf6" }}>Cumulative Aeonic Virtues</h3>
            <div className="virtues-grid" style={{ marginTop: "15px" }}>
              {Object.entries(virtues).map(([key, value]) => (
                <div key={key} className="virtue-card" style={{ padding: "10px 15px" }}>
                  <div className="virtue-meta">
                    <span className="virtue-name" style={{ color: isOverdrive ? "#f472b6" : "#a78bfa" }}>{key}</span>
                    <span className="virtue-val" style={{ color: isOverdrive ? "#f472b6" : "#a78bfa" }}>{Number(value).toFixed(2)}</span>
                  </div>
                  <div className="virtue-bar-bg" style={{ height: "4px" }}>
                    <div
                      className="virtue-bar-fill"
                      style={{
                        width: `${Math.min(100, (value / 100) * 100)}%`,
                        background: isOverdrive 
                          ? "linear-gradient(90deg, #ec4899, #f472b6)" 
                          : "linear-gradient(90deg, #8b5cf6, #c084fc)"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Destiny Timeline, Mutations, & Event Logs */}
        <div className="ladder-telemetry">
          {/* Destiny Paths Scroll */}
          <div className="hud-panel ascension-history" style={{ border: isOverdrive ? "1px solid rgba(236, 72, 153, 0.25)" : "1px solid rgba(139, 92, 246, 0.15)" }}>
            <h3 style={{ color: isOverdrive ? "#f472b6" : "#a78bfa" }}>Fractal Destiny Branches</h3>
            <div style={{ maxHeight: "120px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
              {destinyPaths.length === 0 ? (
                <div className="history-empty">No destiny pathways forged yet.</div>
              ) : (
                [...destinyPaths].reverse().map((path, idx) => (
                  <div key={idx} style={{ background: "rgba(139, 92, 246, 0.05)", border: "1px solid rgba(139, 92, 246, 0.1)", borderRadius: "6px", padding: "8px 12px", fontSize: "0.8rem" }}>
                    <div style={{ color: "#e9d5ff", fontWeight: 600, wordBreak: "break-all" }}>🌿 {path}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mutated Realms Scroll */}
          {isOverdrive && (
            <div className="hud-panel ascension-history" style={{ border: "1px solid rgba(236, 72, 153, 0.25)" }}>
              <h3 style={{ color: "#ec4899" }}>Stabilized Cosmic Mutations</h3>
              <div style={{ maxHeight: "110px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                {mutatedRealms.length === 0 ? (
                  <div className="history-empty" style={{ color: "#f472b6" }}>Reality stable. No mutations.</div>
                ) : (
                  [...mutatedRealms].reverse().map((realm, idx) => (
                    <div key={idx} style={{ background: "rgba(236, 72, 153, 0.05)", border: "1px solid rgba(236, 72, 153, 0.1)", borderRadius: "6px", padding: "8px 12px", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#fbcfe8", fontWeight: 600 }}>🌌 {realm}</span>
                      <span style={{ color: "#f472b6", fontSize: "0.7rem" }}>MUTATED</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Resonance Event Ledger */}
          <div className="hud-panel ascension-history" style={{ border: isOverdrive ? "1px solid rgba(236, 72, 153, 0.25)" : "1px solid rgba(139, 92, 246, 0.15)" }}>
            <h3 style={{ color: isOverdrive ? "#f472b6" : "#a78bfa" }}>Resonance Event Logs</h3>
            <div style={{ maxHeight: "110px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
              {resonanceEvents.length === 0 ? (
                <div className="history-empty">Quiet in the Aeon. Initiate cycles to trigger resonance.</div>
              ) : (
                [...resonanceEvents].reverse().map((evt, idx) => (
                  <div key={idx} style={{ background: "rgba(15, 23, 42, 0.4)", border: isOverdrive ? "1px solid rgba(236, 72, 153, 0.1)" : "1px solid rgba(139, 92, 246, 0.05)", borderRadius: "6px", padding: "8px 12px", fontSize: "0.8rem", color: "#e2e8f0" }}>
                    ✨ {evt}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Panel */}
      <footer className="ladder-controls-bar" style={{ flexWrap: "wrap", justifyContent: "center" }}>
        <Button 
          variant="primary" 
          onClick={generateCycle} 
          className="ascend-trigger-btn" 
          style={{ 
            background: isOverdrive 
              ? "linear-gradient(90deg, #ec4899 0%, #be185d 100%)" 
              : "linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)", 
            borderColor: isOverdrive ? "#ec4899" : "#8b5cf6", 
            boxShadow: isOverdrive 
              ? "0 0 15px rgba(236, 72, 153, 0.4)" 
              : "0 0 15px rgba(139, 92, 246, 0.4)" 
          }}
        >
          🌀 {isOverdrive ? "Pump Overdrive Reactor" : "Generate Next Aeon Cycle"}
        </Button>

        {isCrownReady && (
          <Button 
            variant="primary" 
            onClick={() => go("empyrean")} 
            style={{ 
              background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)", 
              borderColor: "#f59e0b", 
              fontWeight: "bold", 
              boxShadow: "0 0 25px rgba(245, 158, 11, 0.7)",
              color: "#ffffff"
            }}
          >
            👑 Receive Crown of Light
          </Button>
        )}

        <Button variant="secondary" onClick={() => go("ascension")}>
          🪜 Return to Celestial Ladder
        </Button>
        <Button variant="secondary" onClick={() => go("temple")}>
          🏛️ Return to Temple Map
        </Button>
      </footer>
    </div>
  );
}
