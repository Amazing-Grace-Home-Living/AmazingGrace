import React from "react";

export default function SevenLampsOverlay({ lamp, onClose }) {
  if (!lamp) return null;

  return (
    <div className="overlay external-overlay ext-seven-lamps" style={{ position: "relative" }}>
      <button 
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "transparent",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.8rem"
        }}
      >
        ✕
      </button>

      <div className="sl-header" style={{ color: "var(--neon-blue)", fontWeight: "bold", marginBottom: "6px", letterSpacing: "1px" }}>
        SEVEN LAMPS ACTIVATED
      </div>
      <div className="sl-name" style={{ fontSize: "0.9rem", color: "#e2e8f0", fontWeight: "bold", marginBottom: "4px" }}>
        {lamp.name}
      </div>
      <div className="sl-buff" style={{ fontSize: "0.75rem", color: "var(--neon-gold)", fontWeight: "bold", textTransform: "uppercase" }}>
        Active Buff: +2 {lamp.buff}
      </div>
    </div>
  );
}
