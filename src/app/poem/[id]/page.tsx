
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/versify/Header';
import { useLibrary } from '@/context/LibraryContext';
import type { Poem } from '@/context/LibraryContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function PoemDetailPage() {
    const { id } = useParams();
    const firestore = useFirestore();
    const { data: poem, loading } = useDoc<Poem>(id ? doc(firestore, 'poems', id as string) : null);
    const { deletePoem, setPoemForEditing } = useLibrary();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!loading && !poem) {
            toast({ title: "Poem not found", variant: "destructive" });
            router.push('/library');
        }
    }, [poem, loading, router, toast]);

    const handleDelete = async () => {
        if (poem) {
            await deletePoem(poem.id);
            toast({
                title: "Poem Deleted",
                description: `"${poem.title}" has been removed from your library.`,
            })
            router.push('/library');
        }
    }
    
    const handleEdit = () => {
        if (poem) {
            setPoemForEditing(poem);
            router.push('/');
        }
    }


    if (loading || !poem) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading poem...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="container max-w-4xl">
                    <Button variant="ghost" onClick={() => router.push('/library')} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Library
                    </Button>
                    <Card className="overflow-hidden shadow-lg">
                        <div className="grid md:grid-cols-2">
                            <div className="relative aspect-square md:aspect-auto">
                                <Image src={poem.image.imageUrl} alt={poem.image.description} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-3xl font-bold font-headline text-primary mb-4">{poem.title}</h2>
                                    <p className="whitespace-pre-wrap text-base leading-relaxed font-serif flex-1">
                                        {poem.poem}
                                    </p>
                                    <div className="flex items-center gap-2 pt-6 mt-auto">
                                      <Button onClick={handleEdit}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="outline"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                      This action cannot be undone. This will permanently delete the poem
                                                      "{poem.title}" from your library.
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
