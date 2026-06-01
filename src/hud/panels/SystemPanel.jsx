export default function SystemPanel({ data }) {
  const statusColor = data.connection === "online" ? "#0f8" : "#f04";

  return (
    <div className="hud-panel system-panel">
      <div className="panel-title">SYSTEM</div>
      <div className="metric">
        <span className="label">BATTERY</span>
        <span className="value">{data.battery}%</span>
      </div>
      <div className="metric">
        <span className="label">INTEGRITY</span>
        <span className="value">{data.integrity}%</span>
      </div>
      <div className="metric">
        <span className="label">STATUS</span>
        <span className="value" style={{ color: statusColor }}>
          {data.connection.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
