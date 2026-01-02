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

import { auth, firestore } from '@/firebase';
import { setDoc, doc } from 'firebase/firestore';

export type User = FirebaseUser;

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export const login = async (email: string, pass: string) => {
  await signInWithEmailAndPassword(auth, email, pass);
};

export const loginWithGoogle = async () => {
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
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  
  // Update the user's profile in Firebase Auth
  await updateFirebaseProfile(user, { displayName });

  // Create user profile in Firestore
  const userRef = doc(firestore, 'users', user.uid);
  await setDoc(userRef, {
    displayName: displayName,
    email: email,
    photoURL: user.photoURL // Initially null, can be updated later
  });
};

export const logout = async () => {
  await signOut(auth);
};

export const updateProfile = async (user: User, profile: { displayName?: string, photoURL?: string }) => {
    await updateFirebaseProfile(user, profile);

    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, profile, { merge: true });
}
