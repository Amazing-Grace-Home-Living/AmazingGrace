import { createContext, useContext, useState } from "react";

const HUDContext = createContext();

export function HUDProvider({ children }) {
  const [hud, setHUD] = useState({
    system: { battery: 100, integrity: 100, connection: "online", temperature: 22, alerts: 0 },
    route: { screen: "matrix" },
    player: { name: "Player", level: 1, virtue_alignment: "Neutral", xp: 0, xp_to_next: 100 },
    world: { region: "Nexus", biome: "Sanctum", time_of_day: "Dawn", weather: "Clear", threat_level: 0 },
    modules: {
      internal: { matrix: true, arcade: true, housing: false, example: false },
      external: {} // { tower_defense: true, bible_study: true, ... }
    },
    overlays: {
      dialogue: { active: false, speaker: null, text: null },
      combat: { active: false, enemy_name: null, enemy_health: null, combo_meter: null },
      match3: { active: false, board_state: null, moves_remaining: null, powerups: [] },
      external: {} // { id: { active, render } }
    },
    virtueEngine: {
      truth: 0,
      faithfulness: 0,
      wisdom: 0,
      humility: 0,
      perseverance: 0,
      alertness: 0,
      love: 0,
      corruption: 0
    },
    character: {
      name: "Subject-01",
      title: "Pilgrim of the Matrix",
      calling: "Sanctification",
      tags: []
    },
    progress: {
      sevenStars: {
        collected: [],
        unlockedVirtues: [],
        level: 1
      }
    },
    bookOfWorks: [],
    lamps: {
      activated: []
    },
    rituals: {},
    templeVeil: {
      torn: false,
      unlockedModules: []
    },
    notifications: []
  });

  return (
    <HUDContext.Provider value={{ hud, setHUD }}>
      {children}
    </HUDContext.Provider>
  );
}

export function useHUD() {
  return useContext(HUDContext);
}
