import React, { useEffect } from "react";
import { useHUD } from "../../hud/HUDContext";
import BibleStudyOverlay from "./BibleStudyOverlay";
import { useBibleStudyEngine } from "./useBibleStudyEngine";
import { emit, Events } from "../../core/eventBus";

export function useBibleStudyHUD() {
  const { setHUD } = useHUD();
  const engine = useBibleStudyEngine();

  // Keep the HUD overlay reactively in sync with the engine state
  useEffect(() => {
    setHUD(h => {
      if (!h.overlays.external.bible_study?.active) return h;
      return {
        ...h,
        overlays: {
          ...h.overlays,
          external: {
            ...h.overlays.external,
            bible_study: {
              active: true,
              render: () => (
                <BibleStudyOverlay
                  question={engine.current}
                  onAnswer={engine.answerQuestion}
                />
              )
            }
          }
        }
      };
    });
  }, [engine.current, setHUD]);

  function openBibleStudy() {
    emit(Events.MODULE_EVENT, { id: "bible_study", active: true });
    emit(Events.NOTIFY, { type: "info", message: "Bible Study module engaged." });

    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          bible_study: {
            active: true,
            render: () => (
              <BibleStudyOverlay
                question={engine.current}
                onAnswer={engine.answerQuestion}
              />
            )
          }
        }
      }
    }));
  }

  function closeBibleStudy() {
    setHUD(h => ({
      ...h,
      overlays: {
        ...h.overlays,
        external: {
          ...h.overlays.external,
          bible_study: {
            ...(h.overlays.external.bible_study || {}),
            active: false
          }
        }
      }
    }));
  }

  return { openBibleStudy, closeBibleStudy };
}
