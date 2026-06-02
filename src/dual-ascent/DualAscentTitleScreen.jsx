import React from 'react';
import { useNexusRouter } from "../router/useNexusRouter";
import { useDualAscent } from "./DualAscentContext";
import Button from "../ui/Button";
import "./dual-ascent.css";

import { useState } from 'react';
export default function DualAscentTitleScreen() {
  const { go } = useNexusRouter();
  const { data } = useDualAscent();
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <div className="da-title-screen">
      <div className="da-title-background">
        <div className="da-world-left" />
        <div className="da-world-right" />
        <div className="da-mirror-path-static" />
      </div>

      <div className="da-title-foreground">
        <h1 className="da-main-title">NEXUS ARCADE</h1>
        <h2 className="da-sub-title">DUAL ASCENT</h2>

        <nav className="da-title-menu">
          <Button variant="primary" onClick={() => go("sheilaPath")}>
            Begin Ascent
          </Button>
          <Button variant="secondary" onClick={() => go("yiPath")}>
            Fractal Journey
          </Button>
          <Button onClick={() => go("temple")}>
            World Codex
          </Button>
          <Button onClick={() => go("temple")}>
            Settings
          </Button>
          <Button onClick={() => setShowLyrics(true)}>
            OST Lyrics
          </Button>
        </nav>
      </div>

{showLyrics && (
        <div className="da-lyrics-overlay">
          <div className="da-lyrics-box">
            <h2>{data.ost.title}</h2>
            <pre>{data.ost.lyrics}</pre>
            <Button onClick={() => setShowLyrics(false)}>Close</Button>
          </div>
        </div>
      )}

      <div className="da-ambient-audio-hint">
        <span className="da-pulse-dot" /> Dual-Tone Resonance Detected
      </div>
    </div>
  );
}

