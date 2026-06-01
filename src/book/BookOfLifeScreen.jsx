import React from "react";
import { useHUD } from "../hud/HUDContext";
import { useNexusRouter } from "../router/useNexusRouter";
import Button from "../ui/Button";

export default function BookOfLifeScreen() {
  const { hud } = useHUD();
  const { go } = useNexusRouter();

  const character = hud?.character || { name: "Subject-01", title: "Pilgrim of the Matrix", calling: "Sanctification", tags: [] };
  const virtue = hud?.virtueEngine || { truth: 0, faithfulness: 0, wisdom: 0, humility: 0, perseverance: 0, alertness: 0, love: 0, corruption: 0 };
  const stars = hud?.progress?.sevenStars?.collected || [];
  const lamps = hud?.lamps?.activated || [];
  const works = hud?.bookOfWorks || [];

  return (
    <div
      className="book-of-life"
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "0 auto",
        background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.04) 0%, rgba(10, 10, 12, 0.98) 75%)",
        border: "1px solid rgba(212, 175, 55, 0.25)",
        borderRadius: "16px",
        boxShadow: "0 0 50px rgba(212, 175, 55, 0.05)"
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1
          style={{
            color: "var(--neon-gold)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontSize: "2.2rem",
            marginBottom: "5px",
            textShadow: "0 0 15px rgba(212, 175, 55, 0.4)"
          }}
        >
          THE BOOK OF LIFE
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px" }}>
          Sacred Eternal Alignment Ledger
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
          textAlign: "left"
        }}
      >
        {/* PILGRIM DETAILS */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(212, 175, 55, 0.1)",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h2 style={{ color: "var(--neon-gold)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", paddingBottom: "5px" }}>
            Pilgrim Profile
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
            <div>
              <span style={{ color: "#64748b" }}>Ident-Signet:</span> <strong style={{ color: "#e2e8f0" }}>{character.name}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Spiritual Rank:</span> <strong style={{ color: "#e2e8f0" }}>{character.title}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Primary Calling:</span> <strong style={{ color: "#e2e8f0" }}>{character.calling}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Gnostic Seals:</span>{" "}
              {character.tags.length === 0 ? (
                <span style={{ color: "#64748b", fontStyle: "italic" }}>None Activated</span>
              ) : (
                character.tags.map((t, idx) => (
                  <span key={idx} style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--neon-gold)", padding: "1px 5px", borderRadius: "3px", marginRight: "4px", fontSize: "0.7rem" }}>
                    {t}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* METAPHYSICAL ALIGNMENTS */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(212, 175, 55, 0.1)",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h2 style={{ color: "var(--neon-gold)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", paddingBottom: "5px" }}>
            Luminous Milestones
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
            <div>
              <span style={{ color: "#64748b" }}>Seven Stars Calibrated:</span>{" "}
              <strong style={{ color: "var(--neon-blue)" }}>{stars.length} / 7 Stars</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Seven Lamps Glowing:</span>{" "}
              <strong style={{ color: "var(--neon-gold)" }}>{lamps.length} / 7 Lamps</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Conscience Level:</span>{" "}
              <strong style={{ color: "var(--neon-purple)" }}>Level {hud?.progress?.sevenStars?.level || 1}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Temple Veil Status:</span>{" "}
              <strong style={{ color: hud?.templeVeil?.torn ? "#34d399" : "#f43f5e" }}>
                {hud?.templeVeil?.torn ? "🔓 Torn (Open)" : "🔒 Intact (Gated)"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VIRTUES GRID */}
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.03)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "left",
          marginBottom: "30px"
        }}
      >
        <h2 style={{ color: "var(--neon-gold)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>
          Virtue Engine Calibration
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
          {Object.entries(virtue).map(([k, val]) => (
            <div
              key={k}
              style={{
                background: "rgba(10, 10, 12, 0.6)",
                border: `1px solid ${k === "corruption" ? "rgba(244, 63, 94, 0.15)" : "rgba(212, 175, 55, 0.1)"}`,
                padding: "8px 12px",
                borderRadius: "6px"
              }}
            >
              <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: k === "corruption" ? "#f43f5e" : "#f1f5f9" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RECORDED LIFE WORKS */}
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(212, 175, 55, 0.1)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "left"
        }}
      >
        <h2 style={{ color: "var(--neon-gold)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderBottom: "1px solid rgba(212, 175, 55, 0.15)", paddingBottom: "5px" }}>
          Eternal Record of Works ({works.length})
        </h2>
        <div
          style={{
            maxHeight: "220px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingRight: "5px"
          }}
        >
          {works.length === 0 ? (
            <div style={{ color: "#64748b", fontStyle: "italic", padding: "20px", textAlign: "center" }}>
              No works are logged in this calendar cycle.
            </div>
          ) : (
            [...works].reverse().map((w, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255,255,255,0.03)",
                  borderRadius: "6px",
                  padding: "10px 15px",
                  fontSize: "0.8rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <span style={{ color: "var(--neon-gold)", fontWeight: "bold", marginRight: "8px" }}>
                    [{w.category || "Ritual"}]
                  </span>
                  <span style={{ color: "#e2e8f0" }}>{w.action}</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  {new Date(w.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Button variant="primary" onClick={() => go("temple")}>
          Return to Temple Map
        </Button>
      </div>
    </div>
  );
}
