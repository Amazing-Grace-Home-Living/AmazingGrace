import React from "react";
import { useHUD } from "../hud/HUDContext";
import { useAscensionEngine } from "./useAscensionEngine";
import { useNexusRouter } from "../router/useNexusRouter";
import Button from "../ui/Button";

export default function AscensionScreen() {
  const { hud } = useHUD();
  const { ascend, incrementCosmicVirtue } = useAscensionEngine();
  const { go } = useNexusRouter();

  const layer = hud?.ascension?.layer || 0;
  const realms = hud?.ascension?.realms || [];
  const cosmicVirtues = hud?.ascension?.cosmicVirtues || { illumination: 0, resonance: 0, transcendence: 0 };

  return (
    <div
      className="ascension-screen"
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "0 auto",
        background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.04) 0%, rgba(5, 5, 8, 0.98) 75%)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        borderRadius: "16px",
        boxShadow: "0 0 50px rgba(16, 185, 129, 0.05)",
        minHeight: "540px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1
          style={{
            color: "#10b981",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontSize: "2.2rem",
            marginBottom: "5px",
            textShadow: "0 0 15px rgba(16, 185, 129, 0.4)"
          }}
        >
          THE ASCENSION CYCLE
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px" }}>
          Infinite Celestial Progression Layer
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
          textAlign: "left"
        }}
      >
        {/* CELESTIAL METRICS */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(16, 185, 129, 0.1)",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h2 style={{ color: "#10b981", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderBottom: "1px solid rgba(16, 185, 129, 0.15)", paddingBottom: "5px" }}>
            Celestial Coordinates
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
            <div>
              <span style={{ color: "#64748b" }}>Current Realm Layer:</span>{" "}
              <strong style={{ color: "#e2e8f0" }}>Layer {layer}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Active Infinite Domains:</span>{" "}
              <strong style={{ color: "#e2e8f0" }}>{realms.length} Unlocked</strong>
            </div>
            <div style={{ marginTop: "15px" }}>
              <Button variant="primary" onClick={ascend} style={{ width: "100%", padding: "8px" }}>
                Ascend to Layer {layer + 1}
              </Button>
            </div>
          </div>
        </div>

        {/* COSMIC VIRTUES CALIBRATOR */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(16, 185, 129, 0.1)",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h2 style={{ color: "#10b981", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderBottom: "1px solid rgba(16, 185, 129, 0.15)", paddingBottom: "5px" }}>
            Cosmic Virtues Calibration
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.8rem" }}>
            {Object.entries(cosmicVirtues).map(([k, val]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ textTransform: "uppercase", color: "#94a3b8", fontWeight: "bold" }}>{k}:</span>{" "}
                  <strong style={{ color: "#10b981" }}>{val}</strong>
                </div>
                <button
                  onClick={() => incrementCosmicVirtue(k)}
                  style={{
                    padding: "3px 8px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "4px",
                    color: "#10b981",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  ⚡ Calibrate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UNLOCKED COSMIC REALMS LEDGER */}
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(16, 185, 129, 0.1)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "left",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ color: "#10b981", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderBottom: "1px solid rgba(16, 185, 129, 0.15)", paddingBottom: "5px" }}>
          Celestial Realms Log ({realms.length})
        </h2>
        <div
          style={{
            maxHeight: "180px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          {realms.length === 0 ? (
            <div style={{ color: "#64748b", fontStyle: "italic", padding: "20px", textAlign: "center" }}>
              The Celestial Ladder remains unclimbed. Ascend to establish your first coordinate.
            </div>
          ) : (
            [...realms].reverse().map((r, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.1)",
                  borderRadius: "6px",
                  padding: "10px 15px",
                  fontSize: "0.8rem",
                  color: "#e2e8f0",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span>🌌 {r}</span>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Status: Stabilized</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
        <Button variant="primary" onClick={() => go("temple")}>
          Return to Temple Map
        </Button>
      </div>
    </div>
  );
}
