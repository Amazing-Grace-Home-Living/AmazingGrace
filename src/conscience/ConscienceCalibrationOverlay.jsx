import React from "react";

export default function ConscienceCalibrationOverlay({ signal, onChoose, onClose }) {
  if (!signal) return null;

  return (
    <div className="overlay external-overlay ext-conscience" style={{ position: "relative" }}>
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

      <div className="cc-header" style={{ color: "var(--neon-gold)", fontWeight: "bold", marginBottom: "8px", letterSpacing: "1px" }}>
        CONSCIENCE CALIBRATION
      </div>
      
      <p className="cc-text" style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: "1.4", margin: "8px 0 16px" }}>
        "{signal.text}"
      </p>

      <div className="cc-buttons" style={{ display: "flex", gap: "8px" }}>
        <button 
          className="ui-btn ui-btn-primary" 
          style={{ flex: 1, padding: "8px", fontSize: "0.75rem" }} 
          onClick={() => onChoose(signal.virtue)}
        >
          Virtue
        </button>
        <button 
          className="ui-btn" 
          style={{ flex: 1, padding: "8px", fontSize: "0.75rem", background: "rgba(225, 29, 72, 0.15)", border: "1px solid rgba(225, 29, 72, 0.3)", color: "#fb7185" }} 
          onClick={() => onChoose("corruption")}
        >
          Corruption
        </button>
      </div>
    </div>
  );
}
