import React, { useEffect, useState } from "react";
import { useTempleRouter } from "./useTempleRouter";    
import { useHUD } from "../hud/HUDContext";
import { useOracleWhispers } from "./useOracleWhispers";
import TempleNode from "./TempleNode";
import GuardianNode from "./GuardianNode";
import OracleWhispers from "./OracleWhispers";
import VeilTearOverlay from "./VeilTearOverlay";        

export default function TempleNavigationScreen() {      
  const { unlocked, go } = useTempleRouter();
  const { hud, setHUD } = useHUD();
  const whisper = useOracleWhispers(hud);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Clear 'justTorn' state after 4 seconds to prevent lockups
  useEffect(() => {
    if (hud?.templeVeil?.justTorn) {
      const timer = setTimeout(() => {
        setHUD((h) => ({
          ...h,
          templeVeil: {
            ...h.templeVeil,
            justTorn: false
          }
        }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hud?.templeVeil?.justTorn, setHUD]);

  // Compute 3D mouse tracking tilt angles
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Limits rotation to ~10 degrees max
    const tiltX = -(y / (rect.height / 2)) * 10;
    const tiltY = (x / (rect.width / 2)) * 10;

    setTilt({ x: tiltX, y: tiltY });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  if (hud?.templeVeil?.justTorn) {
    return <VeilTearOverlay />;
  }

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
            letterSpacing: "0.35em",
            marginBottom: "5px",
            fontSize: "2.3rem",
            textShadow: "0 0 15px rgba(234, 179, 8, 0.45)",
            fontFamily: "Orbitron, monospace"
          }}
        >
          THE SACRED TEMPLE
        </h1>
        <p style={{ color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "3px", fontWeight: "bold" }}>     
          Temple Navigation System — Ascended Edition
        </p>
      </header>

      {/* Manual toggle view bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px", position: "relative", zIndex: 10 }}> 
        <button
          style={{
            padding: "6px 16px",
            background: "rgba(234, 179, 8, 0.1)",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            borderRadius: "20px",
            color: "var(--neon-gold)",
            cursor: "default",
            fontSize: "0.75rem",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          Standard View
        </button>
        <button
          onClick={() => go("temple3d")}
          style={{
            padding: "6px 16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--neon-blue)";
            e.currentTarget.style.color = "var(--neon-blue)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          3D Hologram Projection
        </button>
      </div>

      {/* Map Area tilting wrapper */}
      <div
        className="temple-map-area holo-3d-tilt-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          height: "460px",
          margin: "0 auto",
          border: "1px solid rgba(79, 209, 255, 0.15)",
          borderRadius: "16px",
          background: "rgba(5, 8, 16, 0.55)",
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(79, 209, 255, 0.05)"
        }}
      >
        {/* Holographic Projection Sweepers & Grids */}
        <div className="holo-scanline" />
        <div className="holo-grid-overlay" />
        <div className="holo-radar-sweep" />

        {/* Animated Connecting Pathways (SVG in background layer) */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            transform: "translateZ(0)"
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

          {/* Book of Life to Sheila Path */}
          <line
            x1="78%"
            y1="18%"
            x2="70%"
            y2="5%"
            stroke={unlocked.sheilaPath ? "var(--neon-blue)" : "rgba(255,255,255,0.06)"}
            strokeWidth={1.5}
            strokeDasharray="4, 4"
          />

          {/* Book of Life to Yi Path */}
          <line
            x1="78%"
            y1="18%"
            x2="86%"
            y2="5%"
            stroke={unlocked.yiPath ? "var(--neon-purple)" : "rgba(255,255,255,0.06)"}
            strokeWidth={1.5}
            strokeDasharray="4, 4"
          />
        </svg>

        {/* Nodes layer (Floating forward in 3D space) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 5, transformStyle: "preserve-3d" }}>
          {/* Matrix of Conscience */}
          <div className="holo-float-node" style={{ position: "absolute", left: "50%", top: "82%", width: "190px", transform: "translate(-50%, -50%) translateZ(45px)" }}>
            <TempleNode
              label="Matrix of Conscience"
              unlocked={unlocked.matrix}
              onClick={() => go("matrix")}
              requirements="None"
              resonanceColor="var(--neon-blue)"
              isGuardianGated={false}
              chamber="matrix"
            />
          </div>

          {/* Inner Court Cockpit */}
          <div className="holo-float-node" style={{ position: "absolute", left: "50%", top: "52%", width: "190px", transform: "translate(-50%, -50%) translateZ(45px)" }}>
            <TempleNode
              label="Inner Court Cockpit"
              unlocked={unlocked.innerCourt}
              onClick={() => go("innerCourt")}
              requirements="None"
              resonanceColor="var(--neon-purple)"
              isGuardianGated={false}
              chamber="innerCourt"
            />
          </div>

          {/* Throne Room */}
          <div className="holo-float-node" style={{ position: "absolute", left: "50%", top: "18%", width: "190px", transform: "translate(-50%, -50%) translateZ(45px)" }}>
            <TempleNode
              label="Throne Room"
              unlocked={unlocked.throne}
              onClick={() => go("throne")}
              requirements="7 Stars, 4 Lamps, & Level 4"
              resonanceColor="var(--neon-gold)"
              isGuardianGated={true}
              chamber="throneRoom"
            />
            {/* watch eye overlay */}
            <div style={{ position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%) translateZ(10px)" }}>
              <GuardianNode active={!unlocked.throne} message="Locked" />
            </div>
          </div>

          {/* Holy of Holies */}
          <div className="holo-float-node" style={{ position: "absolute", left: "22%", top: "18%", width: "190px", transform: "translate(-50%, -50%) translateZ(45px)" }}>
            <TempleNode
              label="Holy of Holies"
              unlocked={unlocked.holyOfHolies}
              onClick={() => go("holyOfHolies")}
              requirements="Torn Temple Veil"
              resonanceColor="#ffffff"
              isGuardianGated={true}
              chamber="holyOfHolies"
            />
            <div style={{ position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%) translateZ(10px)" }}>
              <GuardianNode active={!unlocked.holyOfHolies} message="Locked" />
            </div>
          </div>

          {/* Oracle Chamber */}
          <div className="holo-float-node" style={{ position: "absolute", left: "78%", top: "52%", width: "190px", transform: "translate(-50%, -50%) translateZ(45px)" }}>
            <TempleNode
              label="Oracle Chamber"
              unlocked={unlocked.oracleChamber}
              onClick={() => go("oracleChamber")}
              requirements="Torn Temple Veil"
              resonanceColor="var(--neon-purple)"
              isGuardianGated={true}
              chamber="oracleChamber"
            />
            <div style={{ position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%) translateZ(10px)" }}>
              <GuardianNode active={!unlocked.oracleChamber} message="Locked" />
            </div>
          </div>

          {/* Sheila Path */}
          <div className="holo-float-node" style={{ position: "absolute", left: "70%", top: "5%", width: "150px", transform: "translate(-50%, -50%) translateZ(60px)" }}>
            <TempleNode
              label="Sheila's Path"
              unlocked={unlocked.sheilaPath}
              onClick={() => go("daOpening")}
              requirements="Low Corruption"
              resonanceColor="var(--neon-blue)"
              isGuardianGated={true}
              chamber="sheila"
            />
          </div>

          {/* Yi's Path */}
          <div className="holo-float-node" style={{ position: "absolute", left: "86%", top: "5%", width: "150px", transform: "translate(-50%, -50%) translateZ(60px)" }}>
            <TempleNode
              label="Yi's Path"
              unlocked={unlocked.yiPath}
              onClick={() => go("daOpening")}
              requirements="High Corruption"
              resonanceColor="var(--neon-purple)"
              isGuardianGated={true}
              chamber="yi"
            />
          </div>

          {/* Book of Life */}
          <div className="holo-float-node" style={{ position: "absolute", left: "78%", top: "18%", width: "190px", transform: "translate(-50%, -50%) translateZ(45px)" }}>
            <TempleNode
              label="Book of Life"
              unlocked={unlocked.bookOfLife}
              onClick={() => go("bookOfLife")}
              requirements="7 Stars, 7 Lamps, & <10 Corruption"
              resonanceColor="#10b981"
              isGuardianGated={true}
              chamber="bookOfLife"
            />
            <div style={{ position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%) translateZ(10px)" }}>
              <GuardianNode active={!unlocked.bookOfLife} message="Locked" />
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Whispers */}
      <OracleWhispers text={whisper} />

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

