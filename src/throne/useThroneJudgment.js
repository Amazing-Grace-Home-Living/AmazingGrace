import { useHUD } from "../hud/HUDContext";

export function useThroneJudgment() {
  const { hud } = useHUD();

  function canJudge() {
    if (!hud) return false;
    const stars = hud.progress?.sevenStars?.collected?.length || 0;
    const lamps = hud.lamps?.activated?.length || 0;
    const level = hud.progress?.sevenStars?.level || 1;
    const corruption = hud.virtueEngine?.corruption || 0;

    return stars === 7 && lamps >= 4 && level >= 4 && corruption < 10;
  }

  return { canJudge };
}
