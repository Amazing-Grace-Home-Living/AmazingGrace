export default function Match3Overlay({ match3 }) {
  if (!match3.active) return null;
  return (
    <div className="overlay match3-overlay">
      <div>Moves: {match3.moves_remaining}</div>
      <div>Powerups: {match3.powerups?.length || 0}</div>
      {/* board_state rendering is game‑specific */}
    </div>
  );
}
