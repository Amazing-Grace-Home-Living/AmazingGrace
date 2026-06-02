import React, { useState, useEffect } from 'react';
import { useNexusRouter } from "../router/useNexusRouter";
import { DUAL_ASCENT_DATA } from './DualAscentData';
import "./dual-ascent.css";

export default function OpeningCinematic() {
  const { go } = useNexusRouter();
  const [currentScene, setCurrentScene] = useState(0);
  const [fade, setFade] = useState(true);
  const scenes = DUAL_ASCENT_DATA.openingCinematic.scenes;

  useEffect(() => {
    if (currentScene >= scenes.length) {
      const timer = setTimeout(() => go("daTitle"), 1000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentScene(s => s + 1);
        setFade(true);
      }, 1000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentScene, go, scenes.length]);

  if (currentScene >= scenes.length) {
    return <div className="da-cinematic-blackout" />;
  }

  const scene = scenes[currentScene];

  return (
    <div className={`da-cinematic-root da-scene-${scene.id} ${fade ? 'fade-in' : 'fade-out'}`}>
      <div className="da-visual-container">
        {scene.id === 'harmonic-dawn' && <div className="da-resonant-line-intro" />}
        {scene.id === 'fractal-dawn' && <div className="da-fractal-bloom-intro" />}
        {scene.id === 'mirror-awakens' && (
          <div className="da-mirror-split-intro">
            <div className="da-split-gold" />
            <div className="da-split-blue" />
            <div className="da-mirror-path-ignite" />
          </div>
        )}
      </div>

      <div className="da-narration-overlay">
        <p className={`da-narration-text da-tone-${scene.tone.toLowerCase()}`}>
          {scene.narration}
        </p>
      </div>
      
      <button className="da-skip-btn" onClick={() => go("daTitle")}>SKIP</button>
    </div>
  );
}
