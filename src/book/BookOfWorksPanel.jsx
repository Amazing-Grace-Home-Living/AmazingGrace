import React from "react";
import { useHUD } from "../hud/HUDContext";

export default function BookOfWorksPanel() {
  const { hud } = useHUD();
  const logs = hud?.bookOfWorks || [];

  function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toTimeString().split(" ")[0]; // returns HH:MM:SS
  }

  function getTypeColor(type) {
    switch (type) {
      case "virtue": return "var(--neon-purple)";
      case "xp": return "var(--neon-blue)";
      case "module": return "#a78bfa";
      case "notify": return "var(--neon-gold)";
      default: return "#94a3b8";
    }
  }

  return (
    <div className="hud-panel book-panel" style={{ border: "1px solid var(--hud-border)" }}>
      <h3 style={{ color: "var(--neon-gold)", fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        THE BOOK OF WORKS
      </h3>
      <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "1rem" }}>
        Chronological ledger of every moral coordinate delta.
      </p>

      <div style={{ 
        maxHeight: "180px", 
        overflowY: "auto", 
        background: "rgba(0,0,0,0.3)", 
        border: "1px solid rgba(255,255,255,0.04)", 
        borderRadius: "6px",
        padding: "8px",
        fontFamily: "monospace",
        fontSize: "0.75rem"
      }}>
        {logs.length === 0 ? (
          <div style={{ color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "10px" }}>
            The ledger is currently blank...
          </div>
        ) : (
          <ul className="book-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {logs.slice(-50).reverse().map((e, i) => {
              const color = getTypeColor(e.type);
              return (
                <li key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "4px" }}>
                  <span style={{ color: "#64748b", flexShrink: 0 }}>[{formatTime(e.time)}]</span>
                  <span style={{ color, fontWeight: "bold", textTransform: "uppercase", fontSize: "0.7rem", minWidth: "50px", flexShrink: 0 }}>
                    {e.type}
                  </span>
                  <span className="book-msg" style={{ color: "#e2e8f0", wordBreak: "break-word" }}>
                    {e.message}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
