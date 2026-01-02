"use client";

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import type { Poem } from '@/context/LibraryContext';
import Link from 'next/link';
import { Button } from '../ui/button';
import { BookMarked, FolderPlus, MoreVertical, Star, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useLibrary } from '@/context/LibraryContext';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
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

/**
 * @interface PoemCardProps
 * Props for the PoemCard component.
 * @property {Poem} poem - The poem data to display.
 */
interface PoemCardProps {
    poem: Poem;
}

/**
 * A card component to display a summary of a poem in the library.
 * It shows the poem's image, title, and a snippet of its content.
 * It also provides actions like moving to a collection or deleting the poem.
 *
 * @param {PoemCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered PoemCard component.
 */
export default function PoemCard({ poem }: PoemCardProps) {
    const { updatePoemCollection, deletePoem } = useLibrary();
    const { toast } = useToast();

    const handleCollectionChange = (collection: string | null) => {
        updatePoemCollection(poem.id, collection);
        if(collection){
            toast({title: `Moved to ${collection}`})
        } else {
            toast({title: `Removed from collection`})
        }
    }
    
    const handleDelete = async () => {
        await deletePoem(poem.id);
        toast({
            title: "Poem Deleted",
            description: `"${poem.title}" has been removed from your library.`,
        })
    }

    return (
        <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group border hover:border-primary/50">
            <Link href={`/poem/${poem.id}`} className='block overflow-hidden'>
                <div className="relative aspect-video w-full">
                    <Image src={poem.image.imageUrl} alt={poem.image.description} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
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
                            <DropdownMenuSeparator />
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        <span className='text-destructive'>Delete</span>
                                    </DropdownMenuItem>
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
