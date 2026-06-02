import React from 'react';
import { useNexusRouter } from "../router/useNexusRouter";
import { useDualAscent } from "./DualAscentContext";
import Button from "../ui/Button";
import "./dual-ascent.css";

export default function MirrorLayerScreen() {
  const { go } = useNexusRouter();
  const { data, resonanceLevel, triggerResonance } = useDualAscent();

  return (
    <div className="da-screen mirror-layer">
      <div className="da-mirror-split">
        <div className="split-side side-harmonic">
          <h2>THE PATH-BEARER</h2>
          <p>"{data.dialogue.oracles.radiant}"</p>
        </div>
        <div className="split-divider" />
        <div className="split-side side-fractal">
          <h2>THE ECHO</h2>
          <p>"{data.dialogue.oracles.fractured}"</p>
        </div>
      </div>

      <div className="da-guardian-overlay">
        <p className="guardian-text">{data.dialogue.guardians.distinction}</p>
      </div>

      <div className="da-resonance-controls">
        <Button onClick={triggerResonance} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
          ACTIVATE RESONANCE (LEVEL {resonanceLevel})
        </Button>
        {resonanceLevel > 3 && (
          <Button variant="primary" onClick={() => go("unutterable")}>
            REACH THE UNUTTERABLE
          </Button>
        )}
      </div>

      <footer className="da-footer">
        <Button variant="secondary" onClick={() => go("temple")}>
          Return to Map
        </Button>
      </footer>
    </div>
  );
}


