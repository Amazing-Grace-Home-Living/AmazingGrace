import { useHUD } from "../hud/HUDContext";
import { holyEncounterScript } from "./holyEncounterScript";
import { getHolyEncounter } from "./getHolyEncounter";

export function useHolyEncounterEngine() {
  const { hud, setHUD } = useHUD();

  function nextStage() {
    const currentStage = hud?.holyEncounter?.stage ?? 0;
    const stage = currentStage + 1;

    if (stage === 1) return advance("approach");
    if (stage === 2) return advance("revelation");
    if (stage === 3) return advance("examination");
    if (stage === 4) return finalize();

    return;
  }

  function advance(key) {
    const lines = holyEncounterScript[key];
    setHUD(h => {
      const currentHistory = h.holyEncounter?.history || [];
      const currentStage = h.holyEncounter?.stage || 0;
      return {
        ...h,
        holyEncounter: {
          stage: currentStage + 1,
          history: [...currentHistory, ...lines]
        }
      };
    });
  }

  function finalize() {
    const outcome = getHolyEncounter(hud);
    const line = holyEncounterScript.outcomes[outcome.type];

    setHUD(h => {
      const currentHistory = h.holyEncounter?.history || [];
      return {
        ...h,
        holyEncounter: {
          stage: 5,
          history: [...currentHistory, line]
        }
      };
    });
  }

  function resetEncounter() {
    setHUD(h => ({
      ...h,
      holyEncounter: {
        stage: 0,
        history: []
      }
    }));
  }

  return { nextStage, resetEncounter };
}
