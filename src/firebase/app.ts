import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging';

/**
 * Hardcoded fallback configuration to ensure the application remains functional
 * even if environment variables are missing from the build pipeline.
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
 * Normalizes environment variable strings, treating "undefined", "null", or empty strings as undefined.
 */
const normalize = (val: any): string | undefined => {
  if (typeof val !== 'string') return undefined;
  const t = val.trim();
  if (!t || t === 'undefined' || t === 'null') return undefined;
  return t;
};

let firebaseApp: ReturnType<typeof initializeApp> | null = null;

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  // Use literal property access to ensure Vite's static replacement works correctly.
  const config = {
    apiKey: normalize(import.meta.env.VITE_FIREBASE_API_KEY) || DEFAULT_CONFIG.apiKey,
    authDomain: normalize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || DEFAULT_CONFIG.authDomain,
    projectId: normalize(import.meta.env.VITE_FIREBASE_PROJECT_ID) || DEFAULT_CONFIG.projectId,
    storageBucket: normalize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || DEFAULT_CONFIG.storageBucket,
    messagingSenderId: normalize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || DEFAULT_CONFIG.messagingSenderId,
    appId: normalize(import.meta.env.VITE_FIREBASE_APP_ID) || DEFAULT_CONFIG.appId,
    measurementId: normalize(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || DEFAULT_CONFIG.measurementId,
  };

  // Log configuration state for debugging (hiding sensitive parts)
  console.log(`[Firebase] Initializing with Project ID: ${config.projectId}`);
  if (!config.apiKey || config.apiKey.length < 10) {
    console.warn('[Firebase] Warning: API Key appears to be invalid or too short.');
  }

  firebaseApp = initializeApp(config);
  return firebaseApp;
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
