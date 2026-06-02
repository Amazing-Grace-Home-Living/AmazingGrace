import React, { useState } from "react";
import LadderNode3D from "./LadderNode3D";
import HypercubeGlyph from "./HypercubeGlyph";
import { useHUD } from "../hud/HUDContext";
import { emit, Events } from "../core/eventBus";

export default function CelestialLadder3D() {
  const { hud } = useHUD();
  const [angle, setAngle] = useState(0);
  const [wAngle, setWAngle] = useState(0);
  const [isHypercube, setIsHypercube] = useState(false);

  const layer = hud?.ascension?.layer || 0;
  const realms = hud?.ascension?.realms || [];

  // Generate rungs representing each layer from 0 to the current ascended layer
  const rungs = [];
  for (let i = 0; i <= layer; i++) {
    rungs.push({
      index: i,
      label: i === 0 ? "Mortal Gateway" : realms[i - 1] || `Celestial Layer ${i}`
    });
  }

  function rotate(dir) {
    setAngle((a) => a + dir * 15);
  }

  function rotateW(dir) {
    setWAngle((w) => w + dir * 20);
    emit(Events.NOTIFY, {
      type: "info",
      message: `Hyper-rotated W-axis to ${((wAngle + dir * 20) % 360 + 360) % 360}°: Dimensional coordinates shifting.`
    });
  }

  function foldRealms() {
    if (layer < 1) {
      emit(Events.NOTIFY, {
        type: "error",
        message: "Ascension level insufficient: Must occupy Layer 1+ to fold dimensions."
      });
      return;
    }

    const currentRealm = realms[layer - 1] || `Layer ${layer}`;
    const priorRealm = layer === 1 ? "Mortal Gateway" : realms[layer - 2] || `Layer ${layer - 1}`;
    
    // De-structure names
    const word1 = currentRealm.split(" ")[0] || currentRealm;
    const word2 = priorRealm.split(" ")[1] || priorRealm;
    const foldedName = `${word1}ic ${word2} State`;

    emit(Events.NOTIFY, {
      type: "warning",
      message: `Realm Fold Synthesized: Collapsed "${currentRealm}" & "${priorRealm}" into a hybrid ${foldedName.toUpperCase()}!`
    });
  }

  return (
    <div className="ladder3d-wrapper">
      {/* 4D Mode distortion background */}
      {isHypercube && <div className="ladder-scanlines" style={{ opacity: 0.65, animation: "hypercube-drift 8s infinite linear" }} />}

      <div
        className="ladder3d"
        style={{
          transform: isHypercube 
            ? `rotateX(${20 + Math.sin(wAngle * Math.PI / 180) * 10}deg) rotateY(${angle}deg) rotateZ(${wAngle / 4}deg)`
            : `rotateX(20deg) rotateY(${angle}deg)`
        }}
      >
        <div className="ladder3d-beam" />

        {rungs.map((rung) => {
          const isActive = rung.index === layer;
          const relativeIndex = rung.index - layer;
          
          // Simulated 4D coordinate projection shifts:
          // Rotation on the 4th dimension (W-axis) shifts Z-depth and scales/blurs nodes
          const baseDepth = relativeIndex * 80;
          const wOffset = isHypercube ? Math.cos((wAngle + rung.index * 30) * Math.PI / 180) * 60 : 0;
          const depth = baseDepth + wOffset;
          
          const scale = isHypercube 
            ? 1 + Math.sin((wAngle + rung.index * 30) * Math.PI / 180) * 0.15
            : 1;

          const blur = isHypercube
            ? Math.max(0, Math.sin((wAngle + rung.index * 60) * Math.PI / 180) * 4)
            : 0;

          return (
            <React.Fragment key={rung.index}>
              {/* After-image shadow / Dimensional drift echo */}
              {isHypercube && isActive && (
                <div
                  className="ladder3d-node active-echo"
                  style={{
                    transform: `translateX(-50%) translateZ(${depth - 40}px) scale(${scale * 0.95})`,
                    opacity: 0.25,
                    filter: "blur(5px)",
                    pointerEvents: "none"
                  }}
                >
                  <div className="ladder3d-glyph">E</div>
                  <div className="ladder3d-label" style={{ color: "#4fd1ff" }}>{rung.label} Echo</div>
                </div>
              )}

              {/* Core Node */}
              <div
                className={`ladder3d-node ${isActive ? "active" : ""}`}
                style={{
                  transform: `translateX(-50%) translateZ(${depth}px) scale(${scale})`,
                  filter: blur > 0.5 ? `blur(${blur}px)` : "none",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease"
                }}
              >
                <div className="ladder3d-glyph">
                  {isHypercube ? (
                    <HypercubeGlyph index={rung.index} active={isActive} wAngle={wAngle} />
                  ) : (
                    rung.index + 1
                  )}
                </div>
                <div className="ladder3d-label">{rung.label}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="ladder3d-controls" style={{ flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => rotate(-1)} className="holo-rotate-btn">⟵ Rotate Y</button>
          <button onClick={() => rotate(1)} className="holo-rotate-btn">Rotate Y ⟶</button>
        </div>

        {/* 4D controls bar */}
        {isHypercube && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => rotateW(-1)} className="holo-rotate-btn" style={{ borderColor: "#8b5cf6", color: "#c084fc" }}>⟵ Spin W-Axis</button>
            <button onClick={() => rotateW(1)} className="holo-rotate-btn" style={{ borderColor: "#8b5cf6", color: "#c084fc" }}>Spin W-Axis ⟶</button>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setIsHypercube(!isHypercube)} 
            className="holo-rotate-btn" 
            style={{ 
              borderColor: isHypercube ? "#ec4899" : "#3b82f6", 
              color: isHypercube ? "#f472b6" : "#60a5fa",
              fontWeight: "bold",
              width: "100%"
            }}
          >
            🌀 {isHypercube ? "Disable Hypercube (4D)" : "Enable Hypercube (4D) Projection"}
          </button>
        </div>

        {isHypercube && (
          <button 
            onClick={foldRealms} 
            className="holo-rotate-btn"
            style={{ borderColor: "#a855f7", color: "#d8b4fe", width: "100%" }}
          >
            🪐 Fold Dimensional Realms
          </button>
        )}
      </div>
    </div>
  );
}
