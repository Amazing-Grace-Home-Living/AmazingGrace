import { useEffect } from "react";
import { useHUD } from "../hud/HUDContext";
import ConscienceCalibrationOverlay from "./ConscienceCalibrationOverlay";
import { useConscienceCalibration } from "./useConscienceCalibration";
import { emit, Events } from "../core/eventBus";

export function useConscienceHUD() {
  const { setHUD } = useHUD();
  const engine = useConscienceCalibration();

  function closeCalibration() {
    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          conscience: {
            ...h.overlays.external.conscience,
            active: false
          }
        }
      }
    }));
  }

  // Keep HUD overlay render in sync with state changes
  useEffect(() => {
    setHUD(h => {
      if (!h.overlays?.external?.conscience?.active) return h;
      return {
        ...h,
        overlays: {
          ...h.overlays,
          external: {
            ...h.overlays.external,
            conscience: {
              ...h.overlays.external.conscience,
              render: () => (
                <ConscienceCalibrationOverlay
                  signal={engine.current}
                  onChoose={engine.choose}
                  onClose={closeCalibration}
                />
              )
            }
          }
        }
      };
    });
  }, [engine.current]);

  function startCalibration() {
    emit(Events.NOTIFY, { type: "info", message: "Conscience Calibration started." });

    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          conscience: {
            active: true,
            render: () => (
              <ConscienceCalibrationOverlay
                signal={engine.current}
                onChoose={engine.choose}
                onClose={closeCalibration}
              />
            )
          }
        }
      }
    }));
  }

  return { startCalibration, closeCalibration };
}
