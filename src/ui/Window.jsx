export default function Window({ title, children, footer }) {
  return (
    <div className="ui-window">
      <div className="ui-window-header">
        <span>{title}</span>
      </div>
      <div className="ui-window-body">{children}</div>
      {footer && <div className="ui-window-footer">{footer}</div>}
    </div>
  );
}
