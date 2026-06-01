export function getOracleTone(virtueEngine) {
  if (!virtueEngine) return "neutral";
  const { corruption = 0, love = 0, truth = 0, humility = 0 } = virtueEngine;

  if (corruption >= 10) return "severe";
  if (corruption >= 5) return "warning";

  if (love >= 7 || humility >= 7) return "gentle";

  return "neutral";
}
