import React from 'react';
import { useHUD } from "../hud/HUDContext";
import { useNexusRouter } from "../router/useNexusRouter";
import { useDualAscent } from "./DualAscentContext";
import Button from "../ui/Button";
import "./dual-ascent.css";

export default function YiPathScreen() {
  const { go } = useNexusRouter();
  const { yiAct, advanceYi, data } = useDualAscent();
  const currentQuest = data.quests.yi[yiAct - 1];
  const profile = data.profiles.nicholaiEcho;

  return (
    <div className="da-screen yi-path">
      <header className="da-header">
        <span className="da-label">FRACTAL CORRIDOR // PARADOX ASCENDANT</span>
        <h1>{currentQuest.title}</h1>
      </header>

      <div className="da-rpg-layout">
        <aside className="da-stats-panel">
          <h3>STATUS</h3>
          <ul>
            <li>Willpower: {profile.stats.willpower}</li>
            <li>Insight: {profile.stats.insight}</li>
            <li>Paradox: {profile.stats.paradoxControl}</li>
            <li>Stability: {profile.stats.stability}</li>
          </ul>
        </aside>

        <main className="da-main-view">
          <p className="da-quest-desc">MISSION: {currentQuest.desc}</p>
          
          <div className="da-ability-grid">
            {profile.abilities.map(a => (
              <button key={a} className="da-ability-btn">{a}</button>
            ))}
          </div>

          {currentQuest.boss && (
            <div className="da-boss-warning">
              WARNING: {currentQuest.boss.name} DETECTED
            </div>
          )}
        </main>
      </div>

      <footer className="da-footer">
        <Button variant="secondary" onClick={() => go("temple")}>
          Abort Mission
        </Button>
        {yiAct < 3 ? (
          <Button variant="primary" onClick={advanceYi}>
            Execute Cycle
          </Button>
        ) : (
          <Button variant="primary" onClick={() => go("mirrorLayer")}>
            Enter Mirror Layer
          </Button>
        )}
      </footer>
    </div>
  );
}

