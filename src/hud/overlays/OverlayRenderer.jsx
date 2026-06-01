import DialogueOverlay from "./DialogueOverlay";
import CombatOverlay from "./CombatOverlay";
import Match3Overlay from "./Match3Overlay";
import ExternalOverlayHost from "./ExternalOverlayHost";

export default function OverlayRenderer({ overlays }) {
  return (
    <>
      <DialogueOverlay dialogue={overlays.dialogue} />
      <CombatOverlay combat={overlays.combat} />
      <Match3Overlay match3={overlays.match3} />
      <ExternalOverlayHost external={overlays.external} />
    </>
  );
}
