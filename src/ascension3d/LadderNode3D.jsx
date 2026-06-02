import React from "react";

export default function LadderNode3D({ index, label, active, depth }) {
  return (
    <div
      className={`ladder3d-node ${active ? "active" : ""}`}
      style={{ transform: `translateX(-50%) translateZ(${depth}px)` }}
    >
      <div className="ladder3d-glyph">{index + 1}</div>
      <div className="ladder3d-label">{label}</div>
    </div>
  );
}
