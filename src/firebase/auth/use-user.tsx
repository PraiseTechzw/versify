'use client';

import {
  onAuthStateChanged,
  type User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

import { useAuth } from '../provider';

export type User = FirebaseUser;

export const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
};

export const login = async (email: string, pass: string) => {
  const auth = useAuth();
  await signInWithEmailAndPassword(auth, email, pass);
};

export const loginWithGoogle = async () => {
  const auth = useAuth();
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const signup = async (email: string, pass: string, displayName: string) => {
  const auth = useAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateFirebaseProfile(userCredential.user, { displayName });
};

export const logout = async () => {
  const auth = useAuth();
  await signOut(auth);
};

export const updateProfile = async (user: User, profile: { displayName?: string, photoURL?: string }) => {
    await updateFirebaseProfile(user, profile);
}
