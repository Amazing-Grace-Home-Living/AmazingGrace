import React, { useEffect } from "react";
import { useHUD } from "../hud/HUDContext";
import { useVisionCodex } from "./useVisionCodex";
import { useNexusRouter } from "../router/useNexusRouter";
import Button from "../ui/Button";

export default function VisionCodexScreen() {
  const { hud } = useHUD();
  const { recordVision, clearCodex } = useVisionCodex();
  const { go } = useNexusRouter();

  const visions = hud?.visionCodex || [];

  // Automatically record a vision on first mount if history is empty
  useEffect(() => {
    if (visions.length === 0) {
      recordVision();
    }
  }, []);

  return (
    <div
      className="vision-codex"
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "radial-gradient(circle at center, rgba(167, 139, 250, 0.05) 0%, rgba(10, 10, 12, 0.95) 70%)",
        border: "1px solid rgba(167, 139, 250, 0.15)",
        borderRadius: "16px",
        boxShadow: "0 0 40px rgba(167, 139, 250, 0.05)"
      }}
    >
      <div>
        <h1
          className="vision-title"
          style={{
            color: "var(--neon-purple)",
            letterSpacing: "0.25em",
            marginBottom: "10px",
            fontSize: "2rem",
            textShadow: "0 0 10px rgba(167, 139, 250, 0.4)"
          }}
        >
          VISION CODEX
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "30px" }}>
          Oracle Chamber Prophetic Ledger
        </p>

        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          {visions.length === 0 ? (
            <p style={{ color: "#64748b", fontStyle: "italic", padding: "40px" }}>
              No recorded visions exist within this calibration cycle.
            </p>
          ) : (
            visions.map((v, i) => (
              <div
                key={i}
                style={{
                  textAlign: "left",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(167, 139, 250, 0.1)",
                  borderRadius: "8px",
                  padding: "15px",
                  position: "relative",
                  animation: "fadeIn 0.3s ease-out"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      color: "var(--neon-purple)",
                      background: "rgba(167, 139, 250, 0.1)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}
                  >
                    Tone: {v.tone}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                    {new Date(v.time).toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ color: "#e2e8f0", fontSize: "0.9rem", lineHeight: "1.6", fontStyle: "italic" }}>
                  "{v.vision.text || v.vision}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <Button variant="primary" onClick={recordVision}>
          Seek Prophecy
        </Button>
        {visions.length > 0 && (
          <Button onClick={clearCodex}>
            Clear Chronicle
          </Button>
        )}
        <Button variant="primary" onClick={() => go("temple")}>
          Return to Temple Map
        </Button>
      </div>
    </div>
  );
}
