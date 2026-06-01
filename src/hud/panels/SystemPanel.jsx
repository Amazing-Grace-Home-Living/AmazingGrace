export default function SystemPanel({ data }) {
  const { battery, integrity, connection, temperature, alerts } = data;
  return (
    <div className="hud-panel system-panel">
      <h3>SYSTEM</h3>
      <div>Battery: {battery}%</div>
      <div>Integrity: {integrity}%</div>
      <div>Connection: {connection}</div>
      <div>Temp: {temperature}°C</div>
      <div>Alerts: {alerts}</div>
    </div>
  );
}
