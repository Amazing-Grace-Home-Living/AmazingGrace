import { useHUD } from "../hud/HUDContext";

export function useTempleRouter() {
  const { hud, setHUD } = useHUD();

  const stars = hud.progress?.sevenStars?.collected?.length || 0;
  const lamps = hud.lamps?.activated?.length || 0;
  const level = hud.progress?.sevenStars?.level || 1;
  const corruption = hud.virtueEngine?.corruption || 0;

  const unlocked = {
    matrix: true,
    innerCourt: true,
    throne: stars === 7 && lamps >= 4 && level >= 4,
    holyOfHolies: hud.templeVeil?.torn === true,
    oracleChamber: hud.templeVeil?.torn === true,
    bookOfLife: stars === 7 && lamps === 7 && corruption < 10
  };

  function go(screen) {
    if (!unlocked[screen]) return;
    
    // Intercept transitions to sacred chambers to go through the Guardian Screen
    if (["throne", "holyOfHolies", "oracleChamber", "bookOfLife"].includes(screen)) {
      setHUD(h => ({
        ...h,
        route: { screen: "guardian", target: screen }
      }));
    } else {
      setHUD(h => ({
        ...h,
        route: { screen }
      }));
    }
  }

  return { unlocked, go };
}
