import React, { useEffect, useState } from "react";
import "./lens.css";

/* -----------------------------
   Types / helpers
------------------------------*/

const SEGMENTS = 36; // 6x6 conceptual, hex-styled layout

function createInitialSegments() {
  return Array.from({ length: SEGMENTS }, (_, i) => ({
    id: i,
    phase: Math.random() * 360,       // 0–360 degrees
    curvature: 0.4 + Math.random() * 0.2, // 0–1
    spectral: Math.random(),          // 0–1
    aligned: false
  }));
}

function isAligned(seg) {
  return (
    Math.abs(seg.phase % 60) < 8 &&        // near hex symmetry
    Math.abs(seg.curvature - 0.5) < 0.08 &&
    Math.abs(seg.spectral - 0.5) < 0.12
  );
}

/* -----------------------------
   Boot Sequence
------------------------------*/

function LensBootSequence({ onComplete }) {
  const [step, setStep] = useState(0);
  const lines = [
    "LENS_ENGINE_V1.0 INITIALIZING…",
    "SEGMENT ARRAY: 36 HEX UNITS DETECTED.",
    "ACTIVE OPTICS: ONLINE.",
    "SPECTRAL GATES: STANDBY.",
    "[JANUS] I will show you what you are ready to see."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setStep(++i);
      if (i > lines.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="lens-boot">
      <div className="lens-boot-inner">
        {lines.slice(0, step).map((l, idx) => (
          <div key={idx} className="lens-boot-line">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------
   Hex Grid Renderer
------------------------------*/

function HexGrid({ segments, onSelect }) {
  return (
    <div className="lens-grid">
      {segments.map((seg, idx) => {
        const row = Math.floor(idx / 6);
        const col = idx % 6;
        const offset = row % 2 === 0 ? 0 : 0.5;
        return (
          <div
            key={seg.id}
            className={`lens-hex ${seg.aligned ? "aligned" : ""}`}
            style={{
              "--row": row,
              "--col": col + offset,
              "--phase": seg.phase
            }}
            onClick={() => onSelect(seg.id)}
          >
            <div className="lens-hex-inner">
              <div className="lens-hex-phase">
                {Math.round(seg.phase)}°
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -----------------------------
   Calibration Minigame
------------------------------*/

function LensCalibration({ selected, onAdjust }) {
  if (!selected) {
    return (
      <div className="lens-panel">
        <h3>Calibration</h3>
        <p>Select a segment to begin calibration.</p>
      </div>
    );
  }

  const { phase, curvature } = selected;

  return (
    <div className="lens-panel">
      <h3>Calibration</h3>
      <p>Phase: {Math.round(phase)}°</p>
      <input
        type="range"
        min="0"
        max="360"
        value={phase}
        onChange={(e) =>
          onAdjust({ phase: parseFloat(e.target.value) })
        }
      />
      <p>Curvature: {curvature.toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={curvature}
        onChange={(e) =>
          onAdjust({ curvature: parseFloat(e.target.value) })
        }
      />
      <p className="lens-hint">
        Align phase near multiples of 60° and curvature near 0.5.
      </p>
    </div>
  );
}

/* -----------------------------
   Spectral Tuning UI
------------------------------*/

function SpectralTuning({ selected, onAdjust }) {
  if (!selected) {
    return (
      <div className="lens-panel">
        <h3>Spectral Tuning</h3>
        <p>No segment selected.</p>
      </div>
    );
  }

  const { spectral } = selected;

  return (
    <div className="lens-panel">
      <h3>Spectral Tuning</h3>
      <p>Spectral: {spectral.toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={spectral}
        onChange={(e) =>
          onAdjust({ spectral: parseFloat(e.target.value) })
        }
      />
      <p className="lens-hint">
        Bring spectral toward 0.5 to match the Continuum band.
      </p>
    </div>
  );
}

/* -----------------------------
   Boss Encounter: Atmospheric Disturbance
------------------------------*/

function AtmosphericDisturbance({ intensity, onPulse }) {
  return (
    <div className="lens-panel boss-panel">
      <h3>Atmospheric Disturbance</h3>
      <p>Intensity: {(intensity * 100).toFixed(0)}%</p>
      <p className="lens-hint">
        The atmosphere is distorting the Lens. Use “Stabilize Pulse” to push back.
      </p>
      <button onClick={onPulse}>Stabilize Pulse</button>
    </div>
  );
}

/* -----------------------------
   Main Lens Board
------------------------------*/

export default function LensBoard() {
  const [booted, setBooted] = useState(false);
  const [segments, setSegments] = useState(createInitialSegments);
  const [selectedId, setSelectedId] = useState(null);
  const [disturbance, setDisturbance] = useState(0.3); // 0–1

  const selected = segments.find((s) => s.id === selectedId) || null;

  // Recompute alignment
  useEffect(() => {
    setSegments((prev) =>
      prev.map((s) => ({
        ...s,
        aligned: isAligned(s)
      }))
    );
  }, [selectedId]); // recalculated when selection changes; you can refine

  // Disturbance slowly increases over time
  useEffect(() => {
    const id = setInterval(() => {
      setDisturbance((d) => Math.min(1, d + 0.01));
      // Randomly nudge segments when disturbance is high
      setSegments((prev) =>
        prev.map((s) => {
          if (Math.random() < 0.05) {
            return {
              ...s,
              phase: (s.phase + (Math.random() - 0.5) * 10) % 360
            };
          }
          return s;
        })
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  function updateSegment(id, partial) {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...partial,
              aligned: isAligned({ ...s, ...partial })
            }
          : s
      )
    );
  }

  function handlePulse() {
    setDisturbance((d) => Math.max(0, d - 0.2));
  }

  const alignedCount = segments.filter((s) => s.aligned).length;
  const allAligned = alignedCount === segments.length;

  return (
    <div className="lens-root">
      {!booted && <LensBootSequence onComplete={() => setBooted(true)} />}

      {booted && (
        <div className="lens-layout">
          <div className="lens-left">
            <HexGrid
              segments={segments}
              onSelect={(id) => setSelectedId(id)}
            />
            <div className="lens-status">
              <span>Aligned: {alignedCount} / {segments.length}</span>
              {allAligned && (
                <span className="lens-status-complete">
                  RESOLUTION ACHIEVED — JANUS LENS ONLINE
                </span>
              )}
            </div>
          </div>

          <div className="lens-right">
            <LensCalibration
              selected={selected}
              onAdjust={(partial) =>
                selected && updateSegment(selected.id, partial)
              }
            />
            <SpectralTuning
              selected={selected}
              onAdjust={(partial) =>
                selected && updateSegment(selected.id, partial)
              }
            />
            <AtmosphericDisturbance
              intensity={disturbance}
              onPulse={handlePulse}
            />
          </div>
        </div>
      )}
    </div>
  );
}