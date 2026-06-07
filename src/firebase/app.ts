import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging';

/**
 * Hardcoded fallback configuration to ensure the application remains functional
 * even if environment variables are missing or invalid in the build pipeline.
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
 * Normalizes and validates environment variable strings.
 * Discards values that are empty, "undefined", "null", or don't look like Firebase keys.
 */
const getValidValue = (val: any, fallback: string): string => {
  if (typeof val !== 'string') return fallback;
  let t = val.trim();
  
  // Strip potential literal quotes injected by build environment
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }

  // Sanity check: must be non-empty and not the literal string "undefined" or "null"
  if (!t || t === 'undefined' || t === 'null') return fallback;

  // Specific check for API Key format if it's meant to be an AIza... key
  if (fallback.startsWith('AIza') && !t.startsWith('AIza')) {
    console.warn(`[Firebase] Discarding invalid API Key from environment: "${t.substring(0, 5)}..."`);
    return fallback;
  }

  return t;
};

let firebaseApp: ReturnType<typeof initializeApp> | null = null;

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  // Use literal property access for Vite's static replacement.
  const config = {
    apiKey: getValidValue(import.meta.env.VITE_FIREBASE_API_KEY, DEFAULT_CONFIG.apiKey),
    authDomain: getValidValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, DEFAULT_CONFIG.authDomain),
    projectId: getValidValue(import.meta.env.VITE_FIREBASE_PROJECT_ID, DEFAULT_CONFIG.projectId),
    storageBucket: getValidValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, DEFAULT_CONFIG.storageBucket),
    messagingSenderId: getValidValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, DEFAULT_CONFIG.messagingSenderId),
    appId: getValidValue(import.meta.env.VITE_FIREBASE_APP_ID, DEFAULT_CONFIG.appId),
    measurementId: getValidValue(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, DEFAULT_CONFIG.measurementId),
  };

  const isUsingEnv = (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY.startsWith('AIza'));
  console.log(`[Firebase] Node initialized. Project: ${config.projectId} (${isUsingEnv ? 'Remote Config' : 'Local Fallback'})`);

  try {
    firebaseApp = initializeApp(config);
    return firebaseApp;
  } catch (err) {
    console.error('[Firebase] Fatal initialization error:', err);
    // As a last resort, try initializing with the hardcoded default directly
    firebaseApp = initializeApp(DEFAULT_CONFIG);
    return firebaseApp;
  }
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = isAnalyticsSupported()
      .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
      .catch((err) => {
        console.warn('[Firebase] Analytics failed to load:', err);
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
        console.warn('[Firebase] Messaging failed to load:', err);
        return null;
      });
  }
  return messagingPromise;
}

export const VAPID_KEY = getValidValue(import.meta.env.VITE_FIREBASE_VAPID_KEY, DEFAULT_CONFIG.vapidKey);

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
