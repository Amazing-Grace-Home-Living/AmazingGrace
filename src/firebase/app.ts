import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDbc-imBd_m9CQ-39kbmLbNeY5Itw4nZXI',
  authDomain: 'amazing-grace-hl.firebaseapp.com',
  projectId: 'amazing-grace-hl',
  storageBucket: 'amazing-grace-hl.firebasestorage.app',
  messagingSenderId: '1081883726845',
  appId: '1:1081883726845:web:88b49fc41d949e5511ff94',
  measurementId: 'G-WLYVDX4GWR',
};

export const firebaseApp = initializeApp(firebaseConfig);

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
      .catch(() => null);
  }

  return analyticsPromise;
}
