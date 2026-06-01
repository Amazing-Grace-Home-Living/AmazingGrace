export default function ModulePanel({ modules }) {
  const { internal, external } = modules;

  return (
    <div className="hud-panel module-panel">
      <h3>MODULES</h3>

      <div className="module-section">
        <h4>Internal</h4>
        <ul>
          {Object.entries(internal).map(([id, active]) => (
            <li key={id} className={active ? "active" : "inactive"}>
              {id}
            </li>
          ))}
        </ul>
      </div>

      <div className="module-section">
        <h4>External</h4>
        <ul>
          {Object.entries(external).map(([id, active]) => (
            <li key={id} className={active ? "active" : "inactive"}>
              {id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
