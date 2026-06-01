import { createContext, useContext, useState } from "react";

const HUDContext = createContext();

export function HUDProvider({ children }) {
  const [hud, setHUD] = useState({
    system: { battery: 100, integrity: 100, connection: "online" },
    player: { name: "Player", level: 1, xp: 0 },
    modules: {
      internal: { matrix: true, arcade: true, housing: false },
      external: {} // dynamically filled
    },
    overlays: {
      dialogue: { active: false, text: null },
      combat: { active: false },
      external: {}
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
