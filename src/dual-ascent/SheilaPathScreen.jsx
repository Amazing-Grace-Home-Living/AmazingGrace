import React from 'react';
import { useHUD } from "../hud/HUDContext";
import { useNexusRouter } from "../router/useNexusRouter";
import { useDualAscent } from "./DualAscentContext";
import Button from "../ui/Button";
import "./dual-ascent.css";

export default function SheilaPathScreen() {
  const { go } = useNexusRouter();
  const { sheilaAct, advanceSheila, data } = useDualAscent();
  const currentQuest = data.quests.sheila[sheilaAct - 1];

  return (
    <div className="da-screen sheila-path">
      <header className="da-header">
        <span className="da-label">PATH OF THE PATH-BEARER</span>
        <h1>{currentQuest.title}</h1>
      </header>

      <div className="da-content">
        <p className="da-quest-desc">"{currentQuest.desc}"</p>
        
        <div className="da-symbol-zone">
          <div className="da-resonant-line" />
          {sheilaAct >= 2 && <div className="da-harmonic-field" />}
        </div>

        <div className="da-reward-hint">
          Reward: {currentQuest.reward}
        </div>
      </div>

      <footer className="da-footer">
        <Button variant="secondary" onClick={() => go("temple")}>
          Return to Map
        </Button>
        {sheilaAct < 3 && (
          <Button variant="primary" onClick={advanceSheila}>
            Fulfill Intent
          </Button>
        )}
        {sheilaAct === 3 && (
          <Button variant="primary" onClick={() => go("mirrorLayer")}>
            Face the Echo
          </Button>
        )}
      </footer>
    </div>
  );
}

