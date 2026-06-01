export default function Alert({ type = "info", children }) {
  return <div className={`ui-alert ui-alert-${type}`}>{children}</div>;
}
