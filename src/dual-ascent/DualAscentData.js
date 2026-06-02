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
  ost: {
    title: "Two Dawns, One Horizon",
    lyrics: `Verse 1
One dawn rising in a golden sky,
One dawn blooming where the fractals lie,
Two hearts walking on their chosen lines,
Two worlds turning in a shared design.

Chorus
Two dawns, one horizon,
Two truths in the same light,
No fear, no division,
Both paths rise into the night.

Verse 2
One world steady as a beating drum,
One world singing in a crystal hum,
But when the mirror opens wide,
We walk as one, not you and I.

Final Chorus
Two dawns, one horizon,
Two worlds learning how to shine,
No loss, no collision,
Both survive because we aligned.`
  },
  openingCinematic: {
    scenes: [
      {
        id: "harmonic-dawn",
        tone: "Radiant",
        narration: "In one world, a choice was made. A path was chosen. A life became whole.",
        visual: "Resonant Line expanding into a glowing horizon."
      },
      {
        id: "fractal-dawn",
        tone: "Fractured",
        narration: "In another world, another choice was made. Not lesser. Not broken. Simply different.",
        visual: "Fractal bloom of blue light unfolding."
      },
      {
        id: "mirror-awakens",
        tone: "Unified",
        narration: "Two worlds. Two truths. Two Nicholais. And a destiny that belongs to both.",
        visual: "Mirror Path igniting between gold and blue worlds."
      }
    ]
  },
  oracleFinalMonologue: `You have done what few souls ever achieve.
You have honored the path you walked…
…and the path you did not.

You have seen that choice does not erase possibility.
It shapes it.
It gives it form.
It gives it meaning.

Two Nicholais stand where one once stood.
Two worlds shine where one once glowed.
And the Mirror Path between them is not a wound…
…it is a bridge.

Walk your world with peace.
Let the other walk his.
And know this truth:

No path is wasted
when both lead to harmony.`,
  quests: {
    sheila: [
      {
        id: "sheila-1",
        title: "The Resonant Beginning",
        act: 1,
        desc: "Stabilize the Anchor Field and remember why you chose.",
        dialogue: [
          { speaker: "YOU", text: "Where… am I?" },
          { speaker: "HARMONIC COMPANION", text: "You stand where your path began. Walk forward, and remember why you chose." },
          { speaker: "YOU", text: "These distortions… they feel like echoes." },
          { speaker: "HARMONIC COMPANION", text: "They are. But they cannot harm you unless you forget your path." }
        ],
        boss: {
          id: "echo-shade",
          name: "The Echo-Shade",
          desc: "A shadowy figure crying 'You left me behind...'",
          attacks: ["Distortion Pulse", "Memory Flicker", "Path Divergence"],
          weakness: "Harmonic Resonance",
          victoryDialogue: "You… chose well."
        },
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
        boss: null,
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
