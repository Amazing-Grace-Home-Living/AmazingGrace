export default function PlayerPanel({ data }) {
  const xpToNext = data.level * 100;
  const xpPercent = Math.min(100, Math.round((data.xp / xpToNext) * 100));

  return (
    <div className="hud-panel player-panel">
      <div className="panel-title">OPERATOR</div>
      <div className="metric">
        <span className="label">NAME</span>
        <span className="value">{data.name}</span>
      </div>
      <div className="metric">
        <span className="label">LEVEL</span>
        <span className="value">{data.level}</span>
      </div>
      <div className="metric">
        <span className="label">XP</span>
        <span className="value">{data.xp} / {xpToNext}</span>
      </div>
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
      </div>
    </div>
  );
}
