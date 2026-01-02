"use client";

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface PoemCardProps {
    poem: {
        title: string;
        poem: string;
        image: ImagePlaceholder;
    };
}

export default function PoemCard({ poem }: PoemCardProps) {
    return (
        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="relative aspect-video w-full">
                <Image src={poem.image.imageUrl} alt={poem.image.description} layout="fill" objectFit="cover" />
            </div>
            <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold text-primary truncate">{poem.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{poem.poem}</p>
            </CardContent>
        </Card>
    );
}
