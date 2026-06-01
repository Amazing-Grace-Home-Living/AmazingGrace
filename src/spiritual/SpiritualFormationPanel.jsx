import React from "react";
import SevenStarsConstellation from "../modules/seven-stars/SevenStarsConstellation";
import Button from "../ui/Button";
import { useSevenStarsProgress } from "../modules/seven-stars/useSevenStarsProgress";
import { useBibleStudyHUD } from "../modules/bible-study/useBibleStudyHUD";

export default function SpiritualFormationPanel() {
  const { progress, collectStar } = useSevenStarsProgress();
  const { openBibleStudy } = useBibleStudyHUD();

  // Safely extract Seven Stars metrics with fallbacks
  const collectedList = progress?.sevenStars?.collected || [];
  const virtuesList = progress?.sevenStars?.unlockedVirtues || [];
  const starsCount = collectedList.length;
  const virtuesCount = virtuesList.length;
  const level = progress?.sevenStars?.level || 1;

  return (
    <div className="sf-panel hud-panel" style={{ marginTop: "1rem", border: "1px solid var(--hud-border)" }}>
      <h3 style={{ color: "var(--neon-gold)", fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        SPIRITUAL FORMATION
      </h3>

      <div className="sf-section" style={{ fontSize: "0.85rem", color: "#e2e8f0", marginBottom: "1rem", lineHeight: "1.6" }}>
        <h4 style={{ color: "var(--hud-accent)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Seven Stars Progress</h4>
        <div>Stars Collected: <span style={{ fontWeight: "bold", color: "var(--neon-blue)" }}>{starsCount} / 7</span></div>
        <div>Virtues Unlocked: <span style={{ fontWeight: "bold", color: "var(--neon-purple)" }}>{virtuesCount}</span></div>
        <div>Conscience Level: <span style={{ fontWeight: "bold", color: "var(--neon-gold)" }}>{level}</span></div>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <SevenStarsConstellation />
      </div>

      <div className="sf-section" style={{ fontSize: "0.85rem", color: "#e2e8f0", marginBottom: "1rem" }}>
        <h4 style={{ color: "var(--hud-accent)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Unlocked Virtues</h4>
        <ul className="sf-virtues" style={{ listStyle: "square", paddingLeft: "20px", margin: "6px 0 0" }}>
          {virtuesList.length === 0 ? (
            <li style={{ color: "#64748b", fontStyle: "italic" }}>No virtues unlocked yet</li>
          ) : (
            virtuesList.map(v => (
              <li key={v} style={{ color: "var(--neon-purple)" }}>{v}</li>
            ))
          )}
        </ul>
      </div>

      <div className="sf-section">
        <Button variant="primary" onClick={openBibleStudy} style={{ width: "100%" }}>
          📖 Begin Bible Study Quiz
        </Button>
      </div>
    </div>
  );
}
