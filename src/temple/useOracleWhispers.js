import { useEffect, useState } from "react";
import { oracleMessages } from "../oracle/oracleMessages";
import { getOracleTone } from "../oracle/getOracleTone";

export function useOracleWhispers(hud) {
  const [whisper, setWhisper] = useState("");

  useEffect(() => {
    const tone = getOracleTone(hud?.virtueEngine);
    const pool = oracleMessages[tone] || oracleMessages.neutral;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    setWhisper(msg);

    const interval = setInterval(() => {
      const currentTone = getOracleTone(hud?.virtueEngine);
      const currentPool = oracleMessages[currentTone] || oracleMessages.neutral;
      const nextMsg = currentPool[Math.floor(Math.random() * currentPool.length)];
      setWhisper(nextMsg);
    }, 8000);

    return () => clearInterval(interval);
  }, [hud]);

  return whisper;
}
