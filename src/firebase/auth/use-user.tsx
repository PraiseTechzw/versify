
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
  type Auth,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { setDoc, doc, type Firestore, getDoc } from 'firebase/firestore';

export type User = FirebaseUser & {
  notificationPreferences?: {
    dailyInspiration: boolean;
    holidayEvents: boolean;
  }
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!auth || !firestore) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
};

export const login = async (auth: Auth, email: string, pass: string) => {
  await signInWithEmailAndPassword(auth, email, pass);
};

export const loginWithGoogle = async (auth: Auth, firestore: Firestore) => {
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

export const signup = async (auth: Auth, firestore: Firestore, email: string, pass: string, displayName: string) => {
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

export const logout = async (auth: Auth) => {
  await signOut(auth);
};

export const updateProfile = async (firestore: Firestore, user: User, profile: { displayName?: string, photoURL?: string, notificationPreferences?: any }) => {
    const dataToUpdate: any = {};
    if (profile.displayName) {
      dataToUpdate.displayName = profile.displayName;
    }
    if (profile.photoURL) {
      dataToUpdate.photoURL = profile.photoURL;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await updateFirebaseProfile(user, dataToUpdate);
    }
    
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, profile, { merge: true });
}
