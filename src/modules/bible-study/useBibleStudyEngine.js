import data from "./questions.json";
import { useState } from "react";
import { emit, Events } from "../../core/eventBus";

export function useBibleStudyEngine() {
  const [index, setIndex] = useState(0);
  const questions = data.questions;
  const current = questions[index] || null;

  function answerQuestion(choiceIndex) {
    if (!current) return;
    const correct = choiceIndex === current.answerIndex;

    emit(Events.NOTIFY, {
      type: correct ? "info" : "warning",
      message: correct ? `Correct! Answered James 1:22 reference.` : "Incorrect answer."
    });

    if (correct) {
      emit(Events.XP_GAIN, { amount: 10 });
      emit(Events.VIRTUE_GAIN, { amount: 1, virtue: current.virtue });
    }

    setIndex(i => (i + 1) % questions.length);
  }

  function getScriptureReference() {
    return current?.reference || null;
  }

  return { current, answerQuestion, getScriptureReference };
}
