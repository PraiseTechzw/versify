"use client";

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Camera, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface ImageUploaderProps {
  onImageUpload: (dataUrl: string) => void;
  currentImage: string | null;
}

export default function ImageUploader({ onImageUpload, currentImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleClearImage = () => {
    onImageUpload('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handlePlaceholderSelect = (image: ImagePlaceholder) => {
    onImageUpload(image.imageUrl)
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 space-y-4">
        <h2 className="text-lg font-headline font-semibold text-primary">Visual Inspiration</h2>
        <div
          className={cn(
            'relative group border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer hover:border-primary/50 hover:bg-accent/10',
            isDragging && 'border-primary bg-accent/20',
            currentImage && 'p-0 border-solid'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !currentImage && fileInputRef.current?.click()}
        >
          {currentImage ? (
             <div className="relative aspect-video w-full">
                <Image src={currentImage} alt="Uploaded preview" layout="fill" objectFit="cover" className="rounded-md" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleClearImage}>
                    <X className="h-4 w-4" />
                </Button>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-8">
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-accent">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose One
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Choose an Inspiration</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {PlaceHolderImages.map((image) => (
                    <DialogTrigger key={image.id} asChild>
                      <div className="relative aspect-video cursor-pointer group" onClick={() => handlePlaceholderSelect(image)}>
                        <Image src={image.imageUrl} alt={image.description} data-ai-hint={image.imageHint} layout="fill" objectFit="cover" className="rounded-md" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-center text-sm p-2">{image.description}</p>
                        </div>
                      </div>
                    </DialogTrigger>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
