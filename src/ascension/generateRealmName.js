export function generateRealmName(layer) {
  const prefixes = ["Aether", "Lumina", "Seraph", "Eon", "Astral", "Prime", "Vox", "Sophia", "Kether", "Caelum"];
  const suffixes = ["Gate", "Crown", "Spire", "Horizon", "Sanctum", "Sphere", "Chord", "Ascent", "Threshold", "Nexus"];

  const p = prefixes[layer % prefixes.length];
  const s = suffixes[layer % suffixes.length];

  return `${p} ${s}`;
}
