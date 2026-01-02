'use client';

import {
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  memo,
  Suspense,
} from 'react';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './firebase-config';
import { FirebaseProvider } from './provider';
import { LibraryProvider } from '@/context/LibraryContext';

/**
 * A client-side-only component that initializes Firebase and provides it to all children.
 *
 * @see https://github.com/firebase/firebase-js-sdk/issues/5267#issuecomment-923330983
 */
function FirebaseClientProviderInternal({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    const app = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    setServices({ app, auth, firestore });
  }, []);

  if (!services) {
    return null;
  }

  return (
    <FirebaseProvider
      app={services.app}
      auth={services.auth}
      firestore={services.firestore}
    >
      <LibraryProvider>
        {children}
      </LibraryProvider>
    </FirebaseProvider>
  );
}

const MemoizedFirebaseClientProvider = memo(FirebaseClientProviderInternal);

/**
 * A client-side-only component that initializes Firebase and provides it to all children.
 * All children will be rendered on the client.
 *
 * The provider is memoized to prevent re-initialization of Firebase.
 *
 * @param props
 * @returns
 */
export function FirebaseClientProvider(props: { children: ReactNode }) {
  return <MemoizedFirebaseClientProvider {...props} />;
}
