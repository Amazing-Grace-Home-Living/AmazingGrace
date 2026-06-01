export default function OverlayRenderer({ overlays }) {
  return (
    <>
      {overlays.dialogue.active && (
        <div className="overlay dialogue">{overlays.dialogue.text}</div>
      )}

      {overlays.combat.active && (
        <div className="overlay combat">Combat Engaged</div>
      )}

      {Object.entries(overlays.external).map(([id, overlay]) =>
        overlay.active ? (
          <div key={id} className={`overlay ext-${id}`}>
            {overlay.render()}
          </div>
        ) : null
      )}
    </>
  );
}
