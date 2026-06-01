import { useHUD } from "../hud/HUDContext";
import { getPropheticVision } from "./getPropheticVision";

export function useVisionCodex() {
  const { hud, setHUD } = useHUD();

  function recordVision() {
    const vision = getPropheticVision(hud);
    const currentCodex = hud?.visionCodex || [];

    // Avoid double-recording identical consecutive visions to keep database tidy
    if (currentCodex.length > 0 && currentCodex[0].vision.text === vision.text) {
      return;
    }

    setHUD(h => {
      const existing = h.visionCodex || [];
      return {
        ...h,
        visionCodex: [
          {
            vision,
            tone: vision.tone,
            time: Date.now()
          },
          ...existing
        ]
      };
    });
  }

  function clearCodex() {
    setHUD(h => ({
      ...h,
      visionCodex: []
    }));
  }

  return { recordVision, clearCodex };
}
