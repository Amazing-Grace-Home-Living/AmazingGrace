import React from "react";
import { useOracle } from "./useOracle";

export default function OraclePanel() {
  const { message } = useOracle();

  return (
    <div className="hud-panel oracle-panel" style={{ border: "1px solid var(--hud-border)" }}>
      <h3 style={{ color: "var(--neon-gold)", fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        VOICE OF THE ORACLE
      </h3>
      <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", lineHeight: "1.5", margin: "10px 0 0", paddingLeft: "10px", borderLeft: "2px solid var(--neon-purple)" }}>
        "{message}"
      </p>
    </div>
  );
}
