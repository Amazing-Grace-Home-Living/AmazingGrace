export default function WorldPanel({ data }) {
  const { region, biome, time_of_day, weather, threat_level } = data;
  return (
    <div className="hud-panel world-panel">
      <h3>WORLD</h3>
      <div>Region: {region}</div>
      <div>Biome: {biome}</div>
      <div>Time: {time_of_day}</div>
      <div>Weather: {weather}</div>
      <div>Threat: {threat_level}</div>
    </div>
  );
}
