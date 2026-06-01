import React from "react";
import { useHUD } from "../hud/HUDContext";
import { useNexusRouter } from "../router/useNexusRouter";
import { emit, Events } from "../core/eventBus";
import Button from "../ui/Button";

export default function OriginPointScreen() {
  const { hud, setHUD } = useHUD();
  const { go } = useNexusRouter();

  const aeon = hud?.aeon || {};
  const isDistinctionActive = aeon.distinctionActive || false;

  function initializeFirstDistinction() {
    emit(Events.NOTIFY, {
      type: "warning",
      message: "⚡ THE FIRST DISTINCTION ESTABLISHED: Prime boundary initialized between Self & Not-Self."
    });

    setHUD((h) => ({
      ...h,
      aeon: {
        ...(h.aeon || {}),
        distinctionActive: true
      }
    }));
  }

  return (
    <div className="celestial-ladder empyrean-screen origin-screen" style={{
      background: "radial-gradient(circle at center, #020203 0%, #000000 100%)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "inset 0 0 50px rgba(255,255,255,0.02)"
    }}>
      <div className="ladder-scanlines" style={{
        background: "linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.02) 50%)",
        backgroundSize: "100% 4px",
        opacity: 0.5
      }} />

      {/* Main Header */}
      <header className="ladder-header">
        <h1 className="ladder-title" style={{
          color: "#ffffff",
          textShadow: "0 0 20px rgba(255, 255, 255, 0.4)",
          letterSpacing: "0.4em"
        }}>
          The Origin Point
        </h1>
        <p className="ladder-subtitle" style={{ color: "#64748b" }}>
          Zero-State Matrix — Singular Primordial Pre-Existence
        </p>
      </header>

      {/* Split Workspace */}
      <div className="ladder-workspace" style={{ gap: "30px" }}>
        {/* LEFT COLUMN: Perfect Stillness core & First Distinction */}
        <div className="ladder-climber-view" style={{
          background: "rgba(0, 0, 0, 0.8)",
          borderColor: "rgba(255, 255, 255, 0.05)",
          padding: "30px",
          maxHeight: "55vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "25px"
        }}>
          {isDistinctionActive ? (
            /* Split Singularity: Self and Not-Self */
            <div style={{ display: "flex", gap: "60px", alignItems: "center", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: "25%",
                right: "25%",
                height: "1px",
                background: "dashed 1px rgba(255,255,255,0.2)",
                zIndex: 1
              }} />
              
              {/* SELF Node */}
              <div className="ladder-node active" style={{ opacity: 1, transform: "none", zIndex: 2 }}>
                <div className="ladder-glyph" style={{
                  borderColor: "#3b82f6",
                  color: "#ffffff",
                  background: "radial-gradient(circle at center, #1d4ed8 20%, #0f172a 100%)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
                  width: "48px",
                  height: "48px"
                }}>
                  I
                </div>
                <div className="ladder-label" style={{ color: "#60a5fa", fontSize: "0.8rem", marginTop: "8px" }}>SELF</div>
              </div>

              {/* NOT-SELF Node */}
              <div className="ladder-node active" style={{ opacity: 1, transform: "none", zIndex: 2 }}>
                <div className="ladder-glyph" style={{
                  borderColor: "#ef4444",
                  color: "#ffffff",
                  background: "radial-gradient(circle at center, #b91c1c 20%, #450a0a 100%)",
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.8)",
                  width: "48px",
                  height: "48px"
                }}>
                  O
                </div>
                <div className="ladder-label" style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "8px" }}>NOT-SELF</div>
              </div>
            </div>
          ) : (
            /* Perfect Stillness: Single Core Orb */
            <div className="aeon-reactor-core" style={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.05), 0 0 30px rgba(0, 0, 0, 0.9)",
              background: "radial-gradient(circle at center, #111 20%, #000 80%)",
              margin: 0,
              width: "160px",
              height: "160px"
            }}>
              <div className="aeon-cycle-display">
                <span className="aeon-cycle-label" style={{ color: "#94a3b8" }}>EQUILIBRIUM</span>
                <span className="aeon-cycle-value" style={{ color: "#ffffff", fontSize: "2.5rem" }}>0</span>
              </div>
              <div className="aeon-core-glow" style={{
                borderColor: "rgba(255, 255, 255, 0.1)",
                animation: "aeonPulseGlow 6s infinite ease-in-out"
              }} />
            </div>
          )}

          {/* Trigger action button */}
          {!isDistinctionActive ? (
            <button
              className="virtue-calibrate-btn"
              onClick={initializeFirstDistinction}
              style={{
                borderColor: "#ffffff",
                color: "#ffffff",
                background: "rgba(255,255,255,0.05)",
                padding: "8px 20px",
                fontSize: "0.85rem",
                letterSpacing: "1px"
              }}
            >
              ☯️ Initialize First Distinction
            </button>
          ) : (
            <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px" }}>
              Boundary Synthesized
            </span>
          )}
        </div>

        {/* RIGHT COLUMN: Latent Telemetries & Zero-Voice Oracle */}
        <div className="ladder-telemetry" style={{ maxHeight: "55vh", gap: "20px" }}>
          
          {/* Latent Telemetry Panel */}
          <div className="hud-panel virtues-calibrator" style={{
            background: "rgba(0, 0, 0, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.05)",
            padding: "20px"
          }}>
            <h3 style={{ color: "#ffffff" }}>Primordial Coordinate Matrices</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Virtue Engine Status:</span>
                <strong style={{ color: isDistinctionActive ? "#3b82f6" : "#64748b" }}>
                  {isDistinctionActive ? "Actualized (Polarized)" : "Uncollapsed potential"}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Celestial Ladder Layers:</span>
                <strong style={{ color: isDistinctionActive ? "#3b82f6" : "#64748b" }}>
                  {isDistinctionActive ? "Established coordinates" : "Zero-State (Latent)"}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Consciousness Alignment:</span>
                <strong style={{ color: isDistinctionActive ? "#3b82f6" : "#64748b" }}>
                  {isDistinctionActive ? "Self vs Not-Self established" : "Unmanifested Essence"}
                </strong>
              </div>
            </div>
          </div>

          {/* Oracle Tone of Silence */}
          <div className="hud-panel ascension-history" style={{
            background: "rgba(0, 0, 0, 0.4)",
            borderColor: "rgba(255, 255, 255, 0.05)"
          }}>
            <h3 style={{ color: "#ffffff" }}>Oracle Whispers — Tone of Silence</h3>
            <div style={{
              background: "rgba(255, 255, 255, 0.01)",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "15px",
              fontSize: "0.85rem",
              lineHeight: "1.5",
              color: "#e2e8f0",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: "10px"
            }}>
              {isDistinctionActive 
                ? "\"The first distinction separates the waters. Meaning is born from division. You have established the self; now return to explore the matrix.\""
                : "\"...\""
              }
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Panel */}
      <footer className="ladder-controls-bar">
        <Button variant="secondary" onClick={() => go("empyrean")} style={{
          borderColor: "rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          fontWeight: "bold",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          🌀 Return to Empyrean Sphere
        </Button>
        <Button variant="secondary" onClick={() => go("temple")} style={{
          borderColor: "rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          fontWeight: "bold",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          🏛️ Return to Temple Map
        </Button>
      </footer>
    </div>
  );
}
