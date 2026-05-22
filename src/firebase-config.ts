import { getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './firebase/app';

/**
 * Shared Firestore database instance.
 * Initialized lazily on first import so that Firebase app configuration
 * is always available before getFirestore() is called.
 */
export const db = getFirestore(getFirebaseApp());
