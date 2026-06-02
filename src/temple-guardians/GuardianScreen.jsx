import React, { useState } from "react";
import { useHUD } from "../hud/HUDContext";
import { getGuardianChallenge } from "./getGuardianChallenge";
import Button from "../ui/Button";

export default function GuardianScreen({ onPass, onFail }) {
  const { hud, setHUD } = useHUD();
  const [answer, setAnswer] = useState("");
  const challenge = getGuardianChallenge(hud);

  const targetRoom = hud?.route?.target || "temple";
  const truthVal = hud?.virtueEngine?.truth ?? 0;
  const targetVirtue = truthVal < 3 ? "truth" : "love";

  function handleAnswerSubmit(e) {
    e.preventDefault();
    if (!answer.trim()) return;

    // Log answer to Book of Works and grant virtue reward
    setHUD((h) => {
      const currentWorks = h.bookOfWorks || [];
      const currentVirtues = h.virtueEngine || {};
      const updatedVirtues = {
        ...currentVirtues,
        [targetVirtue]: (currentVirtues[targetVirtue] || 0) + 1
      };
      
      return {
        ...h,
        virtueEngine: updatedVirtues,
        bookOfWorks: [
          ...currentWorks,
          {
            timestamp: Date.now(),
            action: `Faced the Guardians. Answered challenge for entering ${targetRoom}: "${answer}"`,
            category: "Ritual Calibration",
            virtue: targetVirtue
          }
        ]
      };
    });

    onPass();
  }

  return (
    <div
      className="guardian-screen"
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "60px auto",
        background: "radial-gradient(circle at center, rgba(244, 63, 94, 0.03) 0%, rgba(10, 10, 12, 0.98) 80%)",
        border: "1px solid rgba(244, 63, 94, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 0 30px rgba(244, 63, 94, 0.05)"
      }}
    >
      <h2
        style={{
          color: "#f43f5e",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "20px",
          fontSize: "1.5rem",
          textShadow: "0 0 10px rgba(244, 63, 94, 0.3)"
        }}
      >
        TEMPLE GUARDIANS
      </h2>

      <div
        className="guardian-message"
        style={{
          fontSize: "1.1rem",
          lineHeight: "1.7",
          color: "#f1f5f9",
          background: "rgba(0,0,0,0.5)",
          padding: "25px",
          borderRadius: "8px",
          borderLeft: "4px solid #f43f5e",
          textAlign: "left",
          marginBottom: "30px",
          fontStyle: "italic"
        }}
      >
        {challenge.message}
      </div>

      {challenge.type === "allow" && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button variant="primary" onClick={onPass}>
            Enter Chamber
          </Button>
          <Button onClick={onFail}>
            Withdraw
          </Button>
        </div>
      )}

      {challenge.type === "deny" && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="primary" onClick={onFail}>
            Return to Overworld
          </Button>
        </div>
      )}

      {challenge.type === "question" && (
        <form onSubmit={handleAnswerSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
              Provide your confession / answer:
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak truth into the silence..."
              required
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "0.85rem",
                fontFamily: "monospace",
                resize: "none",
                outline: "none"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f43f5e")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <Button variant="primary" type="submit">
              Answer with your life
            </Button>
            <Button onClick={onFail}>
              Withdraw
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
