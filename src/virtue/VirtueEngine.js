import { emit, Events } from "../core/eventBus";

export function applyVirtueEvent(setHUD, { virtue, amount }) {
  setHUD(h => {
    const next = { ...h.virtueEngine };

    if (virtue in next) {
      next[virtue] += amount;
      emit(Events.NOTIFY, {
        type: "info",
        message: `Virtue increased: ${virtue} +${amount}`
      });
    } else {
      next.corruption += amount;
      emit(Events.NOTIFY, {
        type: "warning",
        message: `Corruption increased +${amount}`
      });
    }

    return { ...h, virtueEngine: next };
  });
}
