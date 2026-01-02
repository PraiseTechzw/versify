
"use client";

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { CreativeControlsState } from '@/components/versify/VersifyClient';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCollection } from '@/firebase';
import { collection, where, query } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { addPoem as addPoemToFirestore, updatePoem as updatePoemInFirestore, deletePoem as deletePoemFromFirestore } from '@/lib/poem-service';


/**
 * @interface Poem
 * Represents the structure of a poem object in the application.
 * @property {string} id - The unique identifier for the poem.
 * @property {string} title - The title of the poem.
 * @property {string} poem - The content of the poem.
 * @property {ImagePlaceholder} image - The image associated with the poem.
 * @property {string | null} [collection] - The collection the poem belongs to (e.g., "Favorites").
 * @property {CreativeControlsState} [controls] - The creative controls used to generate the poem.
 * @property {string} [userId] - The ID of the user who created the poem.
 * @property {any} [createdAt] - The timestamp when the poem was created.
 */
export interface Poem {
    id: string;
    title: string;
    poem: string;
    image: ImagePlaceholder;
    collection?: string | null;
    controls?: CreativeControlsState;
    userId?: string;
    createdAt?: any;
}

/**
 * @interface LibraryContextType
 * Defines the shape of the LibraryContext.
 * @property {Poem[]} library - An array of poems in the user's library.
 * @property {string[]} collections - An array of available collection names.
 * @property {(poem: Omit<Poem, 'id' | 'userId' | 'createdAt'>) => Promise<void>} addPoemToLibrary - Function to add a new poem.
 * @property {(id: string) => Poem | undefined} getPoemById - Function to retrieve a poem by its ID.
 * @property {(id: string) => Promise<void>} deletePoem - Function to delete a poem.
 * @property {(id: string, collectionName: string | null) => Promise<void>} updatePoemCollection - Function to update a poem's collection.
 * @property {Poem | null} poemForEditing - A poem that has been selected for editing.
 * @property {(poem: Poem) => void} setPoemForEditing - Function to set a poem for editing.
 * @property {() => void} clearPoemForEditing - Function to clear the poem set for editing.
 * @property {boolean} loading - Flag indicating if the library is currently being loaded.
 */
interface LibraryContextType {
    library: Poem[];
    collections: string[];
    addPoemToLibrary: (poem: Omit<Poem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
    getPoemById: (id: string) => Poem | undefined;
    deletePoem: (id: string) => Promise<void>;
    updatePoemCollection: (id: string, collectionName: string | null) => Promise<void>;
    poemForEditing: Poem | null;
    setPoemForEditing: (poem: Poem) => void;
    clearPoemForEditing: () => void;
    loading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

/**
 * Provides the library state and actions to its children.
 * It handles fetching, adding, updating, and deleting poems from Firestore.
 *
 * @param {{ children: ReactNode }} props - The component props.
 * @returns {JSX.Element} The provider component.
 */
export function LibraryProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const poemsQuery = user ? query(collection(firestore, 'poems'), where('userId', '==', user.uid)) : null;
    const { data: library = [], loading } = useCollection<Poem>(poemsQuery);

    const [poemForEditing, setPoemForEditingState] = useState<Poem | null>(null);
    const collections = ['Favorites', 'Drafts'];

    const addPoemToLibrary = async (poem: Omit<Poem, 'id'| 'userId' | 'createdAt'>) => {
        if (!user) throw new Error("User not logged in");
        await addPoemToFirestore(firestore, user.uid, poem);
    };

    const getPoemById = (id: string) => {
        return library.find(p => p.id === id);
    }

    const deletePoem = async (id: string) => {
        if (!user) throw new Error("User not logged in");
        await deletePoemFromFirestore(firestore, id);
    }
    
    const updatePoemCollection = async (id: string, collectionName: string | null) => {
        if (!user) throw new Error("User not logged in");
        const poem = library.find(p => p.id === id);
        if (poem) {
            await updatePoemInFirestore(firestore, id, { ...poem, collection: collectionName });
        }
    }
    
    const setPoemForEditing = (poem: Poem) => {
        setPoemForEditingState(poem);
    };

    const clearPoemForEditing = () => {
        setPoemForEditingState(null);
    };


    return (
        <LibraryContext.Provider value={{ 
            library, 
            collections,
            addPoemToLibrary, 
            getPoemById, 
            deletePoem,
            updatePoemCollection,
            poemForEditing,
            setPoemForEditing,
            clearPoemForEditing,
            loading,
        }}>
            {children}
        </LibraryContext.Provider>
    );
}

/**
 * A custom hook to access the LibraryContext.
 * Throws an error if used outside of a LibraryProvider.
 *
 * @returns {LibraryContextType} The library context value.
 */
export function useLibrary() {
    const context = useContext(LibraryContext);
    if (context === undefined) {
        throw new Error('useLibrary must be used within a LibraryProvider');
    }
    return context;
}
