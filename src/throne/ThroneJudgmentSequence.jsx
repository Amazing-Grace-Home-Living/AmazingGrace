import React from "react";
import { useHUD } from "../hud/HUDContext";
import { getOracleTone } from "../oracle/getOracleTone";
// @ts-ignore
import Button from "../ui/Button";

export default function ThroneJudgmentSequence({ onComplete }) {
  const { hud } = useHUD();
  const virtueEngine = hud?.virtueEngine || {
    truth: 0,
    faithfulness: 0,
    wisdom: 0,
    humility: 0,
    perseverance: 0,
    alertness: 0,
    love: 0,
    corruption: 0
  };
  const tone = getOracleTone(virtueEngine);

  const outcomes = {
    gentle: "“Well done, faithful one. Enter the joy prepared for you.”",
    neutral: "“Your path is steady. Continue in the light you have received.”",
    warning: "“You stand at a crossroads. Choose the narrow way.”",
    severe: "“Turn back. Darkness has marked your steps.”"
  };

  const outcomeText = outcomes[tone] || outcomes.neutral;

  return (
    <div className="throne-cinematic">
      <div className="throne-light" />
      <div className="throne-voice" style={{ fontFamily: "monospace", fontSize: "1.2rem", fontWeight: "bold", textShadow: "0 0 10px rgba(0, 229, 255, 0.4)", margin: "20px 0" }}>
        {outcomeText}
      </div>

      <Button variant="primary" onClick={onComplete} style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
        Accept Judgment & Seal Destiny
      </Button>
    </div>
  );
}
