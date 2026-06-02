import ritualsData from "./rituals.json";
import { useHUD } from "../hud/HUDContext";
import { emit, Events } from "../core/eventBus";

export function useRituals() {
  const { hud, setHUD } = useHUD();

  function performRitual(id) {
    const ritual = ritualsData.rituals.find(r => r.id === id);
    if (!ritual) return;

    const last = hud?.rituals?.[id] || 0;
    const now = Date.now();

    if (now - last < ritual.cooldown * 1000) {
      emit(Events.NOTIFY, {
        type: "warning",
        message: `${ritual.name} is still on cooldown.`
      });
      return;
    }

    emit(Events.VIRTUE_GAIN, { virtue: ritual.virtue, amount: 1 });
    emit(Events.XP_GAIN, { amount: ritual.xp });
    emit(Events.NOTIFY, {
      type: "info",
      message: `${ritual.name} completed. Virtue +1, XP +${ritual.xp}.`
    });

    setHUD(h => ({
      ...h,
      rituals: { ...(h?.rituals || {}), [id]: now }
    }));
  }

  return { rituals: ritualsData.rituals, performRitual };
}
