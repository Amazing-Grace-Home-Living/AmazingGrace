import { useEffect } from "react";
import { useHUD } from "../hud/HUDContext";
import { on, Events } from "../core/eventBus";

export function useBookOfWorks() {
  const { setHUD } = useHUD();

  function log(entry) {
    setHUD(h => {
      const currentLogs = h?.bookOfWorks || [];
      return {
        ...h,
        bookOfWorks: [...currentLogs, { ...entry, time: Date.now() }]
      };
    });
  }

  useEffect(() => {
    const unsub1 = on(Events.VIRTUE_GAIN, e => {
      log({ 
        type: "virtue", 
        message: `Virtue Gain: ${e.virtue} +${e.amount}`, 
        ...e 
      });
    });

    const unsub2 = on(Events.XP_GAIN, e => {
      log({ 
        type: "xp", 
        message: `XP Reward: +${e.amount} XP`, 
        ...e 
      });
    });

    const unsub3 = on(Events.MODULE_EVENT, e => {
      log({ 
        type: "module", 
        message: `Subsystem Event: ${e.id} [${e.active ? "ACTIVE" : "INACTIVE"}]`, 
        ...e 
      });
    });

    const unsub4 = on(Events.NOTIFY, e => {
      log({ 
        type: "notify", 
        message: e.message, 
        ...e 
      });
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, [setHUD]);
}
