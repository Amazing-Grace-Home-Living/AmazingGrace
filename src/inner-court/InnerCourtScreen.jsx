import React from "react";
// @ts-ignore
import SpiritualFormationPanel from "../spiritual/SpiritualFormationPanel";
// @ts-ignore
import VirtueEnginePanel from "../virtue/VirtueEnginePanel";
// @ts-ignore
import ScrollOfDestinyPanel from "../scroll/ScrollOfDestinyPanel";
// @ts-ignore
import OraclePanel from "../oracle/OraclePanel";
// @ts-ignore
import RitualsPanel from "./RitualsPanel";
// @ts-ignore
import BookOfWorksPanel from "../book/BookOfWorksPanel";
// @ts-ignore
import Button from "../ui/Button";
// @ts-ignore
import { useConscienceHUD } from "../conscience/useConscienceHUD";
// @ts-ignore
import { useBibleStudyHUD } from "../modules/bible-study/useBibleStudyHUD";
// @ts-ignore
import { useSevenLampsHUD } from "../modules/seven-lamps/useSevenLampsHUD";
// @ts-ignore
import { useNexusRouter } from "../router/useNexusRouter";
// @ts-ignore
import { useThroneRoom } from "../throne/useThroneRoom";

export default function InnerCourtScreen() {
  const { startCalibration } = useConscienceHUD();
  const { openBibleStudy } = useBibleStudyHUD();
  const { activateLamp } = useSevenLampsHUD();
  const { go } = useNexusRouter();
  const { canEnter } = useThroneRoom();

  return (
    <div className="inner-court">
      <header className="inner-court-header" style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ margin: 0, letterSpacing: "3px", textTransform: "uppercase", fontSize: "1.3rem", color: "var(--neon-gold)" }}>
            THE INNER COURT
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
            Spiritual operating cockpit of the Matrix of Conscience
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {canEnter() && (
            <Button 
              onClick={() => go("throne")} 
              style={{ 
                padding: "6px 14px", 
                fontSize: "0.75rem", 
                background: "linear-gradient(to right, #eab308, #ca8a04)", 
                border: "1px solid #facc15", 
                color: "#000", 
                fontWeight: "bold", 
                boxShadow: "0 0 12px rgba(234, 179, 8, 0.4)",
                animation: "ss-twinkle 2s ease-in-out infinite alternate"
              }}
            >
              👑 Enter Throne Room
            </Button>
          )}
          <Button onClick={() => go("matrix")} style={{ padding: "6px 14px", fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }}>
            🚪 Return to Matrix
          </Button>
        </div>
      </header>

      <div className="inner-court-grid">
        <SpiritualFormationPanel />
        <VirtueEnginePanel />
        <RitualsPanel />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ScrollOfDestinyPanel />
          <OraclePanel />
          <BookOfWorksPanel />
        </div>
      </div>

      <footer className="inner-court-footer" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>
        <Button onClick={startCalibration} style={{ flex: 1, padding: "10px 15px", fontSize: "0.8rem" }}>
          ⚡ Conscience Calibration
        </Button>
        <Button onClick={openBibleStudy} style={{ flex: 1, padding: "10px 15px", fontSize: "0.8rem" }}>
          📖 Bible Study Quiz
        </Button>
        <Button onClick={() => activateLamp("lamp_7")} style={{ flex: 1, padding: "10px 15px", fontSize: "0.8rem" }}>
          🔥 Activate Lamp: Fear of the Lord
        </Button>
      </footer>
    </div>
  );
}
