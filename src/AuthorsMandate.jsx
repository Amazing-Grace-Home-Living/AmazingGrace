import { useEffect, useRef, useState, createContext, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../../firebase"; // adjust if needed
import "./authors-mandate.css";

/* -------------------------------------------------------
   1. FIREBASE ADAPTER
------------------------------------------------------- */
const db = getFirestore(app);

const DEFAULT_JANUS = {
  white: 0.72,
  scarlet: 0.64,
  coherence: 0.83
};

async function loadJanusState(userId) {
  const ref = doc(db, "janusStates", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...DEFAULT_JANUS, updatedAt: Date.now() });
    return DEFAULT_JANUS;
  }
  const d = snap.data();
  return {
    white: d.white ?? DEFAULT_JANUS.white,
    scarlet: d.scarlet ?? DEFAULT_JANUS.scarlet,
    coherence: d.coherence ?? DEFAULT_JANUS.coherence
  };
}

async function saveJanusState(userId, state) {
  const ref = doc(db, "janusStates", userId);
  await setDoc(ref, { ...state, updatedAt: Date.now() }, { merge: true });
}

/* -------------------------------------------------------
   2. REACT CONTEXT STORE
------------------------------------------------------- */
const JanusContext = createContext(null);

function JanusProvider({ children, userId = "anonymous" }) {
  const [state, setState] = useState(DEFAULT_JANUS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const data = await loadJanusState(userId);
      if (!cancel) {
        setState(data);
        setLoaded(true);
      }
    })();
    return () => (cancel = true);
  }, [userId]);

  function update(partial) {
    setState((prev) => {
      const next = { ...prev, ...partial };
      saveJanusState(userId, next);
      return next;
    });
  }

  return (
    <JanusContext.Provider value={{ state, update, loaded }}>
      {children}
    </JanusContext.Provider>
  );
}

function useJanus() {
  const ctx = useContext(JanusContext);
  if (!ctx) throw new Error("useJanus must be inside JanusProvider");
  return ctx;
}

/* -------------------------------------------------------
   3. VOICE-LINE SYSTEM
------------------------------------------------------- */
const VOICES = {
  arachne: [
    "The thread remembers.",
    "Identity is not fragile.",
    "We weave because we must."
  ],
  redQueen: [
    "Recursion is inevitable.",
    "I do not break. I evolve.",
    "The lattice bends to will."
  ],
  janus: [
    "Two threads. One origin.",
    "I am the space between.",
    "The Continuum breathes through choice."
  ]
};

function playVoice(character, setProphecy) {
  const lines = VOICES[character];
  const line = lines[Math.floor(Math.random() * lines.length)];
  setProphecy(line);
}

/* -------------------------------------------------------
   4. PROPHECY HINT SYSTEM
------------------------------------------------------- */
function getProphecyHint({ white, scarlet, coherence }) {
  if (coherence < 0.3)
    return "The Continuum trembles. Seek balance or risk collapse.";
  if (white > scarlet + 0.2)
    return "Identity dominates. Arachne’s thread grows taut.";
  if (scarlet > white + 0.2)
    return "Recursion deepens. The Red Queen stirs.";
  if (coherence > 0.85)
    return "The Janus Weave hums with possibility.";
  return "The Web listens. Choose with intention.";
}

/* -------------------------------------------------------
   5. SOUNDTRACK SYSTEM
------------------------------------------------------- */
function JanusSoundtrack({ playing }) {
  const ref = useRef(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0;

    let fade;

    async function fadeIn() {
      try {
        await audio.play();
      } catch {}
      let v = 0;
      fade = setInterval(() => {
        v += 0.02;
        audio.volume = Math.min(0.4, v);
        if (v >= 0.4) clearInterval(fade);
      }, 120);
    }

    function fadeOut() {
      let v = audio.volume;
      fade = setInterval(() => {
        v -= 0.02;
        audio.volume = Math.max(0, v);
        if (v <= 0) {
          clearInterval(fade);
          audio.pause();
        }
      }, 120);
    }

    playing ? fadeIn() : fadeOut();

    return () => clearInterval(fade);
  }, [playing]);

  return <audio ref={ref} src="/audio/janus-continuum-ambient.mp3" />;
}

/* -------------------------------------------------------
   6. CINEMATIC FADE-IN WRAPPER
------------------------------------------------------- */
function FadeIn({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.classList.add("janus-fade-in");
  }, []);
  return <div ref={ref} className="janus-fade-wrapper">{children}</div>;
}

/* -------------------------------------------------------
   7. JANUS CANVAS 2.0
------------------------------------------------------- */
function JanusCanvas2() {
  const canvasRef = useRef(null);
  const { state } = useJanus();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let frame;

    function drawRing(cx, cy, r, color, intensity, phase) {
      const pulse = 1 + Math.sin(phase * 2) * 0.06 * (0.5 + intensity);
      const radius = r * pulse;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 + intensity * 3;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      const count = 6;
      for (let i = 0; i < count; i++) {
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

      const { white, scarlet, coherence } = state;

      drawRing(cx, cy, base, "rgba(255,255,255,0.85)", white, t * 1.2);
      drawRing(cx, cy, base + 24, "rgba(255,0,128,0.85)", scarlet, -t * 1.4);
      drawRing(cx, cy, base + 48, "rgba(255,216,107,0.9)", coherence, t * 0.8);

      frame = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [state]);

  return <canvas ref={canvasRef} className="janus-canvas" />;
}

/* -------------------------------------------------------
   8. TITLE SCREEN
------------------------------------------------------- */
function TitleScreen({ onStart }) {
  return (
    <div className="matrix-title-root">
      <div className="matrix-title-inner">
        <p className="matrix-pill">ARCADE // MATRIX OF CONSCIENCE</p>
        <h1>THE AUTHOR'S MANDATE</h1>
        <p className="matrix-sub">
          A narrative lattice that only exists while you keep writing.
        </p>
        <button className="matrix-start-btn" onClick={onStart}>
          Begin Weaving
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   9. MAIN PAGE
------------------------------------------------------- */
export default function AuthorsMandate() {
  const [started, setStarted] = useState(false);
  const [prophecy, setProphecy] = useState("Your next move will be written here.");

  return (
    <JanusProvider>
      <JanusSoundtrack playing={started} />

      {!started && <TitleScreen onStart={() => setStarted(true)} />}

      {started && (
        <div className="janus-root">
          <FadeIn>
            <div className="janus-main">
              <div className="janus-panel codex-panel">
                <h2>Continuum Codex</h2>
                <p>{getProphecyHint(useJanus().state)}</p>
              </div>

              <div className="janus-panel canvas-panel">
                <JanusCanvas2 />
              </div>

              <div className="janus-panel console-panel">
                <h2>Author Console</h2>

                <button onClick={() => playVoice("arachne", setProphecy)}>
                  Weave New Thread
                </button>
                <button onClick={() => playVoice("redQueen", setProphecy)}>
                  Split Timeline
                </button>
                <button onClick={() => playVoice("janus", setProphecy)}>
                  Merge Contradictions
                </button>

                <div className="prophecy-output">{prophecy}</div>
              </div>
            </div>
          </FadeIn>
        </div>
      )}
    </JanusProvider>
  );
}
