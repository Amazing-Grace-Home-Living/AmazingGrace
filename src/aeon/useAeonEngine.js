import { useHUD } from "../hud/HUDContext";
import { generateDestinyPath } from "./generateDestinyPath";
import { generateResonanceEvent } from "./generateResonanceEvent";
import { emit, Events } from "../core/eventBus";

export function useAeonEngine() {
  const { hud, setHUD } = useHUD();

  function generateCycle() {
    const currentAeon = hud?.aeon || {
      cycle: 0,
      cosmicVirtues: { illumination: 0, resonance: 0, transcendence: 0 },
      destinyPaths: [],
      resonanceEvents: [],
      overdrive: false,
      virtueStorm: null,
      mutatedRealms: [],
      crownUnlocked: false,
      luminousIntegrity: null,
      isRadiantAscent: false
    };

    const nextCycle = (currentAeon.cycle || 0) + 1;
    const ascensionLayer = hud?.ascension?.layer || 0;

    // Check if Overdrive should activate
    const currentVirtues = currentAeon.cosmicVirtues || { illumination: 0, resonance: 0, transcendence: 0 };
    const virtuesSum = (currentVirtues.illumination || 0) + (currentVirtues.resonance || 0) + (currentVirtues.transcendence || 0);
    const isOverdriveNow = currentAeon.overdrive || virtuesSum > 12 || nextCycle > 12 || ascensionLayer > 12;

    // Determine if a Virtue Storm triggers under Overdrive (33% chance per cycle)
    let activeStorm = null;
    let multiplier = 1;
    if (isOverdriveNow) {
      const stormChance = Math.random();
      if (stormChance < 0.11) {
        activeStorm = "Illumination Storm";
        multiplier = 3.5;
        emit(Events.NOTIFY, {
          type: "warning",
          message: "⚠️ ILLUMINATION STORM ENGAGED: Multiplied wisdom insight flares!"
        });
      } else if (stormChance < 0.22) {
        activeStorm = "Resonance Tempest";
        multiplier = 4.0;
        emit(Events.NOTIFY, {
          type: "warning",
          message: "⚠️ RESONANCE TEMPEST TRIGGERED: Cosmic destiny coordinates rewrite!"
        });
      } else if (stormChance < 0.33) {
        activeStorm = "Transcendence Flare";
        multiplier = 5.0;
        emit(Events.NOTIFY, {
          type: "warning",
          message: "⚠️ TRANSCENDENCE FLARE DETECTED: Reality-breaking mutation pulse!"
        });
      }
    }

    // Standard virtue gains
    const gainedVirtues = {
      illumination: Number((Math.random() * 3 * multiplier).toFixed(2)),
      resonance: Number((Math.random() * 3 * multiplier).toFixed(2)),
      transcendence: Number((Math.random() * 3 * multiplier).toFixed(2))
    };

    // Fractal Destiny Paths: Branching nested paths
    const newPathSegment = generateDestinyPath(nextCycle);
    const priorPath = currentAeon.destinyPaths?.[currentAeon.destinyPaths.length - 1];
    
    // Construct nested branch string if priorPath exists, to show ancestral lineage
    const branchLineage = priorPath 
      ? priorPath.includes(" ↳ ") 
        ? `${priorPath.split(" ↳ ").slice(-2).join(" ↳ ")} ↳ ${newPathSegment}`
        : `${priorPath} ↳ ${newPathSegment}`
      : newPathSegment;

    const event = generateResonanceEvent(gainedVirtues);

    // Cosmic mutations: Mutate realms under Transcendence Flare or Overdrive (25% chance per cycle)
    let mutatedRealm = null;
    if (isOverdriveNow && (activeStorm === "Transcendence Flare" || Math.random() < 0.25)) {
      const realmsList = hud?.ascension?.realms || [];
      if (realmsList.length > 0) {
        const randomIndex = Math.floor(Math.random() * realmsList.length);
        const targetRealm = realmsList[randomIndex];
        
        // If not already mutated
        if (!targetRealm.includes("(") && !currentAeon.mutatedRealms?.includes(targetRealm)) {
          const suffixTypes = ["Mutated", "Fractured", "Ascendant"];
          const typeSelected = suffixTypes[nextCycle % suffixTypes.length];
          mutatedRealm = `${targetRealm} (${typeSelected})`;
          
          emit(Events.NOTIFY, {
            type: "warning",
            message: `🌌 COSMIC MUTATION STABILIZED: "${targetRealm}" transfigured into "${mutatedRealm}"!`
          });
        }
      }
    }

    emit(Events.NOTIFY, {
      type: "info",
      message: `Aeon Cycle ${nextCycle} stabilized: ${newPathSegment}.`
    });

    setHUD((h) => {
      const activeAeon = h.aeon || {
        cycle: 0,
        cosmicVirtues: { illumination: 0, resonance: 0, transcendence: 0 },
        destinyPaths: [],
        resonanceEvents: [],
        overdrive: false,
        virtueStorm: null,
        mutatedRealms: [],
        crownUnlocked: false,
        luminousIntegrity: null,
        isRadiantAscent: false
      };

      const baseVirtues = activeAeon.cosmicVirtues || {
        illumination: 0,
        resonance: 0,
        transcendence: 0
      };

      // Append mutated realm to both realms list and mutated realms register
      const currentRealms = h.ascension?.realms || [];
      let updatedRealms = [...currentRealms];
      let mutatedRealmsList = [...(activeAeon.mutatedRealms || [])];
      
      if (mutatedRealm) {
        const origName = mutatedRealm.split(" (")[0];
        updatedRealms = updatedRealms.map(r => r === origName ? mutatedRealm : r);
        mutatedRealmsList.push(mutatedRealm);
      }

      // Check if Crown of Light conditions are met
      const nextIllumination = Number((baseVirtues.illumination + gainedVirtues.illumination).toFixed(2));
      const nextResonance = Number((baseVirtues.resonance + gainedVirtues.resonance).toFixed(2));
      const nextTranscendence = Number((baseVirtues.transcendence + gainedVirtues.transcendence).toFixed(2));
      
      const totalVirtuesSum = nextIllumination + nextResonance + nextTranscendence;
      const isCrownReady = totalVirtuesSum > 30 || nextCycle >= 21 || ascensionLayer >= 21;

      return {
        ...h,
        ascension: {
          ...h.ascension,
          realms: updatedRealms
        },
        aeon: {
          cycle: nextCycle,
          cosmicVirtues: {
            illumination: nextIllumination,
            resonance: nextResonance,
            transcendence: nextTranscendence
          },
          destinyPaths: [...(activeAeon.destinyPaths || []), branchLineage],
          resonanceEvents: [...(activeAeon.resonanceEvents || []), event],
          overdrive: isOverdriveNow,
          virtueStorm: activeStorm,
          mutatedRealms: mutatedRealmsList,
          crownUnlocked: isCrownReady || activeAeon.crownUnlocked,
          luminousIntegrity: activeAeon.luminousIntegrity,
          isRadiantAscent: activeAeon.isRadiantAscent
        }
      };
    });
  }

  return { generateCycle };
}
