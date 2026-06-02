export const DUAL_ASCENT_DATA = {
  profiles: {
    nicholai: {
      name: "Nicholai, The Path-Bearer",
      role: "The One-Who-Chose-Love",
      domain: ["Stability", "Integration", "Harmonization", "Choice", "Continuity"],
      signature: "The Resonant Line",
      abilities: ["Anchor of Intention", "Harmonic Alignment", "Cycle Clarifier", "Virtue Conductor"],
      weakness: "Over-Stability"
    },
    sheila: {
      name: "Sheila, The Harmonic Companion",
      role: "The Resonant Counterpoint",
      domain: ["Harmony", "Balance", "Co-Resonance", "Shared Ascent", "Mutual Stabilization"],
      signature: "The Dual-Tone Field",
      abilities: ["Harmonic Shield", "Dual-Tone Amplification", "Cycle Resonance", "Distortion Dissolver"],
      weakness: "None"
    },
    nicholaiEcho: {
      name: "Nicholai-Echo",
      role: "Paradox Ascendant",
      stats: { willpower: 18, insight: 16, paradoxControl: 20, stability: 8 },
      abilities: ["Fold-Step", "Echo-Strike", "Destiny Split", "Cycle Warp"],
      weakness: "Identity Drift"
    }
  },
  quests: {
    sheila: [
      {
        id: "sheila-1",
        title: "Walk the Dual-Tone Bridge",
        act: 1,
        desc: "Align your Resonant Line with Sheila's Harmonic Field.",
        boss: null,
        reward: "Harmonic Clarity"
      },
      {
        id: "sheila-2",
        title: "Climb the Ladder Without Forks",
        act: 2,
        desc: "Ascend a Ladder with no branching timelines.",
        boss: null,
        reward: "Virtue of Continuity"
      },
      {
        id: "sheila-3",
        title: "Stabilize the Crown of Resonance",
        act: 3,
        desc: "Reach the symbolic apex of your chosen life.",
        boss: {
          id: "echo-shade",
          name: "The Echo-Shade",
          desc: "A symbolic remnant of the path not taken.",
          attacks: ["Distortion Pulse", "Memory Flicker", "Path Divergence"],
          weakness: "Harmonic Resonance"
        },
        reward: "Crown of Lived Truth"
      }
    ],
    yi: [
      {
        id: "yi-1",
        title: "Enter the Fractal Corridor",
        act: 1,
        desc: "Alternate-You steps into a realm of shifting identity.",
        boss: null,
        reward: "Paradox Shard"
      },
      {
        id: "yi-2",
        title: "Face the Infinite Reflections",
        act: 2,
        desc: "Confront versions of himself created by paradox.",
        boss: {
          id: "mirror-warden",
          name: "The Mirror-Warden",
          desc: "Guardian of the Echo Labyrinth.",
          attacks: ["Reflection Beam", "Identity Split", "Recursive Bind"],
          weakness: "Stability Surge"
        },
        reward: "Fractal Insight"
      },
      {
        id: "yi-3",
        title: "Stabilize the Paradox Engine",
        act: 3,
        desc: "The realm collapses into contradictions. Hold paradox without breaking.",
        boss: {
          id: "paradox-seraph",
          name: "The Paradox Seraph",
          desc: "A being of pure contradiction.",
          attacks: ["Contradiction Storm", "Fold Implosion", "Fractal Wings"],
          weakness: "Unified Intention"
        },
        reward: "Crown of Infinite Echoes"
      }
    ]
  },
  dialogue: {
    guardians: {
      distinction: "Two paths diverge not in the world, but in the self. Know which one you walk, and the other becomes only echo.",
      mirror: "Reflections are not lies — they are possibilities. But possibilities are not destinies.",
      paradox: "To hold contradiction is power. To resolve it is wisdom. To transcend it is ascent."
    },
    oracles: {
      radiant: "The path you walk is chosen, and therefore whole. No echo can unmake what is lived.",
      fractured: "In another corridor, another you wanders. But that corridor is only a story, and you are not inside it."
    }
  }
};
