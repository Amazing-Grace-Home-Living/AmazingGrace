import { useEffect } from "react";
import { useHUD } from "./HUDContext";
import { Events, on } from "../core/eventBus";

export function useHUDEventBindings() {
  const { setHUD } = useHUD();

  useEffect(() => {
    const unsubXP = on(Events.XP_GAIN, ({ amount }) => {
      setHUD(h => {
        const xp = h.player.xp + amount;
        return { ...h, player: { ...h.player, xp } };
      });
    });

    const unsubNotify = on(Events.NOTIFY, ({ type = "info", message }) => {
      setHUD(h => ({
        ...h,
        notifications: [...h.notifications, { type, message }]
      }));
    });

    const unsubModule = on(Events.MODULE_EVENT, ({ id, active }) => {
      setHUD(h => ({
        ...h,
        modules: {
          ...h.modules,
          external: { ...h.modules.external, [id]: active }
        }
      }));
    });

    return () => {
      unsubXP();
      unsubNotify();
      unsubModule();
    };
  }, [setHUD]);
}
