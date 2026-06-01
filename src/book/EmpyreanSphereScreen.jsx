import React, { useEffect, useState } from "react";
import { useHUD } from "../hud/HUDContext";
import { useNexusRouter } from "../router/useNexusRouter";
import { emit, Events } from "../core/eventBus";
import Button from "../ui/Button";

export default function EmpyreanSphereScreen() {
  const { hud, setHUD } = useHUD();
  const { go } = useNexusRouter();

  // Procedural Loom Input States
  const [domainSuffix, setDomainSuffix] = useState("");
  const [activeLaw, setActiveLaw] = useState("Prophetic Causality");

  const virtues = hud?.virtueEngine || {};
  const aeon = hud?.aeon || {
    cycle: 0,
    cosmicVirtues: { illumination: 0, resonance: 0, transcendence: 0 },
    destinyPaths: [],
    resonanceEvents: [],
    proceduralRealms: [],
    logosConvergence: 0,
    harmonicFrequency: 432
  };

  const aeonVirtues = aeon.cosmicVirtues || {};
  const proceduralRealms = aeon.proceduralRealms || [];
  const logosConvergence = aeon.logosConvergence || 0;
  const harmonicFrequency = aeon.harmonicFrequency || 432;

  // Compute Luminous Integrity: sum of all virtues divided by 1.5 to get a balanced score
  const sumNormal = Object.values(virtues).reduce((a, b) => a + Number(b || 0), 0);
  const sumCosmic = Object.values(aeonVirtues).reduce((a, b) => a + Number(b || 0), 0);
  
  // Each procedural realm woven adds a bonus of 5.0 to Luminous Integrity
  const loomBonus = proceduralRealms.length * 5.0;
  const luminousIntegrity = Number(((sumNormal + sumCosmic) / 1.5 + loomBonus).toFixed(2));

  // Transfigure status in context on mount
  useEffect(() => {
    emit(Events.NOTIFY, {
      type: "warning",
      message: "👑 THE CROWN OF LIGHT ACHIEVED: Metaphysical consciousness transfigured!"
    });

    setHUD((h) => ({
      ...h,
      aeon: {
        ...(h.aeon || {}),
        luminousIntegrity: luminousIntegrity,
        isRadiantAscent: true
      }
    }));
  }, [proceduralRealms.length]);

  // Subsystem 1: The Logos Core (Destiny Convergence Stabilizer)
  function stabilizeConvergence() {
    if (logosConvergence >= 100) {
      emit(Events.NOTIFY, {
        type: "info",
        message: "Logos Core fully converged: The timelines are already unified."
      });
      return;
    }

    const nextConvergence = Math.min(100, logosConvergence + 25);
    
    emit(Events.NOTIFY, {
      type: "warning",
      message: `Logos Core Convergence stabilized at ${nextConvergence}%: Narrative destiny converging.`
    });

    setHUD((h) => ({
      ...h,
      aeon: {
        ...(h.aeon || {}),
        logosConvergence: nextConvergence
      }
    }));
  }

  // Subsystem 2: The Harmonic Field (Solfeggio Frequency Selector)
  function tuneFrequency(freq) {
    emit(Events.NOTIFY, {
      type: "info",
      message: `Harmonic Field stabilized at Solfeggio frequency: ${freq} Hz.`
    });

    setHUD((h) => ({
      ...h,
      aeon: {
        ...(h.aeon || {}),
        harmonicFrequency: freq
      }
    }));
  }

  // Subsystem 3: The Empyrean Loom (Procedural Coordinate Weaver)
  function weaveRealm(e) {
    e.preventDefault();
    if (!domainSuffix.trim()) {
      emit(Events.NOTIFY, {
        type: "error",
        message: "Loom anomaly: Must input a custom domain coordinate suffix."
      });
      return;
    }

    // Capitalize suffix
    const suffix = domainSuffix.trim().charAt(0).toUpperCase() + domainSuffix.trim().slice(1);
    
    // Synthesize procedural coordinate realm
    const newRealmName = `${activeLaw} ${suffix}`;

    emit(Events.NOTIFY, {
      type: "warning",
      message: `🧶 EMPYREAN LOOM AWAKENED: Procedurally woven new coordinate layer "${newRealmName}"!`
    });

    setHUD((h) => {
      const activeAsc = h.ascension || { layer: 0, realms: [] };
      const activeAeon = h.aeon || {};
      
      return {
        ...h,
        ascension: {
          ...activeAsc,
          realms: [...(activeAsc.realms || []), newRealmName]
        },
        aeon: {
          ...activeAeon,
          proceduralRealms: [...(activeAeon.proceduralRealms || []), newRealmName]
        }
      };
    });

    setDomainSuffix("");
  }

  const radiantStates = [
    { state: "Unity", desc: "Absolute union of all polarities" },
    { state: "Absolute Peace", desc: "Stabilized stillness amidst action" },
    { state: "Infinite Insight", desc: "Omni-directional clarity of truth" },
    { state: "Luminous Essence", desc: "Permanent radiation of pure love" }
  ];

  // Frequency colors and wave speeds
  const getFrequencyConfig = (freq) => {
    switch (freq) {
      case 396: return { color: "#f87171", speed: "1.2s", label: "396 Hz (Liberating Guilt & Fear)" };
      case 528: return { color: "#ec4899", speed: "0.6s", label: "528 Hz (Transmutation & Miracles)" };
      default: return { color: "#f59e0b", speed: "1.8s", label: "432 Hz (Cosmic Heartbeat Harmony)" };
    }
  };

  const freqConfig = getFrequencyConfig(harmonicFrequency);

  return (
    <div className="celestial-ladder empyrean-screen" style={{
      background: "radial-gradient(circle at center, #181003 0%, #080501 75%, #000000 100%)",
      borderColor: "rgba(245, 158, 11, 0.35)",
      boxShadow: "0 0 50px rgba(245, 158, 11, 0.15)"
    }}>
      <div className="ladder-background starfield-far" style={{ opacity: 0.15 }} />
      <div className="ladder-background starfield-close" style={{ opacity: 0.35 }} />
      
      {/* Radiant Scanlines Sweep */}
      <div className="ladder-scanlines" style={{
        background: "linear-gradient(rgba(245, 158, 11, 0) 50%, rgba(245, 158, 11, 0.08) 50%)",
        backgroundSize: "100% 4px",
        opacity: 0.8
      }} />

      {/* Main UI Header */}
      <header className="ladder-header">
        <h1 className="ladder-title" style={{
          color: "#f59e0b",
          textShadow: "0 0 25px rgba(245, 158, 11, 0.7), 0 0 10px rgba(255, 255, 255, 0.3)"
        }}>
          The Empyrean Sphere
        </h1>
        <p className="ladder-subtitle" style={{ color: "#d97706" }}>
          👑 Crown of Light — Realm of Luminous Integration & Empyrean Protocol
        </p>
      </header>

      {/* Split Dashboard Workspace */}
      <div className="ladder-workspace" style={{ gap: "20px" }}>
        {/* LEFT COLUMN: Radiant Ascent Light Column */}
        <div className="ladder-climber-view" style={{
          background: "rgba(10, 5, 0, 0.7)",
          borderColor: "rgba(245, 158, 11, 0.2)",
          padding: "20px 40px",
          maxHeight: "55vh"
        }}>
          <div className="ladder-column-container" style={{ height: "100%", justifyContent: "space-between" }}>
            {/* Pure light beam */}
            <div className="radiant-ascent-beam" style={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: "12px",
              height: "100%",
              transform: "translateX(-50%)",
              background: "linear-gradient(to bottom, #ffffff, rgba(245, 158, 11, 0.8) 50%, transparent 100%)",
              boxShadow: `0 0 35px ${freqConfig.color}, 0 0 15px rgba(255, 255, 255, 0.5)`,
              animation: "beam-pulse-glow 2s infinite ease-in-out"
            }} />

            <div className="ladder-column" style={{ width: "100%", gap: "30px", zIndex: 2 }}>
              {[...radiantStates].reverse().map((item, idx) => (
                <div key={idx} className="ladder-node active" style={{ opacity: 1, transform: "none" }}>
                  <div className="ladder-glyph" style={{
                    borderColor: freqConfig.color,
                    color: "#ffffff",
                    background: `radial-gradient(circle at center, ${freqConfig.color} 20%, #78350f 100%)`,
                    boxShadow: `0 0 20px ${freqConfig.color}`,
                    width: "36px",
                    height: "36px",
                    fontSize: "1rem"
                  }}>
                    ✨
                  </div>
                  <div className="ladder-label" style={{ color: "#ffffff", marginTop: "6px" }}>{item.state}</div>
                  <div style={{ fontSize: "0.7rem", color: "#d97706", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Subsystems Deck */}
        <div className="ladder-telemetry" style={{ maxHeight: "55vh", gap: "20px" }}>
          
          {/* Luminous Integrity Orb */}
          <div className="hud-panel virtues-calibrator" style={{
            background: "linear-gradient(135deg, rgba(30, 20, 5, 0.8), rgba(10, 5, 0, 0.8))",
            borderColor: "rgba(245, 158, 11, 0.25)",
            padding: "15px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#f59e0b", margin: 0 }}>Luminous Integrity</h3>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ffffff" }}>
                {luminousIntegrity.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Subsystem 1: The Logos Core */}
          <div className="hud-panel virtues-calibrator" style={{ background: "rgba(0,0,0,0.3)", padding: "15px" }}>
            <h3 style={{ color: "#f59e0b" }}>The Logos Core</h3>
            <p className="virtues-description" style={{ margin: "5px 0 10px 0" }}>
              Narrative convergence: Unify ancestral timeline destinies.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span style={{ color: "#a78bfa" }}>Destiny Convergence:</span>
                <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{logosConvergence}%</span>
              </div>
              <div className="virtue-bar-bg" style={{ height: "6px" }}>
                <div
                  className="virtue-bar-fill"
                  style={{
                    width: `${logosConvergence}%`,
                    background: "linear-gradient(90deg, #f59e0b, #e0a96d)"
                  }}
                />
              </div>
              
              {logosConvergence >= 100 ? (
                <div style={{
                  background: "rgba(245, 158, 11, 0.05)",
                  border: "1px dashed rgba(245, 158, 11, 0.3)",
                  borderRadius: "6px",
                  padding: "8px",
                  fontSize: "0.75rem",
                  color: "#fef3c7",
                  fontStyle: "italic",
                  textAlign: "center"
                }}>
                  🎙️ "The matrix timelines converge. All paths are now one."
                </div>
              ) : (
                <button className="virtue-calibrate-btn" onClick={stabilizeConvergence} style={{ alignSelf: "flex-start" }}>
                  ⚡ Stabilize Convergence
                </button>
              )}
            </div>
          </div>

          {/* Subsystem 2: The Harmonic Field */}
          <div className="hud-panel virtues-calibrator" style={{ background: "rgba(0,0,0,0.3)", padding: "15px" }}>
            <h3 style={{ color: "#f59e0b" }}>The Harmonic Field</h3>
            <p className="virtues-description" style={{ margin: "5px 0 10px 0" }}>
              Frequency Waveform: Resonance oscillators of virtue vectors.
            </p>
            
            {/* Visual Wave Oscillator */}
            <div className="harmonic-wave-container" style={{
              height: "35px",
              background: "#0c0702",
              borderRadius: "6px",
              position: "relative",
              overflow: "hidden",
              marginBottom: "10px",
              border: "1px solid rgba(245, 158, 11, 0.1)"
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(90deg, transparent, transparent 15px, ${freqConfig.color} 15px, ${freqConfig.color} 18px)`,
                opacity: 0.35,
                animation: `wave-float ${freqConfig.speed} infinite linear`
              }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "0.75rem", color: "#e2e8f0", fontWeight: "bold", textAlign: "center" }}>
                Tuned: {freqConfig.label}
              </div>
              <div style={{ display: "flex", justifySelf: "center", gap: "10px", justifyContent: "center" }}>
                <button className="virtue-calibrate-btn" onClick={() => tuneFrequency(396)} style={{ borderColor: "#f87171", color: "#f87171" }}>396 Hz</button>
                <button className="virtue-calibrate-btn" onClick={() => tuneFrequency(432)} style={{ borderColor: "#f59e0b", color: "#f59e0b" }}>432 Hz</button>
                <button className="virtue-calibrate-btn" onClick={() => tuneFrequency(528)} style={{ borderColor: "#ec4899", color: "#ec4899" }}>528 Hz</button>
              </div>
            </div>
          </div>

          {/* Subsystem 3: The Empyrean Loom */}
          <div className="hud-panel virtues-calibrator" style={{ background: "rgba(0,0,0,0.3)", padding: "15px" }}>
            <h3 style={{ color: "#f59e0b" }}>The Empyrean Loom</h3>
            <p className="virtues-description" style={{ margin: "5px 0 10px 0" }}>
              Weave Coordinates: Procedurally generate new metaphysical structures.
            </p>
            <form onSubmit={weaveRealm} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Realm Suffix (e.g. Dome, Sanctum)"
                  value={domainSuffix}
                  onChange={(e) => setDomainSuffix(e.target.value)}
                  style={{
                    flex: 1,
                    background: "#0c0702",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    outline: "none"
                  }}
                />
                <select
                  value={activeLaw}
                  onChange={(e) => setActiveLaw(e.target.value)}
                  style={{
                    background: "#0c0702",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: "4px",
                    padding: "5px",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    outline: "none"
                  }}
                >
                  <option value="Prophetic Causality">Prophetic Causality</option>
                  <option value="Harmonic Inversion">Harmonic Inversion</option>
                  <option value="Identity Gravity">Identity Gravity</option>
                </select>
              </div>
              <button
                type="submit"
                className="virtue-calibrate-btn"
                style={{
                  alignSelf: "flex-end",
                  background: "rgba(245, 158, 11, 0.08)",
                  borderColor: "#f59e0b",
                  color: "#f59e0b"
                }}
              >
                🧶 Weave New Layer
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Control Actions Panel */}
      <footer className="ladder-controls-bar">
        <Button variant="primary" onClick={() => go("origin")} style={{
          background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)",
          borderColor: "#ffffff",
          color: "#000000",
          fontWeight: "bold",
          boxShadow: "0 0 20px rgba(255,255,255,0.4)"
        }}>
          ☯️ Enter The Origin Point
        </Button>
        <Button variant="secondary" onClick={() => go("temple")} style={{
          borderColor: "rgba(245, 158, 11, 0.3)",
          color: "#f59e0b",
          fontWeight: "bold",
          background: "rgba(245, 158, 11, 0.05)"
        }}>
          🏛️ Return to Temple Map Overworld
        </Button>
      </footer>
    </div>
  );
}
