

"use client";

import { useState, useEffect } from 'react';
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
import { useLibrary } from '@/context/LibraryContext';
import { useUser } from '@/firebase';

/**
 * @type {CreativeControlsState}
 * Defines the state for the various creative controls available for poem generation.
 */
export type CreativeControlsState = {
  poetryStyle: string;
  tone: string;
  length: string;
  literalVsSymbolic: string;
  narrative: string;
  keywordEmphasis: string;
};

/**
 * The default state for the creative controls.
 */
const defaultControls: CreativeControlsState = {
  poetryStyle: 'Free Verse',
  tone: 'Neutral',
  length: 'Medium',
  literalVsSymbolic: 'Balanced',
  narrative: 'Descriptive',
  keywordEmphasis: '',
};

/**
 * The main client component for the Versify application.
 * It orchestrates the main user flow: uploading an image, setting creative controls,
 * generating a poem, and displaying the result. It also handles session management
 * to persist the user's work across page loads.
 *
 * @returns {JSX.Element} The rendered VersifyClient component.
 */
export default function VersifyClient() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [poemResult, setPoemResult] = useState<GeneratePoemFromImageOutput | null>(null);
  const [controls, setControls] = useState<CreativeControlsState>(defaultControls);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { poemForEditing, clearPoemForEditing } = useLibrary();
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedSession = localStorage.getItem('versify-session');
      if (savedSession) {
        const { imageDataUrl, poemResult, controls } = JSON.parse(savedSession);
        if (imageDataUrl) setImageDataUrl(imageDataUrl);
        if (poemResult) setPoemResult(poemResult);
        if (controls) setControls(controls);
      }
    } catch (error) {
      console.error("Failed to load session from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (poemForEditing) {
      if (!user || user.uid !== poemForEditing.userId) {
        toast({ title: "Cannot edit poem", description: "You can only edit your own poems.", variant: "destructive" });
        clearPoemForEditing();
        return;
      }
      const sessionData = {
        imageDataUrl: poemForEditing.image.imageUrl,
        poemResult: {
          title: poemForEditing.title,
          poem: poemForEditing.poem,
          emotions: [],
          visualElements: [],
        },
        controls: poemForEditing.controls || defaultControls
      };
      
      setImageDataUrl(sessionData.imageDataUrl);
      setPoemResult(sessionData.poemResult);
      setControls(sessionData.controls);
      localStorage.setItem('versify-session', JSON.stringify(sessionData));

      clearPoemForEditing();
      toast({
        title: "Editing Poem",
        description: `Loaded "${poemForEditing.title}" into the editor.`
      })
    }
  }, [poemForEditing, clearPoemForEditing, toast, user, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
        const session = { imageDataUrl, poemResult, controls };
        localStorage.setItem('versify-session', JSON.stringify(session));
    } catch (error) {
        console.error("Failed to save session to localStorage", error);
    }
  }, [imageDataUrl, poemResult, controls, isMounted]);


  const handleGenerate = async () => {
    if (!imageDataUrl) {
      toast({ title: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
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

  const handleImageUpload = (url: string) => {
    setImageDataUrl(url);
    if (!url) {
      setPoemResult(null);
    }
  };

  if (!isMounted) {
    return (
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 md:p-8">
            <div className="md:col-span-5 lg:col-span-4 xl:col-span-3">
                 <PoemSkeleton />
            </div>
             <div className="md:col-span-7 lg:col-span-8 xl:col-span-9">
                <Card className="h-full w-full shadow-lg border-primary/20">
                    <CardContent className="p-4 sm:p-6 h-full">
                        <PoemSkeleton />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
  }

  return (
    <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 md:p-8">
      <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 animate-in fade-in-0 slide-in-from-left-12 duration-500">
        <ImageUploader onImageUpload={handleImageUpload} currentImage={imageDataUrl}/>
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
        <Card className="h-full w-full shadow-lg border-primary/20">
          <CardContent className="p-4 sm:p-6 h-full">
            {isLoading && !poemResult ? (
              <PoemSkeleton />
            ) : poemResult && imageDataUrl ? (
              <PoemDisplay key={poemResult.poem} poemResult={poemResult} image={imageDataUrl} onRegenerate={handleGenerate} isRegenerating={isLoading} controls={controls} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 animate-in fade-in-0 zoom-in-95 duration-500">
                {imageDataUrl ? (
                  <>
                  <div className='relative w-full max-w-xs aspect-square mb-4 rounded-lg overflow-hidden shadow-lg'>
                     <Image src={imageDataUrl} alt="Ready for poem" className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw"/>
                  </div>
                  <h2 className="text-xl font-headline font-semibold text-foreground">Image Ready</h2>
                  <p className="mt-2">Adjust your creative controls and generate a poem.</p>
                  </>
                ) : (
                  <>
                  <Wand2 className="w-16 h-16 mb-4 text-primary/30" />
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
