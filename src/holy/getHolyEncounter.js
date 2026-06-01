export function getHolyEncounter(hud) {
  const virtue = hud?.virtueEngine || { truth: 0, love: 0, wisdom: 0, corruption: 0 };
  const corruption = virtue.corruption || 0;
  const love = virtue.love || 0;
  const truth = virtue.truth || 0;
  const wisdom = virtue.wisdom || 0;

  if (corruption >= 8) {
    return {
      type: "rebuke",
      message: "The weight of your spiritual corruption blocks connection."
    };
  }

  if (love >= 5 && truth >= 5 && wisdom >= 5) {
    return {
      type: "union",
      message: "Your virtues resonate in perfect harmonic alignment."
    };
  }

  return {
    type: "silence",
    message: "A peaceful, waiting quietness dominates the sanctuary."
  };
}
