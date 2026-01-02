'use client';

import {
  createContext,
  useContext,
  type ReactNode,
  type MemoExoticComponent,
  useMemo,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

/**
 * The core Firebase provider.
 *
__Note__: This is a client-side only component.
 * @param props
 * @returns
 */
export function FirebaseProvider(props: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  const { app, auth, firestore } = props;

  const context: FirebaseContextValue = useMemo(
    () => ({
      app,
      auth,
      firestore,
    }),
    [app, auth, firestore]
  );

  return (
    <FirebaseContext.Provider value={context}>
      {props.children}
    </FirebaseContext.Provider>
  );
}

/**
 * A hook to get the Firebase context.
 * This is used to initialize the other hooks.
 * @returns
 */
export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirebaseApp() {
  const context = useFirebase();

  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }

  return context.app;
}

export function useAuth() {
  const context = useFirebase();

  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }

  return context.auth;
}

export function useFirestore() {
  const context = useFirebase();

  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }

  return context.firestore;
}
