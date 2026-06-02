import { useHUD } from "../../hud/HUDContext";
import TowerDefenseOverlay from "./TowerDefenseOverlay";

export function useTowerDefenseHUD() {
  const { setHUD } = useHUD();

  function showOverlay(state) {
    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          tower_defense: {
            active: true,
            render: () => <TowerDefenseOverlay {...state} />
          }
        }
      }
    }));
  }

  function hideOverlay() {
    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          tower_defense: { ...(h.overlays.external.tower_defense || {}), active: false }
        }
      }
    }));
  }

  return { showOverlay, hideOverlay };
}
