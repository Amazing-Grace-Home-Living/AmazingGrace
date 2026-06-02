import React, { useEffect } from "react";
import { useHUD } from "../hud/HUDContext";
import { useHolyEncounterEngine } from "./useHolyEncounterEngine";
import { useNexusRouter } from "../router/useNexusRouter";
import Button from "../ui/Button";

export default function HolyEncounterScreen() {
  const { hud } = useHUD();
  const { nextStage, resetEncounter } = useHolyEncounterEngine();
  const { go } = useNexusRouter();

  const stage = hud?.holyEncounter?.stage ?? 0;
  const history = hud?.holyEncounter?.history || [];

  // Reset encounter automatically on first mount if it was left halfway
  useEffect(() => {
    if (stage === 0) {
      resetEncounter();
    }
  }, []);

  return (
    <div
      className="holy-encounter"
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "radial-gradient(circle at center, rgba(234, 179, 8, 0.05) 0%, rgba(10, 10, 12, 0.95) 70%)",
        border: "1px solid rgba(234, 179, 8, 0.15)",
        borderRadius: "16px",
        boxShadow: "0 0 40px rgba(234, 179, 8, 0.05)"
      }}
    >
      <div>
        <h1
          className="holy-title"
          style={{
            color: "var(--neon-gold)",
            letterSpacing: "0.25em",
            marginBottom: "30px",
            fontSize: "2rem",
            textShadow: "0 0 10px rgba(234, 179, 8, 0.4)"
          }}
        >
          HOLY OF HOLIES
        </h1>

        <div
          className="holy-dialogue"
          style={{
            textAlign: "left",
            margin: "20px 0",
            fontSize: "1rem",
            lineHeight: "1.8",
            color: "#e2e8f0",
            maxHeight: "350px",
            overflowY: "auto",
            padding: "20px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "8px"
          }}
        >
          {stage === 0 && (
            <p style={{ textAlign: "center", color: "#64748b", fontStyle: "italic" }}>
              The thick purple veil hangs before you. A solemn, weighty presence permeates the air.
              Are you prepared to step beyond the veil?
            </p>
          )}
          {history.map((line, i) => (
            <p
              key={i}
              style={{
                marginBottom: "15px",
                borderLeft: "2px solid var(--neon-gold)",
                paddingLeft: "15px",
                animation: "fadeIn 0.5s ease-out"
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
        {stage === 0 ? (
          <Button variant="primary" onClick={nextStage}>
            Draw Near & Enter
          </Button>
        ) : stage < 5 ? (
          <Button variant="primary" onClick={nextStage}>
            Continue Ascent
          </Button>
        ) : (
          <>
            <Button onClick={resetEncounter}>
              Calibrate & Try Again
            </Button>
            <Button variant="primary" onClick={() => go("temple")}>
              Return to Temple Map
            </Button>
          </>
        )}

        {stage > 0 && stage < 5 && (
          <button
            onClick={() => go("temple")}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "bold"
            }}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}
