import { useEffect } from "react";
import { on, Events } from "../core/eventBus";
import { getOracleTone } from "../oracle/getOracleTone";

export function useInnerCourtChoir(hud) {
  function playTone(tone) {
    try {
      const audio = new Audio(`/audio/choir-${tone}.mp3`);
      audio.volume = 0.6;
      audio.play().catch(err => {
        // Silence autoplay block promise rejections
        console.log("[Choir Engine] Autoplay deferred until interaction:", err.message);
      });
    } catch (err) {
      console.log("[Choir Engine] Failed to initialize audio tone:", err.message);
    }
  }

  useEffect(() => {
    if (!hud) return;

    const unsub1 = on(Events.VIRTUE_GAIN, () => {
      const tone = getOracleTone(hud.virtueEngine);
      playTone(tone);
    });

    const unsub2 = on(Events.MODULE_EVENT, () => {
      playTone("neutral");
    });

    const unsub3 = on(Events.NOTIFY, e => {
      if (e.type === "warning") playTone("warning");
      if (e.type === "error") playTone("severe");
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [hud]);
}
