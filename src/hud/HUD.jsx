import { useHUD } from "./HUDContext";
import SystemPanel from "./panels/SystemPanel";
import PlayerPanel from "./panels/PlayerPanel";
import ModulePanel from "./panels/ModulePanel";
import OverlayRenderer from "./overlays/OverlayRenderer";

export default function HUD() {
  const { hud } = useHUD();

  return (
    <div className="hud-root">
      <SystemPanel data={hud.system} />
      <PlayerPanel data={hud.player} />
      <ModulePanel modules={hud.modules} />
      <OverlayRenderer overlays={hud.overlays} />
    </div>
  );
}
