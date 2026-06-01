import React from "react";

export default function GuardianNode({ active, message }) {
  return (
    <div className={`guardian-node ${active ? "active" : ""}`}>
      <div className="guardian-eye" />
      {active && message && <div className="guardian-message">{message}</div>}
    </div>
  );
}
