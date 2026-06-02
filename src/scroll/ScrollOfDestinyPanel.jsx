import React, { useState } from "react";
import { useHUD } from "../hud/HUDContext";
// @ts-ignore
import Button from "../ui/Button";

export default function ScrollOfDestinyPanel() {
  const { hud, setHUD } = useHUD();
  
  // Safely extract character with robust fallbacks
  const character = hud?.character || {
    name: "Subject-01",
    title: "Pilgrim of the Matrix",
    calling: "Sanctification",
    tags: []
  };

  const virtueEngine = hud?.virtueEngine || {
    truth: 0,
    faithfulness: 0,
    wisdom: 0,
    humility: 0,
    perseverance: 0,
    alertness: 0,
    love: 0,
    corruption: 0
  };

  const collectedList = hud?.progress?.sevenStars?.collected || [];
  const level = hud?.progress?.sevenStars?.level || 1;

  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(character);

  function save() {
    setHUD(h => ({ ...h, character: draft }));
    setEdit(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "6px 10px",
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "6px",
    color: "#e2e8f0",
    fontSize: "0.8rem",
    marginBottom: "8px",
    outline: "none",
    fontFamily: "inherit"
  };

  return (
    <div className="hud-panel scroll-panel" style={{ border: "1px solid var(--hud-border)" }}>
      <h3 style={{ color: "var(--neon-gold)", fontSize: "1rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        SCROLL OF DESTINY
      </h3>

      {!edit && (
        <>
          <div className="sd-section" style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px" }}>
            <div className="sd-name" style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--neon-blue)" }}>{character.name}</div>
            <div className="sd-title" style={{ fontStyle: "italic", color: "#94a3b8" }}>{character.title}</div>
            <div className="sd-calling" style={{ color: "var(--neon-purple)", fontWeight: "500" }}>Calling: {character.calling}</div>
          </div>

          <div className="sd-section" style={{ fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "1rem" }}>
            <h4 style={{ color: "var(--hud-accent)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Identity Tags</h4>
            <ul className="sd-tags" style={{ listStyle: "none", padding: 0, margin: "6px 0 0", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {character.tags.length === 0 ? (
                <li style={{ color: "#64748b", fontStyle: "italic" }}>Unwritten</li>
              ) : (
                character.tags.map(t => (
                  <li key={t} style={{ padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.7rem", color: "var(--neon-blue)" }}>{t}</li>
                ))
              )}
            </ul>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Button variant="primary" style={{ width: "100%" }} onClick={() => {
              setDraft(character);
              setEdit(true);
            }}>
              ✏️ Edit Scroll
            </Button>
          </div>
        </>
      )}

      {edit && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
          <div>
            <label style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>Subject Name</label>
            <input
              style={inputStyle}
              value={draft.name}
              onChange={e => setDraft({ ...draft, name: e.target.value })}
              placeholder="Name"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>Pilgrim Title</label>
            <input
              style={inputStyle}
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              placeholder="Title"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>Spiritual Calling</label>
            <input
              style={inputStyle}
              value={draft.calling}
              onChange={e => setDraft({ ...draft, calling: e.target.value })}
              placeholder="Calling"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>Identity Tags (comma separated)</label>
            <textarea
              style={{ ...inputStyle, height: "60px", resize: "none" }}
              value={draft.tags.join(", ")}
              onChange={e =>
                setDraft({ ...draft, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })
              }
              placeholder="Watcher, Endurer"
            />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <Button variant="primary" style={{ flex: 1 }} onClick={save}>
              💾 Save
            </Button>
            <Button style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1" }} onClick={() => setEdit(false)}>
              ✕ Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
