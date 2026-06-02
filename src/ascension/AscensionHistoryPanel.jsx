import React from "react";
import { useHUD } from "../hud/HUDContext";

export default function AscensionHistoryPanel() {
  const { hud } = useHUD();
  const realms = hud?.ascension?.realms || [];

  return (
    <div className="hud-panel ascension-history">
      <h3>Ascension History</h3>
      {realms.length === 0 ? (
        <div className="history-empty">No layers ascended yet.</div>
      ) : (
        <ul>
          {realms.map((r, i) => (
            <li key={i}>
              <span className="history-layer">Layer {i + 1}:</span>
              <span className="history-realm"> {r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
