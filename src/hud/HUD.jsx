import { useHUD } from "./HUDContext";
import SystemPanel from "./panels/SystemPanel";
import PlayerPanel from "./panels/PlayerPanel";
import WorldPanel from "./panels/WorldPanel";
import ModulePanel from "./panels/ModulePanel";
import NotificationsPanel from "./panels/NotificationsPanel";
import OverlayRenderer from "./overlays/OverlayRenderer";

export default function HUD() {
  const { hud } = useHUD();

  return (
    <div className="hud-root">
      <div className="hud-top">
        <SystemPanel data={hud.system} />
        <WorldPanel data={hud.world} />
      </div>

      <div className="hud-middle">
        <PlayerPanel data={hud.player} />
        <ModulePanel modules={hud.modules} />
      </div>

      <div className="hud-bottom">
        <NotificationsPanel notifications={hud.notifications} />
      </div>

      <OverlayRenderer overlays={hud.overlays} />
    </div>
  );
}
