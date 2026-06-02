import React, { useEffect, useState } from "react";
import { useRituals } from "./useRituals";
import { useHUD } from "../hud/HUDContext";
// @ts-ignore
import Button from "../ui/Button";

export default function RitualsPanel() {
  const { rituals, performRitual } = useRituals();
  const { hud } = useHUD();
  const [tick, setTick] = useState(0);

  // Force re-renders every second to keep cooldown times perfectly synced
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  function formatRemaining(ms) {
    const totalSecs = Math.ceil(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }

  return (
    <div className="hud-panel rituals-panel" style={{ border: "1px solid var(--hud-border)" }}>
      <h3 style={{ color: "var(--neon-gold)", fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        INNER COURT RITUALS
      </h3>
      <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "1rem" }}>
        Repeatable actions to expand moral resonance boundaries.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {rituals.map(r => {
          const last = hud?.rituals?.[r.id] || 0;
          const now = Date.now();
          const remainingMs = r.cooldown * 1000 - (now - last);
          const isOnCooldown = remainingMs > 0;

          return (
            <div key={r.id} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#e2e8f0" }}>{r.name}</span>
                {isOnCooldown ? (
                  <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>
                    ⏳ Cooldown: {formatRemaining(remainingMs)}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: "bold", textTransform: "uppercase", textShadow: "0 0 6px rgba(52, 211, 153, 0.4)" }}>
                    ✨ Ready
                  </span>
                )}
              </div>
              <Button 
                variant={isOnCooldown ? "default" : "primary"}
                onClick={() => performRitual(r.id)} 
                disabled={isOnCooldown}
                style={{ 
                  width: "100%", 
                  fontSize: "0.75rem", 
                  padding: "6px 12px",
                  opacity: isOnCooldown ? 0.5 : 1,
                  cursor: isOnCooldown ? "not-allowed" : "pointer"
                }}
              >
                {isOnCooldown ? "Locked" : `Perform (Virtue: ${r.virtue})`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
