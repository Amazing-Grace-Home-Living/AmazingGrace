/**
 * firebase.js — Firebase init + auth/DB helpers.
 *
 * In production this module bridges Firebase Auth + Realtime Database.
 * For local / demo use it falls back to localStorage so the UI works
 * without a live Firebase project.
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbc-imBd_m9CQ-39kbmLbNeY5Itw4nZXI",
  authDomain: "amazing-grace-hl.firebaseapp.com",
  projectId: "amazing-grace-hl",
  storageBucket: "amazing-grace-hl.firebasestorage.app",
  messagingSenderId: "1081883726845",
  appId: "1:1081883726845:web:88b49fc41d949e5511ff94",
  measurementId: "G-WLYVDX4GWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics if supported
isSupported().then(yes => yes && getAnalytics(app));

const realDb = getDatabase(app);
const realAuth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export async function signInWithGooglePopup() {
  try {
    const result = await signInWithPopup(realAuth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/* ── Demo / localStorage database shim ────────────────────────────────────
   Provides a Firebase-compatible db.ref().get()/.set()/.update() API backed
   by localStorage so pages work without a live Firebase backend.
   ─────────────────────────────────────────────────────────────────────── */

const DEMO_USERS_KEY = 'matrix_demo_users';

function getDemoUsers() {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDemoUsers(users) {
  try {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('[firebase.js] Could not persist demo users:', e);
  }
}

function seedDemoUsers() {
  const existing = getDemoUsers();
  if (Object.keys(existing).length > 0) return;
  const seed = {
    uid_owner_001: {
      email: 'owner@matrix.dev',
      role: 'owner',
      badges: { badge_01: true, badge_02: true },
      donations: 120,
      tools: { networkDefense: true, diagnostics: true, nations: true, visionForge: true },
    },
    uid_super_002: {
      email: 'superadmin@matrix.dev',
      role: 'superAdmin',
      badges: { badge_01: true },
      donations: 50,
      tools: { networkDefense: true, diagnostics: true, nations: false, visionForge: false },
    },
    uid_admin_003: {
      email: 'admin@matrix.dev',
      role: 'admin',
      badges: {},
      donations: 15,
      tools: { networkDefense: false, diagnostics: true, nations: false, visionForge: false },
    },
    uid_user_004: {
      email: 'user@matrix.dev',
      role: 'user',
      badges: {},
      donations: 0,
      tools: { networkDefense: false, diagnostics: false, nations: false, visionForge: false },
    },
  };
  saveDemoUsers(seed);
}

/**
 * True when running on a local/dev/preview host.
 * Demo seeding is disabled on production hostnames so demo credentials
 * are never available on the live site.
 */
export const IS_DEMO_HOST = (() => {
  try {
    const h = location.hostname;
    const isLocal = h === 'localhost' || h === '127.0.0.1' || h === '';
    // If not local, and we want to use REAL Firebase, return false.
    // The user provided real keys, so let's assume they want real Firebase on production domains.
    return isLocal;
  } catch {
    return false;
  }
})();

export const VAPID_KEY = "BDlS88bALVN54jP-98sz9QjBIUkVhiGnEXt8iDEZIhypsxEQd0wO6O8yzBdTNanycgepY5qC3CkYtDoFcGZsL1s";

if (IS_DEMO_HOST) seedDemoUsers();

/* ── Unified Database API ──────────────────────────────────────────────── */

export const db = IS_DEMO_HOST ? {
  ref(path) {
    return {
      async get() {
        const users = getDemoUsers();
        const parts = (path || '').split('/').filter(Boolean);

        if (parts[0] !== 'users') {
          return { forEach() {}, val: () => null, exists: () => false };
        }

        if (parts.length === 1) {
          return {
            forEach(cb) {
              Object.entries(users).forEach(([key, val]) =>
                cb({ key, val: () => val })
              );
            },
            val: () => users,
            exists: () => Object.keys(users).length > 0,
          };
        }

        const uid = parts[1];
        if (parts.length === 2) {
          const data = users[uid] ?? null;
          return {
            forEach(cb) { if (data) cb({ key: uid, val: () => data }); },
            val: () => data,
            exists: () => data !== null,
          };
        }

        let node = users[uid];
        for (let i = 2; i < parts.length && node !== undefined; i++) {
          node = node[parts[i]];
        }
        const value = node ?? null;
        return {
          forEach() {},
          val: () => value,
          exists: () => value !== null,
        };
      },

      async set(value) {
        const parts = (path || '').split('/').filter(Boolean);
        if (parts[0] === 'users' && parts[1]) {
          const users = getDemoUsers();
          if (parts.length === 2) {
            users[parts[1]] = value;
          } else {
            users[parts[1]] = users[parts[1]] || {};
            let obj = users[parts[1]];
            for (let i = 2; i < parts.length - 1; i++) {
              obj[parts[i]] = obj[parts[i]] || {};
              obj = obj[parts[i]];
            }
            obj[parts[parts.length - 1]] = value;
          }
          saveDemoUsers(users);
        }
      },

      async update(updates) {
        const baseParts = (path || '').split('/').filter(Boolean);
        const users = getDemoUsers();

        const applyUpdate = (relPath, value) => {
          const relParts = relPath.split('/').filter(Boolean);
          let segments;

          if (relParts[0] === 'users') {
            segments = relParts;
          } else if (baseParts[0] === 'users') {
            segments = [...baseParts, ...relParts];
          } else {
            segments = ['users', ...relParts];
          }

          if (segments[0] !== 'users' || !segments[1]) return;

          let node = users;
          for (let i = 1; i < segments.length; i++) {
            const key = segments[i];
            if (i === segments.length - 1) {
              node[key] = value;
            } else {
              node[key] = node[key] || {};
              node = node[key];
            }
          }
        };

        Object.entries(updates).forEach(([relPath, value]) => applyUpdate(relPath, value));
        saveDemoUsers(users);
      },
    };
  },
} : {
  ref(path) {
    const r = ref(realDb, path);
    return {
      get: () => get(r),
      set: (val) => set(r, val),
      update: (upd) => update(r, upd),
    };
  }
};

/* ── Unified Auth API ───────────────────────────────────────────────────── */

const SESSION_KEY = 'matrixUser';

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Authenticate with email + password.
 * 
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ uid: string, email: string, role: string }>}
 */
