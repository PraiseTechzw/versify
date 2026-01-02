"use client";

import { useState } from 'react';
import type { GeneratePoemFromImageOutput } from '@/ai/flows/generate-poem-from-image';
import { useToast } from "@/hooks/use-toast"
import { generatePoemFromImage } from '@/ai/flows/generate-poem-from-image';
import ImageUploader from '@/components/versify/ImageUploader';
import CreativeControls from '@/components/versify/CreativeControls';
import PoemDisplay from '@/components/versify/PoemDisplay';
import PoemSkeleton from './PoemSkeleton';
import { Card, CardContent } from '../ui/card';
import { Wand2 } from 'lucide-react';
import Image from 'next/image';

export type CreativeControlsState = {
  poetryStyle: string;
  tone: string;
  length: string;
  literalVsSymbolic: string;
  narrative: string;
  keywordEmphasis: string;
};

export default function VersifyClient() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [poemResult, setPoemResult] = useState<GeneratePoemFromImageOutput | null>(null);
  const [controls, setControls] = useState<CreativeControlsState>({
    poetryStyle: 'Free Verse',
    tone: 'Neutral',
    length: 'Medium',
    literalVsSymbolic: 'Balanced',
    narrative: 'Descriptive',
    keywordEmphasis: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!imageDataUrl) {
      toast({ title: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setPoemResult(null);
    try {
      const result = await generatePoemFromImage({
        photoDataUri: imageDataUrl,
        ...controls,
      });
      setPoemResult(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to generate poem.', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 grid md:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 md:p-8">
      <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        <ImageUploader onImageUpload={setImageDataUrl} currentImage={imageDataUrl}/>
        {imageDataUrl && (
          <CreativeControls 
            controls={controls} 
            setControls={setControls} 
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className="md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Card className="h-full w-full shadow-lg">
          <CardContent className="p-6 h-full">
            {isLoading ? (
              <PoemSkeleton />
            ) : poemResult ? (
              <PoemDisplay key={poemResult.poem} poemResult={poemResult} image={imageDataUrl!} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 animate-in fade-in">
                {imageDataUrl ? (
                  <>
                  <div className='relative w-full max-w-xs aspect-square mb-4'>
                     <Image src={imageDataUrl} alt="Ready for poem" className="rounded-lg object-cover" fill/>
                  </div>
                  <h2 className="text-xl font-headline font-semibold text-foreground">Image Ready</h2>
                  <p className="mt-2">Adjust your creative controls and generate a poem.</p>
                  </>
                ) : (
                  <>
                  <Wand2 className="w-16 h-16 mb-4" />
                  <h2 className="text-2xl font-headline font-semibold text-foreground">Your Poem Awaits</h2>
                  <p className="mt-2 max-w-sm">Upload an image and watch as AI weaves its words into poetry, inspired by your visual muse.</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
