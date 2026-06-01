import React from "react";
import { useHUD } from "../hud/HUDContext";
import { emit, Events } from "../core/eventBus";
// @ts-ignore
import { useNexusRouter } from "../router/useNexusRouter";
// @ts-ignore
import Button from "../ui/Button";

export default function ThroneRoomScreen() {
  const { hud } = useHUD();
  const { go } = useNexusRouter();

  const virtueEngine = hud?.virtueEngine || {
    truth: 0,
    faithfulness: 0,
    wisdom: 0,
    humility: 0,
    perseverance: 0,
    alertness: 0,
    love: 0,
    corruption: 0
  };

  const virtueTotal = Object.values(virtueEngine).reduce((a, b) => a + b, 0);
  const level = hud?.progress?.sevenStars?.level || 1;

  function finalize() {
    emit(Events.NOTIFY, {
      type: "info",
      message: "Your destiny is sealed. The Matrix acknowledges your transformation."
    });
  }

  return (
    <div className="throne-room" style={{ padding: "2rem", textAlign: "center", background: "radial-gradient(circle at center, #1b160e 0%, #050505 100%)", borderRadius: "12px", border: "2px solid var(--neon-gold)", boxShadow: "0 0 25px rgba(234, 179, 8, 0.15)" }}>
      <header style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--neon-gold)", fontWeight: "bold", trackingLetter: "3px", textTransform: "uppercase" }}>
          FINAL INGRESS Node // Chamber 0
        </span>
        <h1 style={{ margin: "10px 0 0", fontSize: "1.8rem", color: "var(--neon-gold)", letterSpacing: "4px", textTransform: "uppercase", textShadow: "0 0 12px rgba(234, 179, 8, 0.4)" }}>
          THE THRONE ROOM
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", maxWidth: "450px", margin: "12px auto 0", lineHeight: "1.6" }}>
          The Seven Stars shine in complete alignment. The Seven Lamps burn in spiritual union. Your conscience stands fully revealed before the seat of judgment.
        </p>
      </header>

      <div className="throne-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "350px", margin: "0 auto 2rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(234, 179, 8, 0.2)", padding: "15px", borderRadius: "8px" }}>
        <div>
          <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>Virtue Weight</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--neon-gold)" }}>{virtueTotal}</div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>Conscience Level</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--neon-blue)" }}>{level}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px", margin: "0 auto" }}>
        <Button 
          variant="primary" 
          onClick={finalize}
          style={{ 
            width: "100%", 
            padding: "12px", 
            fontSize: "0.85rem",
            background: "linear-gradient(to right, #eab308, #ca8a04)",
            border: "1px solid #facc15",
            color: "#000",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "0 0 15px rgba(234, 179, 8, 0.3)"
          }}
        >
          👑 Accept Your Destiny
        </Button>
        
        <Button 
          onClick={() => go("innerCourt")} 
          style={{ 
            width: "100%", 
            padding: "10px", 
            fontSize: "0.8rem",
            background: "rgba(255,255,255,0.05)", 
            border: "1px solid rgba(255,255,255,0.1)", 
            color: "#cbd5e1"
          }}
        >
          🚪 Return to Inner Court
        </Button>
      </div>
    </div>
  );
}
