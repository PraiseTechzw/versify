'use client';

import Header from '@/components/versify/Header';
import PoemCard from '@/components/versify/PoemCard';
import { useLibrary } from '@/context/LibraryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen } from 'lucide-react';

export default function LibraryPage() {
    const { library, collections } = useLibrary();

    const poemsInCollection = (collection: string) => library.filter(p => p.collection === collection);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-500">
                <div className="container max-w-screen-2xl">
                    <h1 className="text-3xl font-bold font-headline text-primary mb-6">My Library</h1>
                    
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-md">
                            <TabsTrigger value="all">All Poems ({library.length})</TabsTrigger>
                            {collections.map(c => (
                                <TabsTrigger key={c} value={c}>{c} ({poemsInCollection(c).length})</TabsTrigger>
                            ))}
                        </TabsList>
                        
                        <TabsContent value="all" className="mt-6">
                            {library.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                   {library.map((item) => (
                                       <PoemCard key={item.id} poem={item} />
                                   ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed border-border">
                                     <BookOpen className="w-16 h-16 mb-4 text-primary/30" />
                                     <h2 className="text-2xl font-headline font-semibold text-foreground">Your Library is Empty</h2>
                                    <p className="mt-2 max-w-sm">You haven't saved any poems yet. Start creating to build your personal collection!</p>
                                </div>
                            )}
                        </TabsContent>
                        
                        {collections.map(c => (
                            <TabsContent key={c} value={c} className="mt-6">
                                {poemsInCollection(c).length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                       {poemsInCollection(c).map((item) => (
                                           <PoemCard key={item.id} poem={item} />
                                       ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed border-border">
                                        <h2 className="text-2xl font-headline font-semibold text-foreground">No poems in "{c}"</h2>
                                        <p className="mt-2 max-w-sm">You can add poems to this collection from the main library view using the menu on each poem card.</p>
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
