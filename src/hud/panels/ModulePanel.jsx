export default function ModulePanel({ modules }) {
  const internal = Object.entries(modules.internal);
  const external = Object.entries(modules.external);

  return (
    <div className="hud-panel module-panel">
      <div className="panel-title">MODULES</div>

      <div className="module-section">
        <div className="section-label">INTERNAL</div>
        {internal.map(([id, active]) => (
          <div key={id} className={`module-item ${active ? "active" : "inactive"}`}>
            <span className="indicator">{active ? "●" : "○"}</span>
            <span className="module-name">{id.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {external.length > 0 && (
        <div className="module-section">
          <div className="section-label">EXTERNAL</div>
          {external.map(([id, mod]) => (
            <div key={id} className={`module-item ${mod.state === "active" ? "active" : "inactive"}`}>
              <span className="indicator">{mod.state === "active" ? "●" : "○"}</span>
              <span className="module-name">{mod.name || id.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
