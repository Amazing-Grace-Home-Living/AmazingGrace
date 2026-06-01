export default function ExternalOverlayHost({ external }) {
  return (
    <>
      {Object.entries(external).map(([id, overlay]) =>
        overlay.active ? (
          <div key={id} className={`overlay external-overlay ext-${id}`}>
            {typeof overlay.render === "function" ? overlay.render() : null}
          </div>
        ) : null
      )}
    </>
  );
}
