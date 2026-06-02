export default function TowerDefenseOverlay({ wave, coresRemaining, lives, credits }) {
  return (
    <div className="overlay external-overlay ext-tower-defense">
      <div className="td-header">TOWER DEFENSE</div>
      <div className="td-row">
        <span>Wave</span>
        <span>{wave}</span>
      </div>
      <div className="td-row">
        <span>Cores</span>
        <span>{coresRemaining}</span>
      </div>
      <div className="td-row">
        <span>Lives</span>
        <span>{lives}</span>
      </div>
      <div className="td-row">
        <span>Credits</span>
        <span>{credits}</span>
      </div>
    </div>
  );
}
