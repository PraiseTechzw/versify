"use client";

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import type { Poem } from '@/context/LibraryContext';
import Link from 'next/link';
import { Button } from '../ui/button';
import { BookMarked, FolderPlus, MoreVertical, Star } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useLibrary } from '@/context/LibraryContext';
import { Badge } from '../ui/badge';

interface PoemCardProps {
    poem: Poem;
}

export default function PoemCard({ poem }: PoemCardProps) {
    const { updatePoemCollection, collections } = useLibrary();

    const handleCollectionChange = (collection: string | null) => {
        updatePoemCollection(poem.id, collection);
    }
    
    return (
        <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group border-transparent hover:border-primary/50">
            <Link href={`/poem/${poem.id}`} className='block'>
                <div className="relative aspect-video w-full">
                    <Image src={poem.image.imageUrl} alt={poem.image.description} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
                </div>
            </Link>
            <CardContent className="p-4 flex-1 flex flex-col">
                <div className='flex justify-between items-start'>
                    <Link href={`/poem/${poem.id}`} className='block flex-1'>
                        <h3 className="font-headline text-lg font-semibold text-primary truncate pr-2">{poem.title}</h3>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 -mr-2 -mt-1 flex-shrink-0">
                                <MoreVertical className='h-4 w-4'/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCollectionChange('Favorites')}>
                                <Star className="mr-2 h-4 w-4" />
                                <span>Add to Favorites</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCollectionChange('Drafts')}>
                                <FolderPlus className="mr-2 h-4 w-4" />
                                <span>Move to Drafts</span>
                            </DropdownMenuItem>
                            {poem.collection && (
                                <DropdownMenuItem onClick={() => handleCollectionChange(null)}>
                                    <BookMarked className="mr-2 h-4 w-4" />
                                    <span>Remove from Collection</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                 <p className="text-sm text-muted-foreground mt-1 line-clamp-3 flex-1">{poem.poem}</p>
                {poem.collection && (
                     <div className="mt-3">
                         <Badge variant="secondary">{poem.collection}</Badge>
                     </div>
                )}
            </CardContent>
        </Card>
    );
}
