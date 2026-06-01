import React from "react";
import SevenStarsConstellation from "./SevenStarsConstellation";

export default function SevenStarsOverlay({ star }) {
  if (!star) return null;

  return (
    <div className="overlay external-overlay ext-seven-stars">
      <div className="ss-header">SEVEN STARS DATABANK</div>
      <div className="ss-name">{star.name}</div>
      <div className="ss-virtue">Virtue: {star.virtue}</div>
      <div className="ss-verse">{star.verse}</div>
      <div className="ss-summary">{star.summary}</div>
      <div style={{ marginTop: "12px" }}>
        <SevenStarsConstellation />
      </div>
    </div>
  );
}
