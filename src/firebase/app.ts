import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging';

type ViteEnvLike = Record<string, string | undefined>;

const getViteEnv = (): ViteEnvLike => {
  const meta = import.meta as ImportMeta & { env?: unknown };
  if (!meta.env || typeof meta.env !== 'object') {
    throw new Error(
      'Vite environment variables are unavailable. Ensure this module is loaded through the Vite build pipeline.'
    );
  }
  return meta.env as ViteEnvLike;
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

export function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;
  firebaseApp = initializeApp({
    apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
    authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireEnv('VITE_FIREBASE_APP_ID'),
    measurementId: optionalEnv('VITE_FIREBASE_MEASUREMENT_ID'),
  });
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
