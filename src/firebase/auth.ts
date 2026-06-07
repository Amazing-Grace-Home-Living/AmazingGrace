import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  type User,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { useState, useEffect } from 'react';
import { getFirebaseApp } from './app';

export const getFirebaseAuth = () => getAuth(getFirebaseApp());

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(getFirebaseAuth(), provider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await firebaseSignOut(getFirebaseAuth());
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
};

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
