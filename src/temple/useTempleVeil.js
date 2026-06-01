import { useHUD } from "../hud/HUDContext";

export function useTempleVeil() {
  const { hud, setHUD } = useHUD();

  function checkVeil() {
    if (!hud) return;
    const stars = hud.progress?.sevenStars?.collected?.length || 0;
    const lamps = hud.lamps?.activated?.length || 0;
    const level = hud.progress?.sevenStars?.level || 1;

    if (!hud?.templeVeil?.torn && stars === 7 && lamps === 7 && level >= 5) {
      setHUD(h => ({
        ...h,
        templeVeil: {
          torn: true,
          unlockedModules: ["holy_of_holies", "oracle_chamber"]
        }
      }));
    }
  }

  return { checkVeil };
}
