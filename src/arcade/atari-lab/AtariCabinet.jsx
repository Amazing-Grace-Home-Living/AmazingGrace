import React, { useEffect, useRef, useState } from "react";

// Web Audio API Retro Sound Effects
function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "laser" || type === "shoot") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "bounce" || type === "hit") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "brick" || type === "invader_hit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "fail" || type === "gameover") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "success" || type === "win") {
      osc.type = "sine";
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.1, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.22);
      });
    }
  } catch (e) {
    console.warn("Audio Context playback blocked:", e);
  }
}

export default function AtariCabinet({ gameType, onClose }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState("START"); // START, PLAYING, GAMEOVER, WIN
  const [logs, setLogs] = useState([]);
  const keysPressed = useRef({});

  // Local storage high score management
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`atari_high_${gameType}`) || "0";
      setHighScore(parseInt(stored, 10));
    } catch {}
  }, [gameType]);

  const pushLog = (text) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 15)]);
  };

  const updateHighScore = (newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem(`atari_high_${gameType}`, String(newScore));
      } catch {}
      pushLog("🏆 NEW HIGH CLEARANCE SCRAMBLE METRIC RECORDED!");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Classic arcade size
    canvas.width = 600;
    canvas.height = 400;

    // Key event listeners
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      // Prevent browser scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === " " && gameState === "START") {
        setGameState("PLAYING");
        playSound("success");
        pushLog("🏁 SIMULATION ACTIVE. COGNITIVE BUFFER FLUSHED.");
      }
      if (e.key === " " && gameState === "GAMEOVER") {
        setGameState("PLAYING");
        setScore(0);
        playSound("success");
        pushLog("🏁 SIMULATION REINITIALIZED.");
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Initial Logs
    if (gameType === "pong") {
      pushLog("⚡ Pong Sandbox Attuned. Testing identity drift vectors.");
    } else if (gameType === "breakout") {
      pushLog("🧱 Breakout Core Synced. Layered barrier analysis active.");
    } else if (gameType === "space_invaders") {
      pushLog("👾 Space Invaders Labyrinth online. Invader grid calibrated.");
    }

    // ────────────────────────────────────────────────────────
    // GAME ENGINE MODELS
    // ────────────────────────────────────────────────────────

    // 1. PONG ENGINE
    let pongBall = { x: 300, y: 200, dx: 3.5, dy: 2.5, radius: 6 };
    let pongPlayer = { y: 160, width: 10, height: 80, speed: 6 };
    let pongAI = { y: 160, width: 10, height: 80, speed: 3.2 };

    const resetPongBall = (direction) => {
      pongBall.x = 300;
      pongBall.y = 200;
      pongBall.dx = direction * 3.5;
      pongBall.dy = (Math.random() - 0.5) * 4;
    };

    const runPong = () => {
      // Clear Screen
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Center Line
      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.setLineDash([10, 10]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Paddles
      ctx.fillStyle = "#10b981";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#10b981";
      // Player (Left)
      ctx.fillRect(20, pongPlayer.y, pongPlayer.width, pongPlayer.height);
      // AI (Right)
      ctx.fillRect(canvas.width - 20 - pongAI.width, pongAI.y, pongAI.width, pongAI.height);

      // Draw Ball
      ctx.beginPath();
      ctx.arc(pongBall.x, pongBall.y, pongBall.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#34d399";
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      if (gameState === "PLAYING") {
        // Player Control
        if (keysPressed.current["ArrowUp"] || keysPressed.current["w"] || keysPressed.current["W"]) {
          pongPlayer.y = Math.max(10, pongPlayer.y - pongPlayer.speed);
        }
        if (keysPressed.current["ArrowDown"] || keysPressed.current["s"] || keysPressed.current["S"]) {
          pongPlayer.y = Math.min(canvas.height - 10 - pongPlayer.height, pongPlayer.y + pongPlayer.speed);
        }

        // AI Control (Simple tracking)
        const targetY = pongBall.y - pongAI.height / 2;
        if (pongAI.y < targetY) {
          pongAI.y = Math.min(canvas.height - 10 - pongAI.height, pongAI.y + pongAI.speed);
        } else if (pongAI.y > targetY) {
          pongAI.y = Math.max(10, pongAI.y - pongAI.speed);
        }

        // Ball Physics
        pongBall.x += pongBall.dx;
        pongBall.y += pongBall.dy;

        // Top/Bottom bounce
        if (pongBall.y - pongBall.radius <= 0 || pongBall.y + pongBall.radius >= canvas.height) {
          pongBall.dy = -pongBall.dy;
          playSound("bounce");
        }

        // Paddle Collision: Left (Player)
        if (pongBall.dx < 0 &&
            pongBall.x - pongBall.radius <= 30 &&
            pongBall.x - pongBall.radius >= 20 &&
            pongBall.y >= pongPlayer.y &&
            pongBall.y <= pongPlayer.y + pongPlayer.height) {
          pongBall.dx = -pongBall.dx * 1.05; // Slightly speed up
          // Calculate spin angle depending on hit location
          const relativeHit = (pongBall.y - (pongPlayer.y + pongPlayer.height / 2)) / (pongPlayer.height / 2);
          pongBall.dy = relativeHit * 4;
          playSound("hit");
          setScore((s) => {
            const ns = s + 10;
            updateHighScore(ns);
            if (ns % 50 === 0) {
              pushLog(`📈 STRESS FREQUENCY MULTIPLIER: ${ns / 50 + 1}x`);
            }
            return ns;
          });
        }

        // Paddle Collision: Right (AI)
        if (pongBall.dx > 0 &&
            pongBall.x + pongBall.radius >= canvas.width - 30 &&
            pongBall.x + pongBall.radius <= canvas.width - 20 &&
            pongBall.y >= pongAI.y &&
            pongBall.y <= pongAI.y + pongAI.height) {
          pongBall.dx = -pongBall.dx * 1.05;
          const relativeHit = (pongBall.y - (pongAI.y + pongAI.height / 2)) / (pongAI.height / 2);
          pongBall.dy = relativeHit * 4;
          playSound("bounce");
          pushLog("[Reactor Telemetry] AI paddle resonance aligned.");
        }

        // Scoring Boundaries
        if (pongBall.x < 0) {
          // AI scores, player loss
          playSound("fail");
          setGameState("GAMEOVER");
          pushLog("❌ SIMULATION SOFT LOCK: Target node drifted out of alignment.");
        } else if (pongBall.x > canvas.width) {
          // Player scores!
          playSound("success");
          setScore((s) => {
            const ns = s + 50;
            updateHighScore(ns);
            return ns;
          });
          resetPongBall(-1);
          pushLog("🏆 PROTOCAL NODE RESOLVED! AI matrix collapsed.");
        }
      } else {
        drawStartOverlay("🏓 PONG PROTO-SIMULATOR", "CONTROL PADDLE WITH UP/DOWN OR W/S");
      }
    };

    // 2. BREAKOUT ENGINE
    let breakoutPaddle = { x: 260, y: 370, width: 80, height: 10, speed: 7 };
    let breakoutBall = { x: 300, y: 300, dx: 3.5, dy: -3.5, radius: 6 };
    let bricks = [];
    const cols = 8;
    const rows = 4;
    const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

    const initBricks = () => {
      bricks = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({
            x: 40 + c * 65,
            y: 40 + r * 22,
            width: 55,
            height: 14,
            active: true,
            color: colors[r % colors.length]
          });
        }
      }
    };
    initBricks();

    const runBreakout = () => {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Paddle
      ctx.fillStyle = "#f59e0b";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#f59e0b";
      ctx.fillRect(breakoutPaddle.x, breakoutPaddle.y, breakoutPaddle.width, breakoutPaddle.height);

      // Draw Bricks
      bricks.forEach((b) => {
        if (!b.active) return;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });
      ctx.shadowBlur = 0; // Reset

      // Draw Ball
      ctx.beginPath();
      ctx.arc(breakoutBall.x, breakoutBall.y, breakoutBall.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      if (gameState === "PLAYING") {
        // Controls
        if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"] || keysPressed.current["A"]) {
          breakoutPaddle.x = Math.max(10, breakoutPaddle.x - breakoutPaddle.speed);
        }
        if (keysPressed.current["ArrowRight"] || keysPressed.current["d"] || keysPressed.current["D"]) {
          breakoutPaddle.x = Math.min(canvas.width - 10 - breakoutPaddle.width, breakoutPaddle.x + breakoutPaddle.speed);
        }

        // Ball physics
        breakoutBall.x += breakoutBall.dx;
        breakoutBall.y += breakoutBall.dy;

        // Sides bounce
        if (breakoutBall.x - breakoutBall.radius <= 0 || breakoutBall.x + breakoutBall.radius >= canvas.width) {
          breakoutBall.dx = -breakoutBall.dx;
          playSound("bounce");
        }
        // Top bounce
        if (breakoutBall.y - breakoutBall.radius <= 0) {
          breakoutBall.dy = -breakoutBall.dy;
          playSound("bounce");
        }

        // Bottom check
        if (breakoutBall.y + breakoutBall.radius >= canvas.height) {
          playSound("fail");
          setGameState("GAMEOVER");
          pushLog("❌ STRESS ANOMALY: Paddle failed to sustain spatial matrix.");
        }

        // Paddle hit
        if (breakoutBall.dy > 0 &&
            breakoutBall.y + breakoutBall.radius >= breakoutPaddle.y &&
            breakoutBall.y - breakoutBall.radius <= breakoutPaddle.y + breakoutPaddle.height &&
            breakoutBall.x >= breakoutPaddle.x &&
            breakoutBall.x <= breakoutPaddle.x + breakoutPaddle.width) {
          breakoutBall.dy = -breakoutBall.dx > 0 ? -4 : -3.5;
          // Angled bounce
          const hitPos = (breakoutBall.x - (breakoutPaddle.x + breakoutPaddle.width / 2)) / (breakoutPaddle.width / 2);
          breakoutBall.dx = hitPos * 5;
          playSound("hit");
        }

        // Brick collision
        let remainingBricks = 0;
        bricks.forEach((b) => {
          if (!b.active) return;
          remainingBricks++;

          // AABB collision check
          if (breakoutBall.x + breakoutBall.radius >= b.x &&
              breakoutBall.x - breakoutBall.radius <= b.x + b.width &&
              breakoutBall.y + breakoutBall.radius >= b.y &&
              breakoutBall.y - breakoutBall.radius <= b.y + b.height) {
            b.active = false;
            breakoutBall.dy = -breakoutBall.dy;
            playSound("brick");
            setScore((s) => {
              const ns = s + 20;
              updateHighScore(ns);
              return ns;
            });
            pushLog(`🧱 Dissipated block node at coordinate [x: ${b.x}, y: ${b.y}].`);
          }
        });

        // Clear room logic
        if (remainingBricks === 0) {
          playSound("win");
          initBricks();
          breakoutBall.x = 300;
          breakoutBall.y = 300;
          breakoutBall.dx = 4;
          breakoutBall.dy = -4;
          pushLog("🏆 FULL MATRIX DECRYPTED! Regenerating tougher stress grid.");
        }
      } else {
        drawStartOverlay("🧱 BREAKOUT STRESS TEST", "MOVE WITH LEFT/RIGHT OR A/D KEYS");
      }
    };

    // 3. SPACE INVADERS ENGINE
    let invaderShip = { x: 280, y: 360, width: 30, height: 16, speed: 6 };
    let playerBullets = [];
    let enemyBullets = [];
    let invaders = [];
    let invaderDirection = 1;
    let invaderMoveTimer = 0;
    let bunkers = [
      { x: 120, y: 310, hp: 4 },
      { x: 280, y: 310, hp: 4 },
      { x: 440, y: 310, hp: 4 }
    ];

    const initInvaders = () => {
      invaders = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
          invaders.push({
            x: 80 + c * 60,
            y: 40 + r * 35,
            width: 25,
            height: 18,
            active: true
          });
        }
      }
    };
    initInvaders();

    const runSpaceInvaders = () => {
      ctx.fillStyle = "#02020a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Ship
      ctx.fillStyle = "#ef4444";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#ef4444";
      ctx.fillRect(invaderShip.x, invaderShip.y, invaderShip.width, invaderShip.height);

      // Draw Invaders
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      invaders.forEach((inv) => {
        if (!inv.active) return;
        ctx.fillRect(inv.x, inv.y, inv.width, inv.height);
        
        // Draw alien antennae (gorgeous micro-pixels)
        ctx.fillRect(inv.x + 4, inv.y - 3, 2, 3);
        ctx.fillRect(inv.x + inv.width - 6, inv.y - 3, 2, 3);
      });

      // Draw Bunkers (Shield walls)
      bunkers.forEach((bun) => {
        if (bun.hp <= 0) return;
        ctx.fillStyle = `rgba(16, 185, 129, ${bun.hp * 0.25})`;
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 6;
        ctx.fillRect(bun.x, bun.y, 40, 15);
      });
      ctx.shadowBlur = 0; // Reset

      // Draw Bullets (Player)
      ctx.fillStyle = "#fbbf24";
      playerBullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, 2, 8);
      });

      // Draw Bullets (Enemy)
      ctx.fillStyle = "#f43f5e";
      enemyBullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, 3, 7);
      });

      if (gameState === "PLAYING") {
        // Controls
        if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"] || keysPressed.current["A"]) {
          invaderShip.x = Math.max(10, invaderShip.x - invaderShip.speed);
        }
        if (keysPressed.current["ArrowRight"] || keysPressed.current["d"] || keysPressed.current["D"]) {
          invaderShip.x = Math.min(canvas.width - 10 - invaderShip.width, invaderShip.x + invaderShip.speed);
        }

        // Fire player bullet
        if (keysPressed.current[" "] && playerBullets.length < 3) {
          keysPressed.current[" "] = false; // Require tap
          playerBullets.push({ x: invaderShip.x + invaderShip.width / 2 - 1, y: invaderShip.y - 8 });
          playSound("shoot");
        }

        // Player bullet movement & collisions
        playerBullets.forEach((bullet, bIdx) => {
          bullet.y -= 5;
          if (bullet.y < 0) {
            playerBullets.splice(bIdx, 1);
            return;
          }

          // Bunker hit
          bunkers.forEach((bun) => {
            if (bun.hp <= 0) return;
            if (bullet.x >= bun.x && bullet.x <= bun.x + 40 && bullet.y >= bun.y && bullet.y <= bun.y + 15) {
              playerBullets.splice(bIdx, 1);
              bun.hp = Math.max(0, bun.hp - 1);
              playSound("bounce");
            }
          });

          // Invader hit
          invaders.forEach((inv) => {
            if (!inv.active) return;
            if (bullet.x >= inv.x && bullet.x <= inv.x + inv.width && bullet.y >= inv.y && bullet.y <= inv.y + inv.height) {
              inv.active = false;
              playerBullets.splice(bIdx, 1);
              playSound("invader_hit");
              setScore((s) => {
                const ns = s + 30;
                updateHighScore(ns);
                return ns;
              });
              pushLog(`👾 Neutralized intruder coordinate array node.`);
            }
          });
        });

        // Invader movement logic (grid sweeps)
        invaderMoveTimer++;
        if (invaderMoveTimer > 40) {
          invaderMoveTimer = 0;
          let hitEdge = false;

          invaders.forEach((inv) => {
            if (!inv.active) return;
            inv.x += 12 * invaderDirection;
            if (inv.x <= 15 || inv.x + inv.width >= canvas.width - 15) {
              hitEdge = true;
            }
          });

          if (hitEdge) {
            invaderDirection = -invaderDirection;
            invaders.forEach((inv) => {
              if (!inv.active) return;
              inv.y += 15;
              if (inv.y + inv.height >= invaderShip.y) {
                // Invaders reached player base
                playSound("gameover");
                setGameState("GAMEOVER");
                pushLog("❌ SECURE BASE BRUSHED: Alien invaders breached core reactor matrix!");
              }
            });
          }

          // Random enemy fire
          const activeInvaders = invaders.filter((inv) => inv.active);
          if (activeInvaders.length > 0 && Math.random() < 0.35) {
            const shooter = activeInvaders[Math.floor(Math.random() * activeInvaders.length)];
            enemyBullets.push({ x: shooter.x + shooter.width / 2, y: shooter.y + shooter.height });
          }
        }

        // Enemy bullets movement
        enemyBullets.forEach((ebullet, eIdx) => {
          ebullet.y += 3.5;
          if (ebullet.y > canvas.height) {
            enemyBullets.splice(eIdx, 1);
            return;
          }

          // Bunker collision
          bunkers.forEach((bun) => {
            if (bun.hp <= 0) return;
            if (ebullet.x >= bun.x && ebullet.x <= bun.x + 40 && ebullet.y >= bun.y && ebullet.y <= bun.y + 15) {
              enemyBullets.splice(eIdx, 1);
              bun.hp = Math.max(0, bun.hp - 1);
              playSound("bounce");
            }
          });

          // Player hit check
          if (ebullet.x >= invaderShip.x && ebullet.x <= invaderShip.x + invaderShip.width &&
              ebullet.y >= invaderShip.y && ebullet.y <= invaderShip.y + invaderShip.height) {
            playSound("fail");
            setGameState("GAMEOVER");
            pushLog("❌ VESSEL COLLAPSED: Host node vaporized by digital laser sweep.");
          }
        });

        // Wiped check
        if (invaders.filter((inv) => inv.active).length === 0) {
          playSound("win");
          initInvaders();
          enemyBullets = [];
          playerBullets = [];
          bunkers = bunkers.map((b) => ({ ...b, hp: 4 }));
          pushLog("🏆 FULL SECTOR PURGED! Initiating secondary sector threats.");
        }
      } else {
        drawStartOverlay("👾 SPACE INVADERS LABYRINTH", "MOVE: LEFT/RIGHT OR A/D KEYS. FIRE: SPACEBAR");
      }
    };

    // Helper: Render static overlay
    const drawStartOverlay = (title, controlText) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 30);

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "14px 'Share Tech Mono', monospace";
      ctx.fillText(controlText, canvas.width / 2, canvas.height / 2 + 10);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 15px 'Share Tech Mono', monospace";
      ctx.fillText("TAP SPACEBAR TO INITIATE CALIBRATION CYCLE", canvas.width / 2, canvas.height / 2 + 50);
    };

    // Dynamic engine switcher loop
    const frame = () => {
      if (gameType === "pong") runPong();
      else if (gameType === "breakout") runBreakout();
      else if (gameType === "space_invaders") runSpaceInvaders();

      animationFrameId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameType, gameState]);

  const headingText = gameType === "pong" ? "🏓 PONG PROTO-NODE" : (gameType === "breakout" ? "🧱 BREAKOUT STRESS TEST" : "👾 INVADERS LABYRINTH");

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Title / Telemetry stats */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "1rem",
        marginBottom: "1.5rem"
      }}>
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          color: "#fff",
          fontSize: "1.5rem",
          margin: 0,
          letterSpacing: "0.05em"
        }}>
          {headingText}
        </h2>

        <div style={{ display: "flex", gap: "1.5rem", fontFamily: "'Share Tech Mono', monospace" }}>
          <div>
            <span style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}>CURRENT METRIC</span>
            <span style={{ fontSize: "1.25rem", color: "#10b981", fontWeight: "bold" }}>{score} PTS</span>
          </div>
          <div>
            <span style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}>RECORD CLEARANCE</span>
            <span style={{ fontSize: "1.25rem", color: "#f59e0b", fontWeight: "bold" }}>{highScore} PTS</span>
          </div>
        </div>
      </div>

      {/* Retro Arcade Screen Bezel */}
      <div style={{
        background: "linear-gradient(to bottom, #111827 0%, #030712 100%)",
        border: "12px solid #1e293b",
        borderRadius: "20px",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)",
        padding: "8px",
        maxWidth: "600px",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{
          border: "4px solid #0f172a",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative"
        }}>
          <canvas 
            ref={canvasRef} 
            style={{ 
              display: "block", 
              width: "100%", 
              aspectRatio: "3/2",
              background: "#030712"
            }} 
          />
        </div>
      </div>

      {/* Mini Controls Helper for mobile / keypad */}
      <div style={{
        display: "flex",
        gap: "1rem",
        marginTop: "1.5rem",
        width: "100%",
        justifyContent: "center"
      }}>
        <button 
          onClick={() => {
            setGameState("PLAYING");
            setScore(0);
            playSound("success");
            pushLog("🏁 SIMULATION MANUALLY FORCED RESTART.");
          }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        >
          🔄 RESET CORE SIM
        </button>
        
        <button 
          onClick={() => {
            if (gameState === "PLAYING") {
              setGameState("START");
              pushLog("⏸️ COGNITIVE SIMULATION SUSPENDED.");
            } else {
              setGameState("PLAYING");
              pushLog("▶️ COGNITIVE SIMULATION RESUMED.");
            }
          }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        >
          {gameState === "PLAYING" ? "⏸️ PAUSE ENGINE" : "▶️ RUN ENGINE"}
        </button>
      </div>

      {/* Silicon Sandbox Diagnostics Stream Output */}
      <div style={{
        marginTop: "1.5rem",
        width: "100%",
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: "8px",
        padding: "1rem",
        boxSizing: "border-box"
      }}>
        <div style={{
          fontSize: "0.75rem",
          color: "#475569",
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          paddingBottom: "0.25rem",
          marginBottom: "0.5rem",
          letterSpacing: "0.1em"
        }}>
          📟 CORE DIAGNOSTICS STREAM
        </div>

        <div style={{
          height: "90px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "0.75rem",
          lineHeight: "1.5",
          color: "#94a3b8",
          display: "flex",
          flexDirection: "column",
          gap: "2px"
        }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{
              color: log.includes("❌") ? "#ef4444" : (log.includes("🏆") ? "#fbbf24" : (log.includes("🏁") ? "#10b981" : "#94a3b8"))
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
