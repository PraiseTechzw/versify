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
import { setDoc, doc } from 'firebase/firestore';
import { useFirestore } from '../provider';

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
  const firestore = useFirestore();
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Create user profile in Firestore if it doesn't exist
  const userRef = doc(firestore, 'users', user.uid);
  await setDoc(userRef, {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  }, { merge: true });
};

export const signup = async (email: string, pass: string, displayName: string) => {
  const auth = useAuth();
  const firestore = useFirestore();
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateFirebaseProfile(userCredential.user, { displayName });

  // Create user profile in Firestore
  const userRef = doc(firestore, 'users', userCredential.user.uid);
  await setDoc(userRef, {
    displayName: displayName,
    email: email,
    photoURL: userCredential.user.photoURL
  });
};

export const logout = async () => {
  const auth = useAuth();
  await signOut(auth);
};

export const updateProfile = async (user: User, profile: { displayName?: string, photoURL?: string }) => {
    const firestore = useFirestore();
    await updateFirebaseProfile(user, profile);

    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, profile, { merge: true });
}
