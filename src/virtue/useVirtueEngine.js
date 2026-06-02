import { useEffect } from "react";
import { useHUD } from "../hud/HUDContext";
import { on, Events } from "../core/eventBus";
import { applyVirtueEvent } from "./VirtueEngine";

export function useVirtueEngine() {
  const { setHUD } = useHUD();

  useEffect(() => {
    const unsub = on(Events.VIRTUE_GAIN, payload => {
      applyVirtueEvent(setHUD, payload);
    });

    return () => unsub();
  }, [setHUD]);
}
