import { useHUD } from "../../hud/HUDContext";
import SevenLampsOverlay from "./SevenLampsOverlay";
import lamps from "./lamps.json";
import { emit, Events } from "../../core/eventBus";

export function useSevenLampsHUD() {
  const { setHUD } = useHUD();

  function closeLamp() {
    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          seven_lamps: {
            ...h.overlays.external.seven_lamps,
            active: false
          }
        }
      }
    }));
  }

  function activateLamp(id) {
    const lamp = lamps.lamps.find(l => l.id === id);
    if (!lamp) return;

    emit(Events.VIRTUE_GAIN, { virtue: lamp.buff, amount: 2 });
    emit(Events.NOTIFY, { type: "info", message: `${lamp.name} activated.` });

    setHUD(h => {
      const currentActivated = h?.lamps?.activated || [];
      const updatedActivated = Array.from(new Set([...currentActivated, id]));
      return {
        ...h,
        lamps: {
          ...h?.lamps,
          activated: updatedActivated
        },
        overlays: {
          ...h.overlays,
          external: {
            ...h.overlays.external,
            seven_lamps: {
              active: true,
              render: () => <SevenLampsOverlay lamp={lamp} onClose={closeLamp} />
            }
          }
        }
      };
    });
  }

  return { activateLamp, closeLamp };
}
