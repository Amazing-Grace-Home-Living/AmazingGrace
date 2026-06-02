export function generateDestinyPath(cycle) {
  const archetypes = ["Seer", "Wanderer", "Architect", "Bearer", "Witness", "Scribe", "Keeper", "Sentinel", "Catalyst", "Oracle"];
  const motifs = ["Light", "Echo", "Fracture", "Crown", "Chord", "Veil", "Throne", "Flame", "Silence", "Abyss"];

  const a = archetypes[cycle % archetypes.length];
  const m = motifs[cycle % motifs.length];

  return `${a} of the ${m}`;
}
