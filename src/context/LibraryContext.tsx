// THIS IS A MOCK LIBRARY CONTEXT FOR UI DEVELOPMENT
// DO NOT USE IN PRODUCTION

"use client";

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import React, { createContext, useContext, useState, ReactNode } from 'react';

let poemIdCounter = 0;

export interface Poem {
    id: string;
    title: string;
    poem: string;
    image: ImagePlaceholder;
}

interface LibraryContextType {
    library: Poem[];
    addPoemToLibrary: (poem: Omit<Poem, 'id'>) => void;
    getPoemById: (id: string) => Poem | undefined;
    clearLibrary: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
    const [library, setLibrary] = useState<Poem[]>([]);

    const addPoemToLibrary = (poem: Omit<Poem, 'id'>) => {
        const newPoem = { ...poem, id: `poem-${poemIdCounter++}` };
        setLibrary(prevLibrary => [newPoem, ...prevLibrary]);
    };

    const getPoemById = (id: string) => {
        return library.find(p => p.id === id);
    }

    const clearLibrary = () => {
        setLibrary([]);
    }

    return (
        <LibraryContext.Provider value={{ library, addPoemToLibrary, getPoemById, clearLibrary }}>
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
