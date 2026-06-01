import React from "react";
import { useTempleRouter } from "./useTempleRouter";
import TempleNode from "./TempleNode";
import Button from "../ui/Button";

export default function TempleNavigationScreen() {
  const { unlocked, go } = useTempleRouter();

  return (
    <div className="temple-map" style={{ padding: "40px", textAlign: "center" }}>
      <h1 className="temple-title" style={{ color: "var(--hud-accent)", letterSpacing: "0.2em", marginBottom: "10px", fontSize: "2rem" }}>
        THE HOLY TEMPLE
      </h1>
      <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "40px", textTransform: "uppercase", letterSpacing: "2px" }}>
        Spiritual Sanctuary Overworld Navigation Map
      </p>

      <div className="temple-grid">
        <TempleNode
          label="Matrix of Conscience"
          unlocked={unlocked.matrix}
          onClick={() => go("matrix")}
          requirements="None"
        />

        <TempleNode
          label="Inner Court Cockpit"
          unlocked={unlocked.innerCourt}
          onClick={() => go("innerCourt")}
          requirements="None"
        />

        <TempleNode
          label="Throne Room"
          unlocked={unlocked.throneRoom}
          onClick={() => go("throne")}
          requirements="7 Stars, 4 Lamps, and Level 4"
        />

        <TempleNode
          label="Holy of Holies"
          unlocked={unlocked.holyOfHolies}
          onClick={() => go("holyOfHolies")}
          requirements="Torn Temple Veil"
        />

        <TempleNode
          label="Oracle Chamber"
          unlocked={unlocked.oracleChamber}
          onClick={() => go("oracleChamber")}
          requirements="Torn Temple Veil"
        />

        <TempleNode
          label="Book of Life"
          unlocked={unlocked.bookOfLife}
          onClick={() => go("bookOfLife")}
          requirements="7 Stars, 7 Lamps, & <10 Corruption"
        />
      </div>

      <div style={{ marginTop: "40px" }}>
        <button
          onClick={() => go("matrix")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--hud-accent)";
            e.currentTarget.style.color = "var(--hud-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          ← Return to Console
        </button>
      </div>
    </div>
  );
}
