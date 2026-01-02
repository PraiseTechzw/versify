'use client';

import {
  onSnapshot,
  type CollectionReference,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import { useEffect, useState, useRef, useMemo }from 'react';

// Thanks to Fireship.io for this hook.
// https://fireship.io/lessons/react-firebase-hooks-custom/
export const useCollection = <T>(query: Query<DocumentData> | CollectionReference<DocumentData> | null) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  });

  useMemo(() => {
    if (!query) {
      setData([]);
      setLoading(true);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as unknown as T);
        });
        setData(data);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [query?.path, query?.where, query?.orderBy, query?.limit, query?.startAt, query?.startAfter, query?.endAt, query?.endBefore]);

  return { data, loading, error };
};
