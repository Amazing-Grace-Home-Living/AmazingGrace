import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging';

type ViteEnvLike = Record<string, string | undefined>;

const getViteEnv = (): ViteEnvLike => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env as unknown as ViteEnvLike;
    }
  } catch (e) {
    // Ignore
  }
  return {};
};

const env = getViteEnv();

const requireEnv = (name: keyof ViteEnvLike): string => {
  const value = env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `Missing required Firebase environment variable: ${name}. Copy .env.example to .env and configure Firebase credentials.`
    );
  }
  return value.trim();
};

const optionalEnv = (name: keyof ViteEnvLike): string | undefined => {
  const value = env[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

let firebaseApp: ReturnType<typeof initializeApp> | null = null;

const DEFAULT_CONFIG = {
  apiKey: "AIzaSyDbc-imBd_m9CQ-39kbmLbNeY5Itw4nZXI",
  authDomain: "amazing-grace-hl.firebaseapp.com",
  projectId: "amazing-grace-hl",
  storageBucket: "amazing-grace-hl.firebasestorage.app",
  messagingSenderId: "1081883726845",
  appId: "1:1081883726845:web:88b49fc41d949e5511ff94",
  measurementId: "G-WLYVDX4GWR"
};

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;
  
  const config = {
    apiKey: optionalEnv('VITE_FIREBASE_API_KEY') || DEFAULT_CONFIG.apiKey,
    authDomain: optionalEnv('VITE_FIREBASE_AUTH_DOMAIN') || DEFAULT_CONFIG.authDomain,
    projectId: optionalEnv('VITE_FIREBASE_PROJECT_ID') || DEFAULT_CONFIG.projectId,
    storageBucket: optionalEnv('VITE_FIREBASE_STORAGE_BUCKET') || DEFAULT_CONFIG.storageBucket,
    messagingSenderId: optionalEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || DEFAULT_CONFIG.messagingSenderId,
    appId: optionalEnv('VITE_FIREBASE_APP_ID') || DEFAULT_CONFIG.appId,
    measurementId: optionalEnv('VITE_FIREBASE_MEASUREMENT_ID') || DEFAULT_CONFIG.measurementId,
  };

  firebaseApp = initializeApp(config);
  return firebaseApp;
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = isAnalyticsSupported()
      .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
      .catch(() => null);
  }

  return analyticsPromise;
}

let messagingPromise: Promise<Messaging | null> | null = null;

export function getFirebaseMessaging(): Promise<Messaging | null> {
  if (!messagingPromise) {
    messagingPromise = isMessagingSupported()
      .then((supported) => (supported ? getMessaging(getFirebaseApp()) : null))
      .catch(() => null);
  }
  return messagingPromise;
}

export const VAPID_KEY = optionalEnv('VITE_FIREBASE_VAPID_KEY');

export async function requestMessagingToken(): Promise<string | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging || !VAPID_KEY) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await getToken(messaging, { vapidKey: VAPID_KEY });
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
  }
  return null;
}

export async function onForegroundMessage(callback: (payload: any) => void) {
  const messaging = await getFirebaseMessaging();
  if (messaging) {
    return onMessage(messaging, callback);
  }
}
