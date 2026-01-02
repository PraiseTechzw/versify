'use client';

import Header from '@/components/versify/Header';
import PoemCard from '@/components/versify/PoemCard';
import { useLibrary } from '@/context/LibraryContext';

export default function LibraryPage() {
    const { library } = useLibrary();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="container max-w-screen-2xl">
                    <h1 className="text-3xl font-bold font-headline text-primary mb-6">My Library</h1>
                    {library.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {library.map((item) => (
                               <PoemCard key={item.id} poem={item} />
                           ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                             <h2 className="text-2xl font-headline font-semibold text-foreground">Your Library is Empty</h2>
                            <p className="mt-2 max-w-sm">You haven't saved any poems yet. Start creating to build your personal collection!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
