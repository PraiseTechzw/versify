"use client";

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { CreativeControlsState } from '@/components/versify/VersifyClient';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCollection } from '@/firebase';
import { collection, where, query } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { addPoem as addPoemToFirestore, updatePoem as updatePoemInFirestore, deletePoem as deletePoemFromFirestore } from '@/lib/poem-service';


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

export function useLibrary() {
    const context = useContext(LibraryContext);
    if (context === undefined) {
        throw new Error('useLibrary must be used within a LibraryProvider');
    }
    return context;
}
