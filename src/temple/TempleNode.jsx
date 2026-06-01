import React from "react";

export default function TempleNode({
  label,
  unlocked,
  onClick,
  requirements,
  resonanceColor = "var(--hud-accent)",
  isGuardianGated = false
}) {
  // Compute inline colors based on resonance color
  const glowShadow = unlocked
    ? `0 0 15px ${resonanceColor}`
    : isGuardianGated
    ? "0 0 12px rgba(244, 63, 94, 0.3)"
    : "none";

  const borderColor = unlocked
    ? resonanceColor
    : isGuardianGated
    ? "rgba(244, 63, 94, 0.4)"
    : "rgba(255, 255, 255, 0.08)";

  const auraBackground = unlocked
    ? `radial-gradient(circle at center, ${resonanceColor} 0%, transparent 70%)`
    : isGuardianGated
    ? "radial-gradient(circle at center, rgba(244, 63, 94, 0.1) 0%, transparent 70%)"
    : "none";

  return (
    <div
      className={`temple-node ${unlocked ? "unlocked" : "locked"} ${isGuardianGated ? "guardian-gated" : ""}`}
      onClick={unlocked ? onClick : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "150px",
        textAlign: "center",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: borderColor,
        borderRadius: "12px",
        background: "rgba(10, 10, 15, 0.8)",
        boxShadow: glowShadow,
        cursor: unlocked ? "pointer" : "not-allowed",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      }}
    >
      {/* Node Aura Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: auraBackground,
          opacity: unlocked ? 0.08 : 0.4,
          pointerEvents: "none",
          transition: "opacity 0.3s"
        }}
      />

      {/* Sweeping Light effect on hover */}
      {unlocked && (
        <div
          className="temple-node-sweep"
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
            transform: "skewX(-25deg)",
            transition: "left 0.75s ease-in-out"
          }}
        />
      )}

      {/* Node Icon */}
      <div
        className={unlocked ? "node-icon-unlocked" : isGuardianGated ? "node-icon-guarded" : "node-icon-locked"}
        style={{
          fontSize: "2rem",
          marginBottom: "0.5rem",
          filter: unlocked ? `drop-shadow(0 0 8px ${resonanceColor})` : "none",
          animation: isGuardianGated && !unlocked ? "guardianPulse 2s infinite ease-in-out" : "none"
        }}
      >
        {unlocked ? "⚜️" : isGuardianGated ? "🛡️" : "🔒"}
      </div>

      {/* Node Label */}
      <div
        className="temple-node-inner"
        style={{
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: unlocked ? "#f1f5f9" : "#64748b",
          fontSize: "0.85rem",
          padding: "0 10px"
        }}
      >
        {label}
      </div>

      {/* Lock description / requirements */}
      {!unlocked && requirements && (
        <div
          style={{
            fontSize: "0.68rem",
            color: isGuardianGated ? "#fda4af" : "#475569",
            marginTop: "0.6rem",
            maxWidth: "90%",
            fontWeight: isGuardianGated ? "bold" : "normal"
          }}
        >
          {isGuardianGated ? "GUARDIANS LOCK" : "GATED"}: {requirements}
        </div>
      )}

      {unlocked && (
        <div
          style={{
            fontSize: "0.65rem",
            color: resonanceColor,
            marginTop: "0.6rem",
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: "0.5px"
          }}
        >
          Resonating
        </div>
      )}
    </div>
  );
}
