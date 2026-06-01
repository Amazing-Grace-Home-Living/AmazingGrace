export default function PlayerPanel({ data }) {
  const { name, level, virtue_alignment, xp, xp_to_next } = data;
  const pct = Math.min(100, Math.round((xp / xp_to_next) * 100));

  return (
    <div className="hud-panel player-panel">
      <h3>PLAYER</h3>
      <div>Name: {name}</div>
      <div>Level: {level}</div>
      <div>Virtue: {virtue_alignment}</div>
      <div className="xp-bar">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div>XP: {xp} / {xp_to_next}</div>
    </div>
  );
}
