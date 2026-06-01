import React from "react";
import { useHUD } from "../../hud/HUDContext";
import SevenStarsOverlay from "./SevenStarsOverlay";
import { useSevenStarsLore } from "./useSevenStarsLore";
import { emit, Events } from "../../core/eventBus";

export function useSevenStarsHUD() {
  const { setHUD } = useHUD();
  const { getRandomStar } = useSevenStarsLore();

  function openSevenStars() {
    const star = getRandomStar();

    emit(Events.MODULE_EVENT, { id: "seven_stars", active: true });
    emit(Events.NOTIFY, {
      type: "info",
      message: `Seven Stars databank opened: ${star.name}.`
    });
    emit(Events.VIRTUE_GAIN, { amount: 1, virtue: star.virtue });

    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          seven_stars: {
            active: true,
            render: () => <SevenStarsOverlay star={star} />
          }
        }
      }
    }));
  }

  function closeSevenStars() {
    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          seven_stars: {
            ...(h.overlays.external.seven_stars || {}),
            active: false
          }
        }
      }
    }));
  }

  return { openSevenStars, closeSevenStars };
}
