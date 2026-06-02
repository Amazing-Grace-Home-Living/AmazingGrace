import React, { useState } from "react";
import { useHUD } from "../hud/HUDContext";
import { useAscensionEngine } from "./useAscensionEngine";
import { useNexusRouter } from "../router/useNexusRouter";
import LadderNode from "./LadderNode";
import CelestialLadder3D from "../ascension3d/CelestialLadder3D";
import AscensionHistoryPanel from "./AscensionHistoryPanel";
import Button from "../ui/Button";

export default function CelestialLadderScreen() {
  const { hud } = useHUD();
  const { ascend, incrementCosmicVirtue } = useAscensionEngine();
  const { go } = useNexusRouter();
  const [is3DMode, setIs3DMode] = useState(false);

  const layer = hud?.ascension?.layer || 0;
  const realms = hud?.ascension?.realms || [];
  const virtues = hud?.ascension?.cosmicVirtues || { illumination: 0, resonance: 0, transcendence: 0 };

  // Generate rungs representing each layer from 0 to the current ascended layer
  const rungs = [];
  for (let i = 0; i <= layer; i++) {
    rungs.push({
      index: i,
      label: i === 0 ? "Mortal Gateway" : realms[i - 1] || `Celestial Layer ${i}`
    });
  }

  return (
    <div className="celestial-ladder">
      {/* Parallax Starfield Background Layers */}
      <div className="ladder-background starfield-far" />
      <div className="ladder-background starfield-close" />
      <div className="ladder-scanlines" />

      {/* Main UI Header */}
      <header className="ladder-header">
        <h1 className="ladder-title">The Celestial Ladder</h1>
        <p className="ladder-subtitle">Axis Mundi — Spiritual Elevation Portal</p>
        <div style={{ marginTop: "15px" }}>
          <button 
            className="virtue-calibrate-btn" 
            onClick={() => setIs3DMode(!is3DMode)}
            style={{ padding: "6px 15px", fontSize: "0.8rem", letterSpacing: "1px" }}
          >
            🌌 {is3DMode ? "Switch to Standard View" : "Project 3D Hologram Mode"}
          </button>
        </div>
      </header>

      {/* Split Workspace Layout */}
      <div className="ladder-workspace">
        {/* LEFT PANEL: The Climber View */}
        <div className="ladder-climber-view" style={{ padding: is3DMode ? "10px" : "40px 20px" }}>
          {is3DMode ? (
            <CelestialLadder3D />
          ) : (
            <div className="ladder-column-container">
              <div className="ladder-beam" />
              <div className="ladder-column">
                {[...rungs].reverse().map((rung) => (
                  <LadderNode
                    key={rung.index}
                    index={rung.index}
                    label={rung.label}
                    active={rung.index === layer}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Metaphysical Telemetry Controls */}
        <div className="ladder-telemetry">
          {/* Cosmic Virtues Resonator */}
          <div className="hud-panel virtues-calibrator">
            <h3>Cosmic Virtues Calibration</h3>
            <p className="virtues-description">
              Elevate core metaphysical qualities to stabilize higher spatial dimensions.
            </p>
            <div className="virtues-grid">
              {Object.entries(virtues).map(([key, value]) => (
                <div key={key} className="virtue-card">
                  <div className="virtue-meta">
                    <span className="virtue-name">{key}</span>
                    <span className="virtue-val">{Number(value).toFixed(2)}</span>
                  </div>
                  <div className="virtue-bar-bg">
                    <div
                      className="virtue-bar-fill"
                      style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                    />
                  </div>
                  <button
                    className="virtue-calibrate-btn"
                    onClick={() => incrementCosmicVirtue(key)}
                  >
                    ⚡ Calibrate
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Scroll Panel */}
          <AscensionHistoryPanel />
        </div>
      </div>

      {/* Lower Navigation Controls */}
      <footer className="ladder-controls-bar">
        <Button variant="primary" onClick={ascend} className="ascend-trigger-btn">
          ✨ Ascend to Next Realm
        </Button>
        <Button variant="primary" onClick={() => go("aeon")} style={{ background: "linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)", borderColor: "#8b5cf6", fontWeight: "bold", boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)" }}>
          🌀 Engage Aeon Engine
        </Button>
        <Button variant="secondary" onClick={() => go("temple")}>
          🏛️ Return to Temple Map
        </Button>
      </footer>
    </div>
  );
}
