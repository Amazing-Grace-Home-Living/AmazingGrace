import React, { useEffect, useState, useRef } from "react";
// @ts-ignore
import { useHUD } from "../hud/HUDContext";
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
// @ts-ignore
import { useTempleVeil } from "../temple/useTempleVeil";
// @ts-ignore
import TempleVeilCinematic from "../temple/TempleVeilCinematic";

export default function InnerCourtScreen() {
  const { hud } = useHUD();
  const { startCalibration } = useConscienceHUD();
  const { openBibleStudy } = useBibleStudyHUD();
  const { activateLamp } = useSevenLampsHUD();
  const { go } = useNexusRouter();
  const { canEnter } = useThroneRoom();
  const { checkVeil } = useTempleVeil();

  const [showVeilCinematic, setShowVeilCinematic] = useState(false);
  const wasTornRef = useRef(hud?.templeVeil?.torn);

  // Evaluate the temple veil on every HUD state change
  useEffect(() => {
    checkVeil();
  }, [hud, checkVeil]);

  // Trigger 4-second splitting cinematic on the transition to torn = true
  useEffect(() => {
    if (hud?.templeVeil?.torn && !wasTornRef.current) {
      setShowVeilCinematic(true);
      const timer = setTimeout(() => setShowVeilCinematic(false), 4000);
      wasTornRef.current = true;
      return () => clearTimeout(timer);
    }
    if (hud?.templeVeil?.torn) {
      wasTornRef.current = true;
    }
  }, [hud?.templeVeil?.torn]);

  const torn = hud?.templeVeil?.torn || false;

  return (
    <div className="inner-court" style={{ position: "relative" }}>
      {showVeilCinematic && <TempleVeilCinematic />}

      <header className="inner-court-header" style={{ marginBottom: "1rem", display: "flex", justifyBetween: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 style={{ margin: 0, letterSpacing: "3px", textTransform: "uppercase", fontSize: "1.3rem", color: "var(--neon-gold)" }}>
              THE INNER COURT
            </h1>
            {torn && (
              <span style={{ fontSize: "0.65rem", padding: "2px 6px", background: "rgba(0, 229, 255, 0.15)", border: "1px solid rgba(0, 229, 255, 0.3)", color: "var(--neon-blue)", borderRadius: "4px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ✨ Veil Torn
              </span>
            )}
          </div>
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
                boxShadow: "0 0 12px rgba(234, 179, 8, 0.4)"
              }}
            >
              👑 Enter Throne Room
            </Button>
          )}
          <Button onClick={() => go("temple")} style={{ padding: "6px 14px", fontSize: "0.75rem", background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)", color: "var(--neon-gold)", fontWeight: "bold" }}>
            🕌 Temple Map
          </Button>
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
