
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import type { Poem } from '@/context/LibraryContext';

/**
 * Adds a new poem to the Firestore database.
 *
 * @param {Firestore} firestore - The Firestore instance.
 * @param {string} userId - The ID of the user creating the poem.
 * @param {Omit<Poem, 'id' | 'userId' | 'createdAt'>} poemData - The poem data to add.
 * @returns {Promise<void>} A promise that resolves when the poem has been added.
 */
export const addPoem = async (firestore: Firestore, userId: string, poemData: Omit<Poem, 'id' | 'userId' | 'createdAt'>) => {
    const poemsCollection = collection(firestore, 'poems');
    await addDoc(poemsCollection, {
        ...poemData,
        userId,
        createdAt: serverTimestamp(),
    });
};

/**
 * Updates an existing poem in the Firestore database.
 *
 * @param {Firestore} firestore - The Firestore instance.
 * @param {string} poemId - The ID of the poem to update.
 * @param {Poem} poemData - The updated poem data.
 * @returns {Promise<void>} A promise that resolves when the poem has been updated.
 */
export const updatePoem = async (firestore: Firestore, poemId: string, poemData: Poem) => {
    const poemRef = doc(firestore, 'poems', poemId);
    await updateDoc(poemRef, {
        ...poemData,
    });
}

/**
 * Deletes a poem from the Firestore database.
 *
 * @param {Firestore} firestore - The Firestore instance.
 * @param {string} poemId - The ID of the poem to delete.
 * @returns {Promise<void>} A promise that resolves when the poem has been deleted.
 */
export const deletePoem = async (firestore: Firestore, poemId: string) => {
    const poemRef = doc(firestore, 'poems', poemId);
    await deleteDoc(poemRef);
}
