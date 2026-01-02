// THIS IS A MOCK LIBRARY CONTEXT FOR UI DEVELOPMENT
// DO NOT USE IN PRODUCTION

"use client";

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Poem {
    title: string;
    poem: string;
    image: ImagePlaceholder;
}

interface LibraryContextType {
    library: Poem[];
    addPoemToLibrary: (poem: Poem) => void;
    clearLibrary: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
    const [library, setLibrary] = useState<Poem[]>([]);

    const addPoemToLibrary = (poem: Poem) => {
        setLibrary(prevLibrary => [poem, ...prevLibrary]);
    };

    const clearLibrary = () => {
        setLibrary([]);
    }

    return (
        <LibraryContext.Provider value={{ library, addPoemToLibrary, clearLibrary }}>
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
