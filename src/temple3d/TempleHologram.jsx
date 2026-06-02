import React, { useState } from "react";
import TempleNode from "../temple/TempleNode";
import GuardianNode from "../temple/GuardianNode";
import TemplePathway from "../temple/TemplePathway";
import { useTempleRouter } from "../temple/useTempleRouter";
import { useHUD } from "../hud/HUDContext";

export default function TempleHologram() {
  const { unlocked, go } = useTempleRouter();
  const { hud } = useHUD();
  const [angle, setAngle] = useState(0);

  function rotate(dir) {
    setAngle((a) => a + dir * 20);
  }

  return (
    <div
      className="temple-holo-wrapper"
      style={{
        padding: "30px",
        textAlign: "center",
        background: "radial-gradient(circle at center, #020617 0%, #000 90%)",
        minHeight: "680px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <header style={{ marginBottom: "20px", position: "relative", zIndex: 10 }}>
        <h1
          className="temple-title"
          style={{
            color: "var(--neon-blue)",
            letterSpacing: "0.4em",
            marginBottom: "5px",
            fontSize: "2.3rem",
            textShadow: "0 0 15px rgba(79, 209, 255, 0.45)",
            fontFamily: "Orbitron, monospace"
          }}
        >
          TEMPLE HOLOGRAM
        </h1>
        <p style={{ color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "3px", fontWeight: "bold" }}>
          Rotating Spatial Parallax Projection Mode
        </p>
      </header>

      {/* Manual toggle view bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px", position: "relative", zIndex: 10 }}>
        <button
          onClick={() => go("temple")}
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
        >
          Standard View
        </button>
        <button
          style={{
            padding: "6px 16px",
            background: "rgba(79, 209, 255, 0.1)",
            border: "1px solid rgba(79, 209, 255, 0.3)",
            borderRadius: "20px",
            color: "var(--neon-blue)",
            cursor: "default",
            fontSize: "0.75rem",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          3D Hologram Projection
        </button>
      </div>

      {/* Main Holographic 3D Parallax Area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          height: "460px",
          margin: "0 auto",
          perspective: "1200px"
        }}
      >
        <div
          className="temple-holo"
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `rotateY(${angle}deg)`,
            transition: "transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)",
            position: "relative"
          }}
        >
          {/* Depth Radial Glow Panels */}
          <div className="holo-layer holo-back" />
          <div className="holo-layer holo-mid" />
          <div className="holo-layer holo-front" />

          {/* scanlines & radars */}
          <div className="holo-scanline" />
          <div className="holo-grid-overlay" />
          <div className="holo-radar-sweep" />

          {/* Hologram Nodes Assembly */}
          <div className="holo-nodes" style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            {/* Matrix (Base Ring level) */}
            <div style={{ position: "absolute", left: "50%", top: "78%", transform: "translate(-50%, -50%) translateZ(-80px)", width: "170px" }}>
              <TempleNode
                label="Matrix"
                unlocked={true}
                onClick={() => go("matrix")}
                resonanceColor="var(--neon-blue)"
                chamber="matrix"
              />
            </div>

            {/* Pathway base-to-mid */}
            <div style={{ position: "absolute", left: "50%", top: "64%", transform: "translate(-50%, -50%) translateZ(-40px)", zIndex: 1 }}>
              <TemplePathway active={unlocked.innerCourt} />
            </div>

            {/* Inner Court (Mid level) */}
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) translateZ(0px)", width: "170px" }}>
              <TempleNode
                label="Inner Court"
                unlocked={unlocked.innerCourt}
                onClick={() => go("innerCourt")}
                resonanceColor="var(--neon-purple)"
                chamber="innerCourt"
              />
            </div>

            {/* Pathways mid-to-top */}
            <div style={{ position: "absolute", left: "26%", top: "33%", transform: "translate(-50%, -50%) translateZ(40px) rotate(45deg)", zIndex: 1 }}>
              <TemplePathway active={unlocked.holyOfHolies} />
            </div>
            <div style={{ position: "absolute", left: "74%", top: "33%", transform: "translate(-50%, -50%) translateZ(40px) rotate(-45deg)", zIndex: 1 }}>
              <TemplePathway active={unlocked.oracleChamber} />
            </div>

            {/* Guardian overlays for Throne and Holy place */}
            <div style={{ position: "absolute", left: "50%", top: "12%", transform: "translate(-50%, -50%) translateZ(100px)", zIndex: 10 }}>
              <GuardianNode active={!unlocked.throne} message="Gated" />
            </div>

            {/* Holy of Holies */}
            <div style={{ position: "absolute", left: "15%", top: "18%", transform: "translate(-50%, -50%) translateZ(80px)", width: "170px" }}>
              <TempleNode
                label="Holy of Holies"
                unlocked={unlocked.holyOfHolies}
                onClick={() => go("holyOfHolies")}
                resonanceColor="#ffffff"
                chamber="holyOfHolies"
                isGuardianGated={true}
              />
            </div>

            {/* Oracle Chamber */}
            <div style={{ position: "absolute", left: "85%", top: "50%", transform: "translate(-50%, -50%) translateZ(40px)", width: "170px" }}>
              <TempleNode
                label="Oracle Chamber"
                unlocked={unlocked.oracleChamber}
                onClick={() => go("oracleChamber")}
                resonanceColor="var(--neon-purple)"
                chamber="oracleChamber"
                isGuardianGated={true}
              />
            </div>

            {/* Throne Room */}
            <div style={{ position: "absolute", left: "50%", top: "18%", transform: "translate(-50%, -50%) translateZ(120px)", width: "170px" }}>
              <TempleNode
                label="Throne Room"
                unlocked={unlocked.throne}
                onClick={() => go("throne")}
                resonanceColor="var(--neon-gold)"
                chamber="throneRoom"
                isGuardianGated={true}
              />
            </div>

            {/* Book of Life */}
            <div style={{ position: "absolute", left: "85%", top: "18%", transform: "translate(-50%, -50%) translateZ(80px)", width: "170px" }}>
              <TempleNode
                label="Book of Life"
                unlocked={unlocked.bookOfLife}
                onClick={() => go("bookOfLife")}
                resonanceColor="#10b981"
                chamber="bookOfLife"
                isGuardianGated={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manual Hologram Rotation controls */}
      <div className="holo-controls" style={{ marginTop: "30px", position: "relative", zIndex: 10 }}>
        <button
          onClick={() => rotate(-1)}
          style={{
            background: "rgba(10, 26, 34, 0.8)",
            border: "1px solid var(--neon-blue)",
            color: "var(--neon-blue)",
            padding: "8px 24px",
            margin: "0 10px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 0 10px rgba(79, 209, 255, 0.2)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(79, 209, 255, 0.15)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(79, 209, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(10, 26, 34, 0.8)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(79, 209, 255, 0.2)";
          }}
        >
          ⟵ Rotate Left
        </button>
        <button
          onClick={() => rotate(1)}
          style={{
            background: "rgba(10, 26, 34, 0.8)",
            border: "1px solid var(--neon-blue)",
            color: "var(--neon-blue)",
            padding: "8px 24px",
            margin: "0 10px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 0 10px rgba(79, 209, 255, 0.2)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(79, 209, 255, 0.15)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(79, 209, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(10, 26, 34, 0.8)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(79, 209, 255, 0.2)";
          }}
        >
          Rotate Right ⟶
        </button>
      </div>
    </div>
  );
}
