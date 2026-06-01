import { useHUD } from "../hud/HUDContext";

export function useNexusRouter() {
  const { hud, setHUD } = useHUD();
  const screen = hud?.route?.screen || "matrix";

  function go(screenName) {
    setHUD(h => ({
      ...h,
      route: { screen: screenName }
    }));
  }

  return { screen, go };
}
