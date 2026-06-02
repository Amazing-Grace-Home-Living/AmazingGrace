import { useState } from "react";
import { emit, Events } from "../core/eventBus";

const signals = [
  { text: "Speak truth even when costly", virtue: "truth" },
  { text: "Ignore a small lie", virtue: "corruption" },
  { text: "Help someone in secret", virtue: "love" },
  { text: "Boast about your good deed", virtue: "corruption" },
  { text: "Stay faithful under pressure", virtue: "faithfulness" }
];

export function useConscienceCalibration() {
  const [index, setIndex] = useState(0);
  const current = signals[index];

  function choose(response) {
    const correct = response === current.virtue;

    if (correct) {
      emit(Events.VIRTUE_GAIN, { virtue: current.virtue, amount: 1 });
      emit(Events.XP_GAIN, { amount: 5 });
    } else {
      emit(Events.VIRTUE_GAIN, { virtue: "corruption", amount: 1 });
    }

    setIndex(i => (i + 1) % signals.length);
  }

  return { current, choose };
}
