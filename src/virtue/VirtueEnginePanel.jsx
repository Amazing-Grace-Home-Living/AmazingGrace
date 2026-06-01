import React from "react";
import { useHUD } from "../hud/HUDContext";

export default function VirtueEnginePanel() {
  const { hud } = useHUD();
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

  const virtues = [
    { key: "truth", label: "Truth", color: "var(--neon-blue)", max: 20 },
    { key: "faithfulness", label: "Faithfulness", color: "var(--neon-purple)", max: 20 },
    { key: "wisdom", label: "Wisdom", color: "var(--neon-gold)", max: 20 },
    { key: "humility", label: "Humility", color: "#a78bfa", max: 20 },
    { key: "perseverance", label: "Perseverance", color: "#fb7185", max: 20 },
    { key: "alertness", label: "Alertness", color: "#22d3ee", max: 20 },
    { key: "love", label: "Love", color: "#f43f5e", max: 20 },
    { key: "corruption", label: "Corruption", color: "#e11d48", max: 20 }
  ];

  return (
    <div className="hud-panel virtue-panel" style={{ marginTop: "1rem", border: "1px solid var(--hud-border)" }}>
      <h3 style={{ color: "var(--neon-gold)", fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        VIRTUE ENGINE
      </h3>
      <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "1rem" }}>
        Moral resonance alignment of the duality core.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {virtues.map(({ key, label, color, max }) => {
          const val = virtueEngine[key] || 0;
          const pct = Math.min(100, Math.max(0, (val / max) * 100));
          return (
            <div key={key} style={{ fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontWeight: "500", textTransform: "uppercase", fontSize: "0.75rem", color: "#cbd5e1" }}>{label}</span>
                <span style={{ color, fontWeight: "bold" }}>{val}</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, transition: "width 0.4s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
