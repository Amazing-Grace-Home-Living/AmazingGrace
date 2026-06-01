import React from "react";

export default function TempleNode({ label, unlocked, onClick, requirements }) {
  return (
    <div
      className={`temple-node ${unlocked ? "unlocked" : "locked"}`}
      onClick={unlocked ? onClick : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "140px",
        textAlign: "center"
      }}
    >
      <div className="temple-node-glow-effect" />
      <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
        {unlocked ? "⚜️" : "🔒"}
      </div>
      <div className="temple-node-inner" style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
        {label}
      </div>
      {!unlocked && requirements && (
        <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.5rem", maxWidth: "90%" }}>
          Requires: {requirements}
        </div>
      )}
      {unlocked && (
        <div style={{ fontSize: "0.7rem", color: "var(--neon-blue)", marginTop: "0.5rem", textTransform: "uppercase", fontWeight: "bold" }}>
          Active & Aligning
        </div>
      )}
    </div>
  );
}
