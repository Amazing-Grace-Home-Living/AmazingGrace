import { useHUD } from "../../hud/HUDContext";
import { emit, Events } from "../../core/eventBus";
import { useSevenStarsLore } from "./useSevenStarsLore";

export function useSevenStarsProgress() {
  const { hud, setHUD } = useHUD();
  const { stars } = useSevenStarsLore();

  function collectStar(id) {
    const star = stars.find(s => s.id === id);
    if (!star) return;

    setHUD(h => {
      // Ensure progress exists (in case it wasn't initialized)
      const currentProgress = h.progress?.sevenStars || { collected: [], unlockedVirtues: [], level: 1 };
      const collectedSet = new Set(currentProgress.collected);
      if (collectedSet.has(id)) return h;

      collectedSet.add(id);
      const virtuesSet = new Set(currentProgress.unlockedVirtues);
      virtuesSet.add(star.virtue);

      const level = 1 + Math.floor(collectedSet.size / 2);

      emit(Events.NOTIFY, {
        type: "info",
        message: `Collected ${star.name}. Virtue unlocked: ${star.virtue}.`
      });

      return {
        ...h,
        progress: {
          ...h.progress,
          sevenStars: {
            collected: Array.from(collectedSet),
            unlockedVirtues: Array.from(virtuesSet),
            level
          }
        }
      };
    });
  }

  return { progress: hud?.progress, collectStar };
}
