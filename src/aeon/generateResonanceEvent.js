export function generateResonanceEvent(virtues) {
  const total = (virtues.illumination || 0) + (virtues.resonance || 0) + (virtues.transcendence || 0);

  if (total > 6) return "A cosmic chord vibrates through your being.";
  if (virtues.illumination > 2) return "A beam of insight pierces the void.";
  if (virtues.resonance > 2) return "Your soul harmonizes with unseen realms.";
  if (virtues.transcendence > 2) return "You glimpse a world beyond form.";

  return "A faint ripple stirs the Aeon.";
}
