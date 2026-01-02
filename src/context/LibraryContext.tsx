// THIS IS A MOCK LIBRARY CONTEXT FOR UI DEVELOPMENT
// DO NOT USE IN PRODUCTION

"use client";

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { CreativeControlsState } from '@/components/versify/VersifyClient';
import React, { createContext, useContext, useState, ReactNode } from 'react';

let poemIdCounter = 0;

export interface Poem {
    id: string;
    title: string;
    poem: string;
    image: ImagePlaceholder;
    collection?: string | null;
    controls?: CreativeControlsState;
}

interface LibraryContextType {
    library: Poem[];
    collections: string[];
    addPoemToLibrary: (poem: Omit<Poem, 'id'>) => void;
    getPoemById: (id: string) => Poem | undefined;
    deletePoem: (id: string) => void;
    updatePoemCollection: (id: string, collection: string | null) => void;
    clearLibrary: () => void;
    poemForEditing: Poem | null;
    setPoemForEditing: (poem: Poem) => void;
    clearPoemForEditing: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
    const [library, setLibrary] = useState<Poem[]>([]);
    const [poemForEditing, setPoemForEditingState] = useState<Poem | null>(null);
    const collections = ['Favorites', 'Drafts'];

    const addPoemToLibrary = (poem: Omit<Poem, 'id'>) => {
        const newPoem = { ...poem, id: `poem-${poemIdCounter++}` };
        setLibrary(prevLibrary => [newPoem, ...prevLibrary]);
    };

    const getPoemById = (id: string) => {
        return library.find(p => p.id === id);
    }

    const deletePoem = (id: string) => {
        setLibrary(prevLibrary => prevLibrary.filter(p => p.id !== id));
    }
    
    const updatePoemCollection = (id: string, collection: string | null) => {
        setLibrary(prevLibrary => 
            prevLibrary.map(p => 
                p.id === id ? { ...p, collection } : p
            )
        );
    }

    const clearLibrary = () => {
        setLibrary([]);
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
            clearLibrary,
            poemForEditing,
            setPoemForEditing,
            clearPoemForEditing
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
