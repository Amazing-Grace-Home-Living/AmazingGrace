export default function DialogueOverlay({ dialogue }) {
  if (!dialogue.active) return null;
  return (
    <div className="overlay dialogue-overlay">
      {dialogue.speaker && <div className="speaker">{dialogue.speaker}</div>}
      <div className="text">{dialogue.text}</div>
    </div>
  );
}
