import React from "react";

export default function HypercubeGlyph({ index, active, wAngle = 0 }) {
  const rotation = (wAngle * 2.5) % 360;
  const scale = 1 + Math.sin((wAngle * Math.PI) / 180) * 0.18;
  const opacity = 0.75 + Math.cos((wAngle * Math.PI) / 180) * 0.25;

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity: opacity,
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        filter: active ? "drop-shadow(0 0 10px #4fd1ff)" : "none",
        margin: "0 auto"
      }}
    >
      <defs>
        <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={active ? "#ffffff" : "#4fd1ff"} />
          <stop offset="100%" stopColor={active ? "#4fd1ff" : "#0284c7"} />
        </linearGradient>
      </defs>
      
      {/* Outer Tesseract Box */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        fill="none"
        stroke={`url(#grad-${index})`}
        strokeWidth="2.5"
        strokeDasharray={active ? "none" : "5 3"}
      />
      
      {/* Inner Tesseract Box */}
      <rect
        x="35"
        y="35"
        width="30"
        height="30"
        fill="none"
        stroke={`url(#grad-${index})`}
        strokeWidth="1.5"
      />
      
      {/* 4D Projection Struts */}
      <line x1="15" y1="15" x2="35" y2="35" stroke={`url(#grad-${index})`} strokeWidth="2" />
      <line x1="85" y1="15" x2="65" y2="35" stroke={`url(#grad-${index})`} strokeWidth="2" />
      <line x1="15" y1="85" x2="35" y2="65" stroke={`url(#grad-${index})`} strokeWidth="2" />
      <line x1="85" y1="85" x2="65" y2="65" stroke={`url(#grad-${index})`} strokeWidth="2" />

      {/* Central Singularity */}
      <circle cx="50" cy="50" r={active ? "6" : "3.5"} fill={active ? "#ffffff" : "#4fd1ff"} />
    </svg>
  );
}
