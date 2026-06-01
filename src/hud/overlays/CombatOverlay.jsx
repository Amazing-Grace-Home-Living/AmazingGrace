export default function CombatOverlay({ combat }) {
  if (!combat.active) return null;
  return (
    <div className="overlay combat-overlay">
      <div>Enemy: {combat.enemy_name}</div>
      <div>Health: {combat.enemy_health}</div>
      <div>Combo: {combat.combo_meter}</div>
    </div>
  );
}
