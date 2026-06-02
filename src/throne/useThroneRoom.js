import { useHUD } from "../hud/HUDContext";

export function useThroneRoom() {
  const { hud } = useHUD();

  function canEnter() {
    if (!hud) return false;
    const stars = hud.progress?.sevenStars?.collected?.length || 0;
    const lamps = hud.lamps?.activated?.length || 0;
    const level = hud.progress?.sevenStars?.level || 1;

    return stars === 7 && lamps >= 4 && level >= 4;
  }

  return { canEnter };
}
