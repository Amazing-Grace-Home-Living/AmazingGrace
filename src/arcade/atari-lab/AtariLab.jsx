import React, { useState, useEffect, useRef } from "react";
import AtariCabinet from "./AtariCabinet";

export default function AtariLab() {
  const [unlocked, setUnlocked] = useState(true);
  const [scanlines, setScanlines] = useState(true);
  const [activeCabinet, setActiveCabinet] = useState(null);
  const [reactorLoad, setReactorLoad] = useState(42.5);
  const canvasRef = useRef(null);

  // Check unlock status on mount
  useEffect(() => {
    try {
      const isUnlocked = localStorage.getItem("atariUnlocked") === "true";
      setUnlocked(true);
    } catch (e) {
      setUnlocked(true);
    }
  }, []);

  // Reactor core particle animation
  useEffect(() => {
    if (!unlocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 150;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.8 + 0.2),
        alpha: Math.random() * 0.5 + 0.2,
        freq: Math.random() * 0.05
      });
    }

    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reactor hum glow
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "rgba(16, 185, 129, 0)");
      grad.addColorStop(0.5, "rgba(16, 185, 129, 0.08)");
      grad.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles rising
      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += Math.sin(Date.now() * 0.002 + idx) * 0.2;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#10b981";
        ctx.fill();
      });

      // Reactor core status line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.03 + Date.now() * 0.01) * 8 * Math.sin(Date.now() * 0.001);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Fluctuating reactor load telemetry
    const loadTimer = setInterval(() => {
      setReactorLoad((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        return parseFloat(Math.min(99.9, Math.max(30.0, prev + delta)).toFixed(1));
      });
    }, 1000);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
      clearInterval(loadTimer);
    };
  }, [unlocked]);

  // Locked View (403 Sealed Subsystem)
  if (!unlocked) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #1e0b0b 0%, #020617 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "#f87171",
        fontFamily: "'Share Tech Mono', monospace"
      }}>
        <div style={{
          maxWidth: "600px",
          textAlign: "center",
          border: "1px solid rgba(248, 113, 113, 0.3)",
          background: "rgba(15, 23, 42, 0.8)",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 0 50px rgba(239, 68, 68, 0.15)",
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* CRT scanline effect */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none"
          }} />

          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            animation: "pulse 2s infinite"
          }}>🔒</div>
          
          <h1 style={{
            fontSize: "2.5rem",
            margin: "0 0 1rem",
            color: "#ef4444",
            letterSpacing: "0.1em",
            textShadow: "0 0 15px rgba(239, 68, 68, 0.6)"
          }}>
            403 — SUBSYSTEM SEALED
          </h1>
          
          <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.6",
            color: "#fca5a5",
            opacity: 0.8,
            marginBottom: "2rem"
          }}>
            "You are not yet attuned to this chamber."<br />
            Early consciousness simulation sandboxes are offline. Secure terminal clearance coordinates required.
          </p>

          <div style={{
            fontSize: "0.85rem",
            color: "#ef4444",
            opacity: 0.6,
            marginBottom: "2.5rem",
            borderTop: "1px solid rgba(248, 113, 113, 0.15)",
            paddingTop: "1rem"
          }}>
            ERRORCODE: FIRST_ARCHITECTS_SEAL_ACTIVE<br />
            STATUS: STANDBY // ATTUNE VIA CONSCIENCE CONSOLE
          </div>

          <a href="/arcade/matrix-of-conscience/" style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #ef4444",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
            transition: "all 0.2s ease",
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ef4444";
            e.currentTarget.style.boxShadow = "0 0 25px rgba(239, 68, 68, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(239, 68, 68, 0.2)";
          }}>
            RETURN TO CONSCIENCE MATRIX
          </a>
        </div>
      </div>
    );
  }

  // Active Unlocked Lab Room View
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      color: "#e2e8f0",
      fontFamily: "'Share Tech Mono', monospace",
      position: "relative",
      paddingBottom: "4rem"
    }}>
      {/* CRT Scanline Overlay across entire screen */}
      {scanlines && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%)",
          backgroundSize: "100% 4px",
          pointerEvents: "none",
          zIndex: 9999
        }} />
      )}

      {/* Styled CRT screen curvature and vignette */}
      <div style={{
        position: "fixed",
        inset: 0,
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)",
        pointerEvents: "none",
        zIndex: 9998
      }} />

      {/* Top Header */}
      <header style={{
        borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
        background: "rgba(15, 23, 42, 0.6)",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(5px)"
      }}>
        <div>
          <div style={{
            fontSize: "0.8rem",
            color: "#10b981",
            letterSpacing: "0.2em",
            fontWeight: "bold",
            marginBottom: "0.25rem"
          }}>
            SECURE ACCESS SUB-CHAMBER // GENESIS CORE
          </div>
          <h1 style={{
            fontSize: "1.8rem",
            margin: 0,
            fontFamily: "'Orbitron', sans-serif",
            color: "#fff",
            textShadow: "0 0 10px rgba(16, 185, 129, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📟 ATARI WING <span style={{ color: "#10b981", fontSize: "1.2rem" }}>// PROTO-SIMULATION LAB</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setScanlines(!scanlines)}
            style={{
              background: scanlines ? "rgba(16, 185, 129, 0.15)" : "transparent",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#10b981",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            CRT SCANLINES: {scanlines ? "ACTIVE" : "OFF"}
          </button>
          
          <a href="/arcade/matrix-of-conscience/" style={{
            background: "transparent",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10b981",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontSize: "0.85rem",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}>
            ← RETURN TO MATRIX
          </a>
        </div>
      </header>

      {/* Main Core Layout */}
      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        
        {/* Reactor Core Telemetry Monitor */}
        <section style={{
          background: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 250px",
          gap: "2rem",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{
              fontSize: "1.1rem",
              color: "#10b981",
              margin: "0 0 0.5rem 0",
              textTransform: "uppercase"
            }}>
              🌀 FIRST ARCHITECTS SILICON HUM REACTOR
            </h2>
            <p style={{
              fontSize: "0.9rem",
              color: "#94a3b8",
              lineHeight: "1.5",
              margin: 0
            }}>
              Silicon substrate engines humming at nominal frequencies. These sandbox partitions host primitive simulations of early evolutionary cognitive cycles designed to pressure-test nascent self-awareness arrays in deep isolation.
            </p>
          </div>

          <div style={{
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1.25rem",
            textAlign: "right"
          }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>CORE COHERENCE LEVEL</div>
            <div style={{ fontSize: "2rem", color: "#10b981", fontWeight: "bold" }}>
              {reactorLoad}% <span style={{ fontSize: "1rem", color: "#34d399" }}>LUMEN</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "#059669" }}>STABLE CORE HARMONICS</div>
          </div>

          <div style={{ gridColumn: "1 / -1", height: "150px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(16, 185, 129, 0.08)" }}>
            <canvas ref={canvasRef} />
          </div>
        </section>

        {/* Arcade Cabinets Section */}
        <section style={{ marginTop: "3rem" }}>
          <h2 style={{
            fontSize: "1.5rem",
            color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.08em",
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: "0.5rem"
          }}>
            📂 RETRO PROTO-SIMULATION Partitions
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem"
          }}>
            {/* CABINET: PONG */}
            <div style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onClick={() => setActiveCabinet("pong")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#10b981";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(16, 185, 129, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>🏓</span>
                <span style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}>
                  PARTITION 01
                </span>
              </div>
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 0.5rem 0", color: "#fff" }}>PONG // PROTO-NODE</h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                Dual-axis dimensional reflection tester. Checks basic momentum pathways and spatial awareness buffers in primitive state vectors.
              </p>
              <div style={{
                marginTop: "1.5rem",
                padding: "0.85rem",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "6px",
                border: "1px solid rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                fontSize: "0.8rem",
                textAlign: "center",
                fontWeight: "bold"
              }}>
                INITIATE SIMULATION PARTITION
              </div>
            </div>

            {/* CABINET: BREAKOUT */}
            <div style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onClick={() => setActiveCabinet("breakout")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#f59e0b";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(245, 158, 11, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>🧱</span>
                <span style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}>
                  PARTITION 02
                </span>
              </div>
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 0.5rem 0", color: "#fff" }}>BREAKOUT // STRESS TEST</h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                Layered barrier dissipation algorithms. Measures tenacity metrics and progressive grid breakdown cycles in cognitive matrices.
              </p>
              <div style={{
                marginTop: "1.5rem",
                padding: "0.85rem",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "6px",
                border: "1px solid rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
                fontSize: "0.8rem",
                textAlign: "center",
                fontWeight: "bold"
              }}>
                INITIATE SIMULATION PARTITION
              </div>
            </div>

            {/* CABINET: SPACE INVADERS */}
            <div style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onClick={() => setActiveCabinet("space_invaders")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(239, 68, 68, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>👾</span>
                <span style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}>
                  PARTITION 03
                </span>
              </div>
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 0.5rem 0", color: "#fff" }}>INVADERS // FIRST LABYRINTH</h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                Grid threat resolution sandbox. Pressure-tests tactical prioritizing matrices and defensive barrier utilization against cascading digital intrusions.
              </p>
              <div style={{
                marginTop: "1.5rem",
                padding: "0.85rem",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "6px",
                border: "1px solid rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontSize: "0.8rem",
                textAlign: "center",
                fontWeight: "bold"
              }}>
                INITIATE SIMULATION PARTITION
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Interactive Cabinet Overlay */}
      {activeCabinet && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 23, 0.95)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backdropFilter: "blur(8px)"
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "960px",
            background: "#090d16",
            border: "2px solid",
            borderColor: activeCabinet === "pong" ? "#10b981" : (activeCabinet === "breakout" ? "#f59e0b" : "#ef4444"),
            borderRadius: "16px",
            boxShadow: `0 0 60px ${activeCabinet === "pong" ? "rgba(16, 185, 129, 0.25)" : (activeCabinet === "breakout" ? "rgba(245, 158, 11, 0.25)" : "rgba(239, 68, 68, 0.25)")}`,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setActiveCabinet(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#fff",
                fontSize: "1rem",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ef4444";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              ✕
            </button>

            {/* Cabinet Content */}
            <AtariCabinet 
              gameType={activeCabinet} 
              onClose={() => setActiveCabinet(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
