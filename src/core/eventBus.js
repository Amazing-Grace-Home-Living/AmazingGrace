const listeners = {};

export const Events = {
  XP_GAIN: "xp_gain",
  PWR_GAIN: "pwr_gain",
  VIRTUE_GAIN: "virtue_gain",
  NOTIFY: "notify",
  MODULE_EVENT: "module_event"
};

export function on(event, handler) {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(handler);
  return () => off(event, handler);
}

export function off(event, handler) {
  listeners[event]?.delete(handler);
}

export function emit(event, payload) {
  listeners[event]?.forEach(fn => fn(payload));
}
