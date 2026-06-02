import { useEffect, useState } from "react";
import { useHUD } from "../hud/HUDContext";
import { on, Events } from "../core/eventBus";
import { getOracleTone } from "./getOracleTone";
import { oracleMessages } from "./oracleMessages";

export function useOracle() {
  const { hud } = useHUD();
  const [message, setMessage] = useState("The Matrix is listening.");

  function update() {
    if (!hud) return;
    const tone = getOracleTone(hud.virtueEngine);
    const pool = oracleMessages[tone] || oracleMessages.neutral;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    setMessage(msg);
  }

  // Run update on mount or when HUD state changes
  useEffect(() => {
    update();
  }, [hud]);

  useEffect(() => {
    const unsub1 = on(Events.VIRTUE_GAIN, update);
    const unsub2 = on(Events.XP_GAIN, update);
    const unsub3 = on(Events.MODULE_EVENT, update);

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [hud]);

  return { message };
}
