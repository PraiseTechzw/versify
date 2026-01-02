'use client';

// It is recommended to use the re-exports of the official Firebase SDKs
// from this file to be able to switch between the production and emulator
// packages, and to use the connect... Emulator functions.
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './firebase-config';
import { initializeApp, getApp, getApps } from 'firebase/app';

// Explicity initialize the Firebase app.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// To connect to the emulators, edit the condition below to suit your needs.
// For example, you might want to use the emulators only in development.
if (process.env.NODE_ENV === 'development') {
  // Before connecting to the emulators, make sure you have initialized the app.
  // connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  // connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
}

export { app, auth, firestore };

export {
  useUser,
  login,
  loginWithGoogle,
  signup,
  logout,
  updateProfile,
} from './auth/use-user';
export type { User } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
