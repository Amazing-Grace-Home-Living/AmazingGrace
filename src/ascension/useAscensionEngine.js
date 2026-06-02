import { useHUD } from "../hud/HUDContext";
import { generateRealmName } from "./generateRealmName";
import { emit, Events } from "../core/eventBus";

export function useAscensionEngine() {
  const { hud, setHUD } = useHUD();

  function ascend() {
    const nextLayer = (hud?.ascension?.layer || 0) + 1;
    const realmName = generateRealmName(nextLayer);

    emit(Events.NOTIFY, {
      type: "info",
      message: `Ascended to Layer ${nextLayer}: ${realmName}.`
    });

    const cosmicGain = {
      illumination: Math.random() * 2,
      resonance: Math.random() * 2,
      transcendence: Math.random() * 2
    };

    setHUD(h => {
      const currentAsc = h.ascension || { layer: 0, realms: [], cosmicVirtues: { illumination: 0, resonance: 0, transcendence: 0 } };
      const currentVirtues = currentAsc.cosmicVirtues || { illumination: 0, resonance: 0, transcendence: 0 };

      return {
        ...h,
        ascension: {
          layer: nextLayer,
          realms: [...currentAsc.realms, realmName],
          cosmicVirtues: {
            illumination: (currentVirtues.illumination || 0) + cosmicGain.illumination,
            resonance: (currentVirtues.resonance || 0) + cosmicGain.resonance,
            transcendence: (currentVirtues.transcendence || 0) + cosmicGain.transcendence
          }
        }
      };
    });
  }

  function incrementCosmicVirtue(key) {
    emit(Events.NOTIFY, {
      type: "info",
      message: `Calibrated cosmic virtue: ${key.toUpperCase()}.`
    });

    setHUD(h => {
      const currentAsc = h.ascension || { layer: 0, realms: [], cosmicVirtues: { illumination: 0, resonance: 0, transcendence: 0 } };
      const currentVirtues = currentAsc.cosmicVirtues || { illumination: 0, resonance: 0, transcendence: 0 };

      return {
        ...h,
        ascension: {
          ...currentAsc,
          cosmicVirtues: {
            ...currentVirtues,
            [key]: Number(((currentVirtues[key] || 0) + 1).toFixed(2))
          }
        }
      };
    });
  }

  return { ascend, incrementCosmicVirtue };
}
