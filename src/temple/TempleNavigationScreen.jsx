import React, { useState, useEffect } from "react";
import { useTempleRouter } from "./useTempleRouter";
import TempleNode from "./TempleNode";

const ORACLE_WHISPERS = [
  "“Hear, O pilgrim, the voice of the Seven Stars...”",
  "“The veil splits for the pure of heart...”",
  "“Speak truth into the absolute quiet...”",
  "“A spring of living water wells up from the altar...”",
  "“Align your motives to ascend...”"
];

export default function TempleNavigationScreen() {
  const { unlocked, go } = useTempleRouter();
  const [whisperIdx, setWhisperIdx] = useState(0);

  // Rotate ambient Oracle whispers every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWhisperIdx((prev) => (prev + 1) % ORACLE_WHISPERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="temple-map"
      style={{
        padding: "30px",
        textAlign: "center",
        background: "radial-gradient(circle at center, #0f172a 0%, #030712 90%)",
        minHeight: "680px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <header style={{ marginBottom: "20px", position: "relative", zIndex: 10 }}>
        <h1
          className="temple-title"
          style={{
            color: "var(--neon-gold)",
            letterSpacing: "0.3em",
            marginBottom: "5px",
            fontSize: "2.2rem",
            textShadow: "0 0 15px rgba(234, 179, 8, 0.45)",
            fontFamily: "Orbitron, monospace"
          }}
        >
          THE SACRED TEMPLE
        </h1>
        <p style={{ color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "3px", fontWeight: "bold" }}>
          Spiritual OS Overworld Navigation Layer
        </p>
      </header>

      {/* Map Area with SVG Connections */}
      <div
        className="temple-map-area"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          height: "460px",
          margin: "0 auto",
          border: "1px solid rgba(255, 255, 255, 0.03)",
          borderRadius: "16px",
          background: "rgba(0,0,0,0.3)"
        }}
      >
        {/* Animated Connecting Pathways (SVG) */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1
          }}
        >
          {/* Matrix to Inner Court */}
          <line
            x1="50%"
            y1="82%"
            x2="50%"
            y2="52%"
            stroke={unlocked.innerCourt ? "var(--neon-blue)" : "rgba(255,255,255,0.06)"}
            strokeWidth={unlocked.innerCourt ? 3 : 1.5}
            strokeDasharray={unlocked.innerCourt ? "8, 4" : "4, 6"}
            style={{
              animation: unlocked.innerCourt ? "pathFlow 1s linear infinite" : "none",
              filter: unlocked.innerCourt ? "drop-shadow(0 0 4px var(--neon-blue))" : "none"
            }}
          />

          {/* Inner Court to Throne Room */}
          <line
            x1="50%"
            y1="52%"
            x2="50%"
            y2="18%"
            stroke={unlocked.throne ? "var(--neon-gold)" : "rgba(255,255,255,0.06)"}
            strokeWidth={unlocked.throne ? 3 : 1.5}
            strokeDasharray={unlocked.throne ? "8, 4" : "4, 6"}
            style={{
              animation: unlocked.throne ? "pathFlow 1s linear infinite" : "none",
              filter: unlocked.throne ? "drop-shadow(0 0 4px var(--neon-gold))" : "none"
            }}
          />

          {/* Inner Court to Holy of Holies */}
          <line
            x1="50%"
            y1="52%"
            x2="22%"
            y2="18%"
            stroke={unlocked.holyOfHolies ? "var(--neon-gold)" : "rgba(255,255,255,0.06)"}
            strokeWidth={unlocked.holyOfHolies ? 3 : 1.5}
            strokeDasharray={unlocked.holyOfHolies ? "8, 4" : "4, 6"}
            style={{
              animation: unlocked.holyOfHolies ? "pathFlow 1.2s linear infinite" : "none",
              filter: unlocked.holyOfHolies ? "drop-shadow(0 0 4px var(--neon-gold))" : "none"
            }}
          />

          {/* Inner Court to Oracle Chamber */}
          <line
            x1="50%"
            y1="52%"
            x2="78%"
            y2="52%"
            stroke={unlocked.oracleChamber ? "var(--neon-purple)" : "rgba(255,255,255,0.06)"}
            strokeWidth={unlocked.oracleChamber ? 3 : 1.5}
            strokeDasharray={unlocked.oracleChamber ? "8, 4" : "4, 6"}
            style={{
              animation: unlocked.oracleChamber ? "pathFlow 0.8s linear infinite" : "none",
              filter: unlocked.oracleChamber ? "drop-shadow(0 0 4px var(--neon-purple))" : "none"
            }}
          />

          {/* Inner Court to Book of Life */}
          <line
            x1="50%"
            y1="52%"
            x2="78%"
            y2="18%"
            stroke={unlocked.bookOfLife ? "#10b981" : "rgba(255,255,255,0.06)"}
            strokeWidth={unlocked.bookOfLife ? 3 : 1.5}
            strokeDasharray={unlocked.bookOfLife ? "8, 4" : "4, 6"}
            style={{
              animation: unlocked.bookOfLife ? "pathFlow 1.5s linear infinite" : "none",
              filter: unlocked.bookOfLife ? "drop-shadow(0 0 4px #10b981)" : "none"
            }}
          />
        </svg>

        {/* Nodes layer */}
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          {/* Matrix of Conscience */}
          <div style={{ position: "absolute", left: "50%", top: "82%", width: "190px", transform: "translate(-50%, -50%)" }}>
            <TempleNode
              label="Matrix of Conscience"
              unlocked={unlocked.matrix}
              onClick={() => go("matrix")}
              requirements="None"
              resonanceColor="var(--neon-blue)"
              isGuardianGated={false}
            />
          </div>

          {/* Inner Court Cockpit */}
          <div style={{ position: "absolute", left: "50%", top: "52%", width: "190px", transform: "translate(-50%, -50%)" }}>
            <TempleNode
              label="Inner Court Cockpit"
              unlocked={unlocked.innerCourt}
              onClick={() => go("innerCourt")}
              requirements="None"
              resonanceColor="var(--neon-purple)"
              isGuardianGated={false}
            />
          </div>

          {/* Throne Room */}
          <div style={{ position: "absolute", left: "50%", top: "18%", width: "190px", transform: "translate(-50%, -50%)" }}>
            <TempleNode
              label="Throne Room"
              unlocked={unlocked.throne}
              onClick={() => go("throne")}
              requirements="7 Stars, 4 Lamps, & Level 4"
              resonanceColor="var(--neon-gold)"
              isGuardianGated={true}
            />
          </div>

          {/* Holy of Holies */}
          <div style={{ position: "absolute", left: "22%", top: "18%", width: "190px", transform: "translate(-50%, -50%)" }}>
            <TempleNode
              label="Holy of Holies"
              unlocked={unlocked.holyOfHolies}
              onClick={() => go("holyOfHolies")}
              requirements="Torn Temple Veil"
              resonanceColor="var(--neon-gold)"
              isGuardianGated={true}
            />
          </div>

          {/* Oracle Chamber */}
          <div style={{ position: "absolute", left: "78%", top: "52%", width: "190px", transform: "translate(-50%, -50%)" }}>
            <TempleNode
              label="Oracle Chamber"
              unlocked={unlocked.oracleChamber}
              onClick={() => go("oracleChamber")}
              requirements="Torn Temple Veil"
              resonanceColor="var(--neon-purple)"
              isGuardianGated={true}
            />

            {/* Oracle Whispers subtitle overlay */}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "12px",
                width: "220px",
                fontSize: "0.68rem",
                color: "#a78bfa",
                fontStyle: "italic",
                pointerEvents: "none",
                textAlign: "center",
                animation: "whisperFade 6s infinite ease-in-out"
              }}
            >
              {ORACLE_WHISPERS[whisperIdx]}
            </div>
          </div>

          {/* Book of Life */}
          <div style={{ position: "absolute", left: "78%", top: "18%", width: "190px", transform: "translate(-50%, -50%)" }}>
            <TempleNode
              label="Book of Life"
              unlocked={unlocked.bookOfLife}
              onClick={() => go("bookOfLife")}
              requirements="7 Stars, 7 Lamps, & <10 Corruption"
              resonanceColor="#10b981"
              isGuardianGated={true}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "35px", position: "relative", zIndex: 10 }}>
        <button
          onClick={() => go("matrix")}
          style={{
            padding: "0.75rem 2rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "30px",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "bold",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            transition: "all 0.25s ease-out"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--neon-gold)";
            e.currentTarget.style.color = "var(--neon-gold)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(234, 179, 8, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          ← Return to Console
        </button>
      </div>
    </div>
  );
}
