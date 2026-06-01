export default function NotificationsPanel({ notifications }) {
  return (
    <div className="hud-panel notifications-panel">
      <h3>NOTIFICATIONS</h3>
      <ul>
        {notifications.slice(-5).map((n, idx) => (
          <li key={idx} className={`notif-${n.type || "info"}`}>
            {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
