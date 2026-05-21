const CREDITS_STORAGE_KEY = 'aghl-credits';
const CONTEXT_STORAGE_KEY = 'aghl-arcade-context';

export const DEFAULT_CURRENCY = 'LUMEN';
export const NEXUS_TRANSACTION_EVENT = 'nexus-transaction';
export const NEXUS_CONTEXT_EVENT = 'nexus-context:updated';
export const LEGACY_CREDITS_EVENT = 'credits:updated';

function getWindowLike() {
  return typeof window !== 'undefined' ? window : null;
}

function getStorage(candidate) {
  if (candidate) return candidate;
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function asPositiveInteger(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.floor(num);
}

function asNonNegativeInteger(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return null;
  return Math.floor(num);
}

function nowIso() {
  return new Date().toISOString();
}

function readModuleMap(storage) {
  const data = safeParse(storage?.getItem(CONTEXT_STORAGE_KEY), {});
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

function writeModuleMap(storage, modules) {
  try {
    storage?.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(modules));
  } catch {
    // Ignore storage write failures.
  }
}

export function readCreditsTotal(storage = getStorage()) {
  const data = safeParse(storage?.getItem(CREDITS_STORAGE_KEY), null);
  if (!data || typeof data !== 'object') return 0;
  const total = asNonNegativeInteger(data.total);
  return total ?? 0;
}

export function writeCreditsTotal(total, storage = getStorage()) {
  const safeTotal = asNonNegativeInteger(total) ?? 0;
  try {
    storage?.setItem(CREDITS_STORAGE_KEY, JSON.stringify({ total: safeTotal }));
  } catch {
    // Ignore storage write failures.
  }
  return safeTotal;
}

export function normalizeModuleId(moduleId) {
  return typeof moduleId === 'string' && moduleId.trim()
    ? moduleId.trim().replace(/[^A-Za-z0-9_-]+/g, '_').toUpperCase()
    : 'ARCADE';
}

export function normalizeTransaction(detail, fallbackModule = 'ARCADE') {
  if (!detail || typeof detail !== 'object') return null;

  const value = asPositiveInteger(detail.value);
  if (!value) return null;

  const moduleId = normalizeModuleId(detail.module || fallbackModule);
  const type =
    detail.type === 'SPEND_RESOURCE' || detail.type === 'EARN_REWARD'
      ? detail.type
      : 'EARN_REWARD';
  const balanceAfter = detail.balanceAfter == null ? null : asNonNegativeInteger(detail.balanceAfter);

  return {
    type,
    module: moduleId,
    value,
    currency:
      typeof detail.currency === 'string' && detail.currency.trim()
        ? detail.currency.trim().toUpperCase()
        : DEFAULT_CURRENCY,
    reason:
      typeof detail.reason === 'string' && detail.reason.trim() ? detail.reason.trim() : '',
    balanceAfter,
    createdAt:
      typeof detail.createdAt === 'string' && detail.createdAt.trim()
        ? detail.createdAt.trim()
        : nowIso(),
  };
}

export function calculateCreditsTotal(currentTotal, transaction) {
  const safeCurrent = asNonNegativeInteger(currentTotal) ?? 0;
  if (transaction?.balanceAfter != null) return transaction.balanceAfter;
  if (!transaction || typeof transaction !== 'object') return safeCurrent;
  if (transaction.type === 'SPEND_RESOURCE') {
    return Math.max(0, safeCurrent - transaction.value);
  }
  return safeCurrent + transaction.value;
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function buildModuleState(previous, moduleId, patch = {}) {
  return {
    moduleId,
    title: patch.title ?? previous?.title ?? moduleId,
    href: patch.href ?? previous?.href ?? '',
    description: patch.description ?? previous?.description ?? '',
    visits: asNonNegativeInteger(patch.visits ?? previous?.visits) ?? 0,
    lastActiveAt: patch.lastActiveAt ?? previous?.lastActiveAt ?? '',
    score: asNonNegativeInteger(patch.score ?? previous?.score) ?? 0,
    highScore: asNonNegativeInteger(patch.highScore ?? previous?.highScore) ?? 0,
  };
}

function ensureHudStyles(doc) {
  if (!doc || doc.getElementById('aghl-nexus-hud-styles')) return;
  const style = doc.createElement('style');
  style.id = 'aghl-nexus-hud-styles';
  style.textContent = `
    .aghl-nexus-hud {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 60;
      min-width: 220px;
      max-width: min(280px, calc(100vw - 2rem));
      padding: 0.9rem 1rem;
      border-radius: 16px;
      border: 1px solid rgba(120, 81, 169, 0.55);
      background: rgba(15, 23, 42, 0.92);
      box-shadow: 0 18px 40px rgba(2, 6, 23, 0.45);
      color: #f0e6ff;
      backdrop-filter: blur(12px);
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .aghl-nexus-hud__eyebrow {
      margin: 0 0 0.35rem;
      font-size: 0.68rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #c4b5fd;
      font-weight: 800;
    }
    .aghl-nexus-hud__title {
      margin: 0;
      font-size: 1rem;
      font-weight: 800;
      color: #ffffff;
    }
    .aghl-nexus-hud__balance {
      margin-top: 0.7rem;
      display: flex;
      align-items: baseline;
      gap: 0.45rem;
      color: #f0abfc;
    }
    .aghl-nexus-hud__balance strong {
      font-size: 1.35rem;
      line-height: 1;
    }
    .aghl-nexus-hud__hint {
      margin: 0.45rem 0 0;
      font-size: 0.78rem;
      color: #cbd5e1;
    }
  `;
  doc.head.appendChild(style);
}

export function createNexusConnector(options = {}) {
  const storage = getStorage(options.storage);
  const target = options.target ?? getWindowLike() ?? new EventTarget();
  const listeners = new Set();
  const modules = readModuleMap(storage);

  const state = {
    currentModule: null,
    creditsTotal: readCreditsTotal(storage),
    lastTransaction: null,
    modules,
    updatedAt: nowIso(),
  };

  function syncWindowState() {
    const win = getWindowLike();
    if (win) win.gameState = cloneState(state);
  }

  function emitState(reason) {
    state.updatedAt = nowIso();
    writeModuleMap(storage, state.modules);
    syncWindowState();
    const snapshot = cloneState(state);
    listeners.forEach((listener) => listener(snapshot, reason));
    if (typeof target.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      target.dispatchEvent(
        new CustomEvent(NEXUS_CONTEXT_EVENT, {
          detail: { state: snapshot, reason },
        }),
      );
    }
  }

  function syncCredits(total, reason, emitLegacyCreditsEvent = false) {
    const safeTotal = writeCreditsTotal(total, storage);
    if (state.creditsTotal === safeTotal && !emitLegacyCreditsEvent) return safeTotal;
    state.creditsTotal = safeTotal;
    if (emitLegacyCreditsEvent && typeof target.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      target.dispatchEvent(
        new CustomEvent(LEGACY_CREDITS_EVENT, {
          detail: { total: safeTotal },
        }),
      );
    }
    emitState(reason);
    return safeTotal;
  }

  function registerModule(meta = {}) {
    const moduleId = normalizeModuleId(meta.moduleId || meta.id || meta.module);
    const previous = state.modules[moduleId];
    state.modules[moduleId] = buildModuleState(previous, moduleId, meta);
    emitState('register-module');
    return cloneState(state.modules[moduleId]);
  }

  function activateModule(moduleId, patch = {}) {
    const safeId = normalizeModuleId(moduleId);
    const previous = state.modules[safeId];
    const nextVisits = (asNonNegativeInteger(previous?.visits) ?? 0) + 1;
    state.modules[safeId] = buildModuleState(previous, safeId, {
      ...patch,
      visits: nextVisits,
      lastActiveAt: nowIso(),
    });
    state.currentModule = safeId;
    emitState('activate-module');
    return cloneState(state.modules[safeId]);
  }

  function recordScore(moduleId, score) {
    const safeId = normalizeModuleId(moduleId);
    const safeScore = asNonNegativeInteger(score);
    if (safeScore == null) return null;
    const previous = state.modules[safeId];
    state.modules[safeId] = buildModuleState(previous, safeId, {
      score: safeScore,
      highScore: Math.max(asNonNegativeInteger(previous?.highScore) ?? 0, safeScore),
    });
    emitState('record-score');
    return cloneState(state.modules[safeId]);
  }

  function applyTransaction(detail, emitLegacyCreditsEvent = false) {
    const transaction = normalizeTransaction(detail, state.currentModule || 'ARCADE');
    if (!transaction) return null;
    const nextTotal = calculateCreditsTotal(state.creditsTotal, transaction);
    state.lastTransaction = transaction;
    syncCredits(nextTotal, 'transaction', emitLegacyCreditsEvent);
    return transaction;
  }

  function publishTransaction(detail) {
    const transaction = normalizeTransaction(detail, state.currentModule || 'ARCADE');
    if (!transaction) return null;
    if (typeof target.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      target.dispatchEvent(new CustomEvent(NEXUS_TRANSACTION_EVENT, { detail: transaction }));
    } else {
      applyTransaction(transaction, detail?.balanceAfter == null);
    }
    return transaction;
  }

  function handleTransaction(event) {
    const transaction = normalizeTransaction(event?.detail, state.currentModule || 'ARCADE');
    if (!transaction) return;
    applyTransaction(transaction, transaction.balanceAfter == null);
  }

  function handleLegacyCreditsEvent(event) {
    const total = asNonNegativeInteger(event?.detail?.total);
    if (total == null) return;
    syncCredits(total, 'legacy-credits');
  }

  function handleStorage(event) {
    if (!event || (event.key !== CREDITS_STORAGE_KEY && event.key !== CONTEXT_STORAGE_KEY)) return;
    if (event.key === CREDITS_STORAGE_KEY) {
      syncCredits(readCreditsTotal(storage), 'storage-sync');
      return;
    }
    const nextModules = readModuleMap(storage);
    state.modules = nextModules;
    emitState('storage-sync');
  }

  if (typeof target.addEventListener === 'function') {
    target.addEventListener(NEXUS_TRANSACTION_EVENT, handleTransaction);
    target.addEventListener(LEGACY_CREDITS_EVENT, handleLegacyCreditsEvent);
    if (target !== globalThis && typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('storage', handleStorage);
    } else if (typeof target.addEventListener === 'function') {
      target.addEventListener('storage', handleStorage);
    }
  }

  syncWindowState();

  return {
    getState() {
      return cloneState(state);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    registerModule,
    activateModule,
    recordScore,
    applyTransaction,
    publishTransaction,
  };
}

let cachedConnector = null;

export function getNexusConnector(options) {
  if (!cachedConnector) {
    cachedConnector = createNexusConnector(options);
  }
  return cachedConnector;
}

export function mountNexusHud({
  connector = getNexusConnector(),
  documentRef = typeof document !== 'undefined' ? document : null,
} = {}) {
  if (!documentRef?.body) return { destroy() {} };
  ensureHudStyles(documentRef);

  let shell = documentRef.getElementById('aghl-nexus-hud');
  if (!shell) {
    shell = documentRef.createElement('aside');
    shell.id = 'aghl-nexus-hud';
    shell.className = 'aghl-nexus-hud';
    shell.setAttribute('aria-live', 'polite');
    documentRef.body.appendChild(shell);
  }

  const render = (state) => {
    const moduleId = state.currentModule;
    const moduleState = moduleId ? state.modules[moduleId] : null;
    const title = moduleState?.title || 'Nexus Arcade';
    const tx = state.lastTransaction;
    const txText = tx
      ? `${tx.type === 'SPEND_RESOURCE' ? 'Spent' : 'Earned'} ${tx.value} ${tx.currency}`
      : 'Shared arcade balance online.';

    shell.innerHTML = `
      <p class="aghl-nexus-hud__eyebrow">Nexus Kernel</p>
      <p class="aghl-nexus-hud__title">${title}</p>
      <div class="aghl-nexus-hud__balance">
        <span>${DEFAULT_CURRENCY}</span>
        <strong>${state.creditsTotal}</strong>
      </div>
      <p class="aghl-nexus-hud__hint">${txText}</p>
    `;
  };

  render(connector.getState());
  const unsubscribe = connector.subscribe(render);
  return {
    destroy() {
      unsubscribe();
      shell.remove();
    },
  };
}

export function bootstrapArcadeModule({
  moduleId,
  title,
  href,
  description,
  withHud = true,
} = {}) {
  const connector = getNexusConnector();
  const safeId = normalizeModuleId(moduleId || title || 'ARCADE');
  connector.registerModule({ moduleId: safeId, title: title || safeId, href, description });
  connector.activateModule(safeId, { title: title || safeId, href, description });
  if (withHud) mountNexusHud({ connector });
  return connector;
}

const globalBridge = {
  bootstrapArcadeModule,
  getNexusConnector,
  publishTransaction(detail) {
    return getNexusConnector().publishTransaction(detail);
  },
  recordScore(moduleId, score) {
    return getNexusConnector().recordScore(moduleId, score);
  },
  readCreditsTotal() {
    return readCreditsTotal();
  },
};

const win = getWindowLike();
if (win) {
  win.NexusArcadeBridge = globalBridge;
}

export default globalBridge;
