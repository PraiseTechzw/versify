'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/versify/Header';
import { useLibrary } from '@/context/LibraryContext';
import type { Poem } from '@/context/LibraryContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function PoemDetailPage() {
    const { id } = useParams();
    const { getPoemById } = useLibrary();
    const router = useRouter();
    const [poem, setPoem] = useState<Poem | null>(null);

    useEffect(() => {
        if (id) {
            const foundPoem = getPoemById(id as string);
            if (foundPoem) {
                setPoem(foundPoem);
            } else {
                // Handle poem not found, maybe redirect or show a message
                router.push('/library');
            }
        }
    }, [id, getPoemById, router]);

    if (!poem) {
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
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Library
                    </Button>
                    <Card className="overflow-hidden shadow-lg">
                        <div className="grid md:grid-cols-2">
                            <div className="relative aspect-square md:aspect-auto">
                                <Image src={poem.image.imageUrl} alt={poem.image.description} layout="fill" objectFit="cover" />
                            </div>
                            <div className="flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-3xl font-bold font-headline text-primary mb-4">{poem.title}</h2>
                                    <p className="whitespace-pre-wrap text-base leading-relaxed font-serif flex-1">
                                        {poem.poem}
                                    </p>
                                    <div className="flex items-center gap-2 pt-6 mt-auto">
                                      <Button disabled><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                      <Button variant="outline" disabled><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
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
