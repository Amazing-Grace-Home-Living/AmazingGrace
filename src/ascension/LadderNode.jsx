import React from "react";

export default function LadderNode({ index, label, active }) {
  return (
    <div className={`ladder-node ${active ? "active" : ""}`}>
      <div className="ladder-glyph">{index + 1}</div>
      <div className="ladder-label">{label}</div>
    </div>
  );
}
