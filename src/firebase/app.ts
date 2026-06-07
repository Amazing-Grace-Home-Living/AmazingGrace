import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging';

/**
 * Hardcoded fallback configuration to ensure the application remains functional
 * even if environment variables are missing from the build pipeline.
 * Credentials verified against user-provided Firebase console snippet.
 */
const DEFAULT_CONFIG = {
  apiKey: "AIzaSyDbc-imBd_m9CQ-39kbmLbNeY5Itw4nZXI",
  authDomain: "amazing-grace-hl.firebaseapp.com",
  projectId: "amazing-grace-hl",
  storageBucket: "amazing-grace-hl.firebasestorage.app",
  messagingSenderId: "1081883726845",
  appId: "1:1081883726845:web:88b49fc41d949e5511ff94",
  measurementId: "G-WLYVDX4GWR",
  vapidKey: "BDlS88bALVN54jP-98sz9QjBIUkVhiGnEXt8iDEZIhypsxEQd0wO6O8yzBdTNanycgepY5qC3CkYtDoFcGZsL1s"
};

/**
 * Robustly normalizes environment variable strings.
 * - Handles literal "undefined" or "null" strings injected by CI.
 * - Strips literal quotes (e.g. '"KEY"') that might be added during build.
 * - Trims whitespace.
 */
const normalize = (val: any): string | undefined => {
  if (typeof val !== 'string') return undefined;
  let t = val.trim();
  
  // Strip potential literal quotes injected by build environment
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }

  if (!t || t === 'undefined' || t === 'null') return undefined;
  return t;
};

let firebaseApp: ReturnType<typeof initializeApp> | null = null;

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  // Use literal property access to allow Vite to statically replace variables at build time.
  const config = {
    apiKey: normalize(import.meta.env.VITE_FIREBASE_API_KEY) || DEFAULT_CONFIG.apiKey,
    authDomain: normalize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || DEFAULT_CONFIG.authDomain,
    projectId: normalize(import.meta.env.VITE_FIREBASE_PROJECT_ID) || DEFAULT_CONFIG.projectId,
    storageBucket: normalize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || DEFAULT_CONFIG.storageBucket,
    messagingSenderId: normalize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || DEFAULT_CONFIG.messagingSenderId,
    appId: normalize(import.meta.env.VITE_FIREBASE_APP_ID) || DEFAULT_CONFIG.appId,
    measurementId: normalize(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || DEFAULT_CONFIG.measurementId,
  };

  // Safe debugging logs to identify which configuration source is active
  const isUsingEnv = !!normalize(import.meta.env.VITE_FIREBASE_API_KEY);
  console.log(`[Firebase] Initializing project: ${config.projectId} (${isUsingEnv ? 'Env' : 'Default'})`);
  console.log(`[Firebase] API Key Status: Length ${config.apiKey.length}, Prefix: ${config.apiKey.substring(0, 4)}`);

  if (!config.apiKey.startsWith('AIza')) {
    console.error('[Firebase] FATAL: API Key does not start with expected prefix "AIza". Authentication will fail.');
  }

  try {
    firebaseApp = initializeApp(config);
    return firebaseApp;
  } catch (err) {
    console.error('[Firebase] Failed to initializeApp:', err);
    throw err;
  }
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = isAnalyticsSupported()
      .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
      .catch((err) => {
        console.warn('[Firebase] Analytics not supported or failed to load:', err);
        return null;
      });
  }
  return analyticsPromise;
}

let messagingPromise: Promise<Messaging | null> | null = null;

export function getFirebaseMessaging(): Promise<Messaging | null> {
  if (!messagingPromise) {
    messagingPromise = isMessagingSupported()
      .then((supported) => (supported ? getMessaging(getFirebaseApp()) : null))
      .catch((err) => {
        console.warn('[Firebase] Messaging not supported or failed to load:', err);
        return null;
      });
  }
  return messagingPromise;
}

export const VAPID_KEY = normalize(import.meta.env.VITE_FIREBASE_VAPID_KEY) || DEFAULT_CONFIG.vapidKey;

export async function requestMessagingToken(): Promise<string | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging || !VAPID_KEY) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await getToken(messaging, { vapidKey: VAPID_KEY });
    }
  } catch (err) {
    console.error('[Firebase] Error retrieving messaging token:', err);
  }
  return null;
}

export async function onForegroundMessage(callback: (payload: any) => void) {
  const messaging = await getFirebaseMessaging();
  if (messaging) {
    return onMessage(messaging, callback);
  }
}
