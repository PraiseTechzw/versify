"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, ImageIcon, UploadCloud, X, CameraOff, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string) => void
  currentImage: string | null
}

/**
 * Discord-style compact image uploader component.
 */
export default function ImageUploader({ onImageUpload, currentImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    const getCameraPermission = async () => {
      if (!isCameraOpen) {
        if (stream && videoRef.current) {
          stream.getTracks().forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }
        return
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setHasCameraPermission(true)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
        setHasCameraPermission(false)
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        })
      }
    }

    getCameraPermission()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isCameraOpen, toast])

  const compressImage = useCallback((file: File, maxSizeKB: number = 800): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject('Canvas context not available')
        return
      }
      
      const img = document.createElement('img')
      
      img.onerror = () => reject('Failed to load image')
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const maxWidth = 1920
        const maxHeight = 1080
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        // Start with high quality and reduce if needed
        let quality = 0.9
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        
        // Reduce quality until under size limit
        while (dataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) { // 1.37 accounts for base64 overhead
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        
        resolve(dataUrl)
      }
      
      const objectUrl = URL.createObjectURL(file)
      img.src = objectUrl
      
      // Clean up object URL after image loads or errors
      const cleanup = () => URL.revokeObjectURL(objectUrl)
      img.addEventListener('load', cleanup, { once: true })
      img.addEventListener('error', cleanup, { once: true })
    })
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      if (file && file.type.startsWith("image/")) {
        try {
          // Check file size and compress if needed
          const fileSizeKB = file.size / 1024
          let dataUrl: string
          
          if (fileSizeKB > 800) {
            // Show compression message for large files
            toast({
              title: "Compressing image...",
              description: "Large image detected. Optimizing for upload.",
            })
            dataUrl = await compressImage(file, 800)
          } else {
            // For smaller files, just convert to data URL
            dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = (e) => resolve(e.target?.result as string)
              reader.onerror = () => reject('Failed to read file')
              reader.readAsDataURL(file)
            })
          }
          
          onImageUpload(dataUrl)
          setUploadSuccess(true)
          setTimeout(() => setUploadSuccess(false), 2000)
        } catch (error) {
          console.error("Error processing image:", error)
          toast({
            variant: "destructive",
            title: "Image processing failed",
            description: "Could not process the image. Please try a different file.",
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a valid image file (PNG, JPG, or WEBP).",
        })
      }
    },
    [onImageUpload, toast, compressImage],
  )

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClearImage = () => {
    onImageUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setUploadSuccess(false)
  }

  const handlePlaceholderSelect = (image: ImagePlaceholder) => {
    onImageUpload(image.imageUrl)
    setUploadSuccess(true)
    setTimeout(() => setUploadSuccess(false), 2000)
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        const video = videoRef.current
        
        // Set reasonable dimensions for camera capture
        const maxWidth = 1920
        const maxHeight = 1080
        let width = video.videoWidth
        let height = video.videoHeight
        
        // Scale down if too large
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvasRef.current.width = width
        canvasRef.current.height = height
        context.drawImage(video, 0, 0, width, height)
        
        // Compress the captured image
        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8)
        onImageUpload(dataUrl)
        setIsCameraOpen(false)
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 2000)
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Image Upload</h3>
        {uploadSuccess && (
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Check className="h-3 w-3" />
            <span>Uploaded!</span>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "relative group border-2 border-dashed rounded-lg p-3 sm:p-4 text-center transition-all duration-200 cursor-pointer",
          isDragging && "border-primary bg-primary/10",
          !isDragging && !currentImage && "border-border hover:border-primary/50 hover:bg-muted/50",
          currentImage && "p-0 border-solid border-border",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !currentImage && fileInputRef.current?.click()}
      >
        {currentImage ? (
          <div className="relative aspect-video w-full">
            <Image
              src={currentImage || "/placeholder.svg"}
              alt="Uploaded preview"
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="rounded-lg object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleClearImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-4 sm:py-6">
            <div className={cn("transition-all duration-200", isDragging && "scale-110")}>
              <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 hidden sm:block">PNG, JPG, or WEBP</p>
            </div>
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

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs"
        >
          <ImageIcon className="mr-1 h-3 w-3" />
          Upload
        </Button>
        
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Camera className="mr-1 h-3 w-3" />
              Camera
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Camera Capture</DialogTitle>
              <DialogDescription>Center your subject and click capture.</DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/90">
                  <CameraOff className="w-8 h-8 text-destructive mb-2" />
                  <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access in your browser.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <Button size="sm" onClick={handleCapture} disabled={!hasCameraPermission}>
                <Camera className="mr-1 h-3 w-3" />
                Capture
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Plus className="mr-1 h-3 w-3" />
            Choose from Gallery
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Choose an Image</DialogTitle>
            <DialogDescription>Select from our gallery to get started.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4 max-h-[60vh] overflow-y-auto discord-scrollbar">
            {PlaceHolderImages.map((image) => (
              <DialogClose key={image.id} asChild>
                <div
                  className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => handlePlaceholderSelect(image)}
                >
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.description}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-white text-xs p-2 leading-tight">{image.description}</p>
                  </div>
                </div>
              </DialogClose>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}