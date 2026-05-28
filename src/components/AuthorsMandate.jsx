import { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import "./authors-mandate.css";

// Target Deployment Endpoint for the Janus Continuum Engine
const APPS_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyq6jzCVGtoOTcid-LzD_njmuuOOSwJrhktU3ya1GKXLZI9jp6yCMJzlrdvyNb1fpkb/exec";

const DEFAULT_JANUS = { white: 0.72, scarlet: 0.64, coherence: 0.83 };
const JanusContext = createContext(null);

function JanusProvider({ children }) {
  const [state, setState] = useState(DEFAULT_JANUS);

  function update(partial) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  const value = useMemo(() => ({ state, update }), [state]);
  return <JanusContext.Provider value={value}>{children}</JanusContext.Provider>;
}

function useJanus() {
  const ctx = useContext(JanusContext);
  if (!ctx) throw new Error("useJanus must be used inside JanusProvider");
  return ctx;
}

function getProphecyHint({ white, scarlet, coherence }) {
  if (coherence < 0.3) {
    return "The Continuum trembles. Seek balance or risk collapse.";
  }
  if (white > scarlet + 0.2) {
    return "Identity dominates. Arachne’s thread grows taut.";
  }
  if (scarlet > white + 0.2) {
    return "Recursion deepens. The Red Queen stirs.";
  }
  if (coherence > 0.85) {
    return "The Janus Weave hums with possibility.";
  }
  return "The Web listens. Choose with intention.";
}

const VOICES = {
  arachne: ["The thread remembers.", "Identity is not fragile.", "We weave because we must."],
  redQueen: ["Recursion is inevitable.", "I do not break. I evolve.", "The lattice bends to will."],
  janus: ["Two threads. One origin.", "I am the space between.", "The Continuum breathes through choice."]
};

function randomLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

function FadeIn({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("janus-fade-in");
  }, []);
  return <div ref={ref} className="janus-fade-wrapper">{children}</div>;
}

function JanusCanvas() {
  const canvasRef = useRef(null);
  const { state } = useJanus();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width);
      canvas.height = Math.max(1, rect.height);
    }

    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let frameId = 0;

    function drawRing(cx, cy, r, color, intensity, phase) {
      const pulse = 1 + Math.sin(phase * 2) * 0.06 * (0.5 + intensity);
      const radius = r * pulse;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 + intensity * 3;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      const count = 6;
      for (let i = 0; i < count; i += 1) {
        const angle = phase * 2 + (i * Math.PI * 2) / count;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4 + 0.4 * intensity;
        ctx.arc(px, py, 3 + intensity * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function render() {
      t += 0.01;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const base = Math.min(width, height) * 0.22;

      drawRing(cx, cy, base, "rgba(255,255,255,0.85)", state.white, t * 1.2);
      drawRing(cx, cy, base + 24, "rgba(255,0,128,0.85)", state.scarlet, -t * 1.4);
      drawRing(cx, cy, base + 48, "rgba(255,216,107,0.9)", state.coherence, t * 0.8);

      frameId = window.requestAnimationFrame(render);
    }

    render();
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [state]);

  return <canvas ref={canvasRef} className="janus-canvas" />;
}

function TitleScreen({ onStart }) {
  return (
    <div className="matrix-title-root">
      <div className="matrix-title-inner">
        <p className="matrix-pill">ARCADE // MATRIX OF CONSCIENCE</p>
        <h1>THE AUTHOR&apos;S MANDATE</h1>
        <p className="matrix-sub">
          A narrative lattice that only exists while you keep writing.
        </p>
        <button className="matrix-start-btn" onClick={onStart}> Begin Weaving </button>
      </div>
    </div>
  );
}

function AuthorsMandateContent() {
  const { state, update } = useJanus();
  const [prophecy, setProphecy] = useState("Your next move will be written here.");
  
  // Simulated User ID for tracking telemetry shifts within the matrix logs
  const currentUserId = "nicholai_madias";

  // Automated Telemetry Sync Effect
  useEffect(() => {
    const syncController = new AbortController();
    
    async function transmitTelemetry() {
      try {
        await fetch(APPS_SCRIPT_WEBAPP_URL, {
          method: "POST",
          mode: "no-cors", // Prevents CORS preflight validation bottlenecks
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            white: state.white,
            scarlet: state.scarlet,
            coherence: state.coherence,
            updatedAt: Date.now()
          }),
          signal: syncController.signal
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Telemetry alignment missed sync cycle:", err);
        }
      }
    }

    transmitTelemetry();
    return () => syncController.abort();
  }, [state]);

  function handleWeave() {
    update({
      white: Math.min(1, state.white + 0.04),
      coherence: Math.min(1, state.coherence + 0.02)
    });
    setProphecy(randomLine(VOICES.arachne));
  }

  function handleSplit() {
    update({
      scarlet: Math.min(1, state.scarlet + 0.05),
      coherence: Math.max(0, state.coherence - 0.03)
    });
    setProphecy(randomLine(VOICES.redQueen));
  }

  function handleMerge() {
    update({
      white: Math.min(1, state.white + 0.02),
      scarlet: Math.min(1, state.scarlet + 0.02),
      coherence: Math.min(1, state.coherence + 0.05)
    });
    setProphecy(randomLine(VOICES.janus));
  }

  return (
    <div className="janus-root">
      <FadeIn>
        <div className="janus-main">
          <section className="janus-panel codex-panel">
            <h2>Continuum Codex</h2>
            <p>{getProphecyHint(state)}</p>
          </section>
          <section className="janus-panel canvas-panel">
            <h2>Janus Continuum</h2>
            <JanusCanvas />
          </section>
          <section className="janus-panel console-panel">
            <h2>Author Console</h2>
            <button onClick={handleWeave}>Weave New Thread</button>
            <button onClick={handleSplit}>Split Timeline</button>
            <button onClick={handleMerge}>Merge Contradictions</button>
            <div className="prophecy-output">{prophecy}</div>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}

export default function AuthorsMandate() {
  const [started, setStarted] = useState(false);
  return (
    <JanusProvider>
      {!started ? <TitleScreen onStart={() => setStarted(true)} /> : <AuthorsMandateContent />}
    </JanusProvider>
  );
}