export async function loginWithEmail(email, password) {
  if (IS_DEMO_HOST) {
    const users = getDemoUsers();
    const entry = Object.entries(users).find(
      ([, u]) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!entry) throw new Error('No account found for that email.');
    if (!password || password.length < 4) throw new Error('Invalid password.');

    const [uid, user] = entry;
    const session = { uid, email: user.email, role: user.role };
    setCurrentUser(session);
    return session;
  } else {
    const credential = await signInWithEmailAndPassword(realAuth, email, password);
    // Note: This real auth path needs corresponding data in the DB to extract role etc.
    // For now we just return the basic user info.
    const session = { uid: credential.user.uid, email: credential.user.email, role: 'user' };
    setCurrentUser(session);
    return session;
  }
}

export async function loginWithGoogle() {
  if (IS_DEMO_HOST) {
    // Return a mock owner user for demo mode
    const session = { uid: 'uid_owner_001', email: 'owner@matrix.dev', role: 'owner' };
    setCurrentUser(session);
    return session;
  } else {
    const user = await signInWithGooglePopup();
    const session = { uid: user.uid, email: user.email, role: 'user' };
    setCurrentUser(session);
    return session;
  }
}

/**
 * Sign out the current user and redirect to the login page.
 * @param {string} [loginPath='/admin/login.html']
 */
export function logout(loginPath = '/admin/login.html') {
  clearSession();
  if (!IS_DEMO_HOST) {
    firebaseSignOut(realAuth).catch(() => {});
  }
  window.location.href = loginPath;
}
