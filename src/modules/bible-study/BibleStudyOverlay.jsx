import React from "react";

export default function BibleStudyOverlay({ question, onAnswer }) {
  if (!question) return null;

  return (
    <div className="overlay external-overlay ext-bible-study">
      <div className="bs-header">BIBLE STUDY</div>
      <div className="bs-ref">{question.reference}</div>
      <div className="bs-text">{question.text}</div>
      <ul className="bs-choices" style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
        {question.choices.map((c, i) => (
          <li key={i} style={{ marginBottom: "6px" }}>
            <button 
              className="ui-btn"
              style={{ width: "100%", textAlign: "left" }} 
              onClick={() => onAnswer(i)}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
