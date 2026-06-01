export default function Button({ variant = "primary", children, ...props }) {
  return (
    <button className={`ui-btn ui-btn-${variant}`} {...props}>
      {children}
    </button>
  );
}
