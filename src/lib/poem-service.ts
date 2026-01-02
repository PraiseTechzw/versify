import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import type { Poem } from '@/context/LibraryContext';

export const addPoem = async (firestore: Firestore, userId: string, poemData: Omit<Poem, 'id' | 'userId' | 'createdAt'>) => {
    const poemsCollection = collection(firestore, 'poems');
    await addDoc(poemsCollection, {
        ...poemData,
        userId,
        createdAt: serverTimestamp(),
    });
};

export const updatePoem = async (firestore: Firestore, poemId: string, poemData: Poem) => {
    const poemRef = doc(firestore, 'poems', poemId);
    await updateDoc(poemRef, {
        ...poemData,
    });
}

export const deletePoem = async (firestore: Firestore, poemId: string) => {
    const poemRef = doc(firestore, 'poems', poemId);
    await deleteDoc(poemRef);
}
