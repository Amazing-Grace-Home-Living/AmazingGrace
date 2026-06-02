import React, { useState } from 'react';
import { useNexusRouter } from "../router/useNexusRouter";
import { useDualAscent } from "./DualAscentContext";
import Button from "../ui/Button";
import "./dual-ascent.css";

export default function SheilaPathChapter1() {
  const { go } = useNexusRouter();
  const { data, advanceSheila } = useDualAscent();
  const quest = data.quests.sheila[0];
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isBossActive, setIsBossActive] = useState(false);

  const nextDialogue = () => {
    if (dialogueIndex < quest.dialogue.length - 1) {
      setDialogueIndex(d => d + 1);
    } else {
      setIsBossActive(true);
    }
  };

  return (
    <div className="da-screen sheila-path chapter-1">
      <header className="da-header">
        <span className="da-label">ACT I: THE RESONANT BEGINNING</span>
        <h1>{quest.title}</h1>
      </header>

      <div className="da-content">
        {!isBossActive ? (
          <div className="da-dialogue-box">
            <div className="da-speaker">{quest.dialogue[dialogueIndex].speaker}</div>
            <p className="da-text">"{quest.dialogue[dialogueIndex].text}"</p>
            <Button onClick={nextDialogue}>Next</Button>
          </div>
        ) : (
          <div className="da-boss-fight">
            <div className="da-boss-header">
              <h2>{quest.boss.name}</h2>
              <p className="da-boss-desc">{quest.boss.desc}</p>
            </div>
            
            <div className="da-boss-arena">
              <div className="da-resonant-line pulse" />
              <div className="da-echo-shade-visual" />
            </div>

            <div className="da-actions">
              <Button variant="primary" onClick={() => {
                alert("Boss contained! " + quest.boss.victoryDialogue);
                advanceSheila();
                go("temple");
              }}>
                Apply Harmonic Resonance
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <footer className="da-footer">
         <Button onClick={() => go("daTitle")}>Abort Mission</Button>
      </footer>
    </div>
  );
}
