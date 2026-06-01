import React from "react";

export default function TemplePathway({ active }) {
  return (
    <div className={`temple-pathway ${active ? "active" : ""}`} />
  );
}
