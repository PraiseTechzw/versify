"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect, memo } from "react"
import Image from "next/image"
import { Camera, ImageIcon, UploadCloud, X, CameraOff, Check, Plus, AlertCircle } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string) => void
  currentImage: string | null
}

// Constants for better maintainability
const IMAGE_CONSTRAINTS = {
  MAX_SIZE_KB: 800,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  COMPRESSION_QUALITY: {
    START: 0.9,
    MIN: 0.1,
    STEP: 0.1,
  },
  CAMERA_QUALITY: 0.8,
  BASE64_OVERHEAD: 1.37,
} as const

const ACCEPTED_IMAGE_TYPES = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
} as const

const SUCCESS_DISPLAY_DURATION = 2000

/**
 * Enhanced image uploader with drag & drop, camera, and gallery support
 */
const ImageUploader = memo(function ImageUploader({ onImageUpload, currentImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const { toast } = useToast()

  // Camera management with cleanup
  useEffect(() => {
    const manageCameraStream = async () => {
      if (!isCameraOpen) {
        // Cleanup when camera dialog closes
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
        setHasCameraPermission(null)
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: IMAGE_CONSTRAINTS.MAX_WIDTH },
            height: { ideal: IMAGE_CONSTRAINTS.MAX_HEIGHT }
          } 
        })
        streamRef.current = stream
        setHasCameraPermission(true)
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Camera access error:", error)
        setHasCameraPermission(false)
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        })
      }
    }

    manageCameraStream()

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isCameraOpen, toast])

  /**
   * Compress image to target size while maintaining quality
   */
  const compressImage = useCallback(
    (file: File, maxSizeKB: number = IMAGE_CONSTRAINTS.MAX_SIZE_KB): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        const img = new window.Image()
        const objectUrl = URL.createObjectURL(file)
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('Failed to load image'))
        }
        
        img.onload = () => {
          URL.revokeObjectURL(objectUrl)
          
          // Calculate dimensions maintaining aspect ratio
          let { width, height } = img
          const { MAX_WIDTH, MAX_HEIGHT } = IMAGE_CONSTRAINTS
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width)
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height)
              height = MAX_HEIGHT
            }
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          // Progressive compression
          const { START, MIN, STEP } = IMAGE_CONSTRAINTS.COMPRESSION_QUALITY
          let quality = START
          let dataUrl = canvas.toDataURL('image/jpeg', quality)
          const targetSize = maxSizeKB * 1024 * IMAGE_CONSTRAINTS.BASE64_OVERHEAD
          
          while (dataUrl.length > targetSize && quality > MIN) {
            quality -= STEP
            dataUrl = canvas.toDataURL('image/jpeg', quality)
            setUploadProgress(Math.round((START - quality) / START * 100))
          }
          
          resolve(dataUrl)
        }
        
        img.src = objectUrl
      })
    },
    []
  )

  /**
   * Handle file processing with compression and validation
   */
  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a valid image file (PNG, JPG, or WEBP).",
        })
        return
      }

      setIsProcessing(true)
      setUploadProgress(0)

      try {
        const fileSizeKB = file.size / 1024
        let dataUrl: string
        
        if (fileSizeKB > IMAGE_CONSTRAINTS.MAX_SIZE_KB) {
          toast({
            title: "Optimizing image...",
            description: `Compressing ${Math.round(fileSizeKB)}KB image for optimal performance.`,
          })
          dataUrl = await compressImage(file, IMAGE_CONSTRAINTS.MAX_SIZE_KB)
        } else {
          dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadstart = () => setUploadProgress(25)
            reader.onprogress = (e) => {
              if (e.lengthComputable) {
                setUploadProgress(25 + Math.round((e.loaded / e.total) * 50))
              }
            }
            reader.onload = (e) => {
              setUploadProgress(100)
              resolve(e.target?.result as string)
            }
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsDataURL(file)
          })
        }
        
        onImageUpload(dataUrl)
        setUploadSuccess(true)
        
        toast({
          title: "Upload successful!",
          description: "Your image is ready for poem generation.",
        })
        
        setTimeout(() => {
          setUploadSuccess(false)
          setUploadProgress(0)
        }, SUCCESS_DISPLAY_DURATION)
        
      } catch (error) {
        console.error("Image processing error:", error)
        toast({
          variant: "destructive",
          title: "Processing failed",
          description: error instanceof Error ? error.message : "Could not process the image. Please try again.",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [onImageUpload, toast, compressImage]
  )

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      
      const files = e.dataTransfer.files
      if (files && files[0]) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files[0]) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleClearImage = useCallback(() => {
    onImageUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setUploadSuccess(false)
    setUploadProgress(0)
  }, [onImageUpload])

  const handlePlaceholderSelect = useCallback(
    (image: ImagePlaceholder) => {
      onImageUpload(image.imageUrl)
      setUploadSuccess(true)
      setIsGalleryOpen(false)
      toast({
        title: "Image selected!",
        description: image.description,
      })
      setTimeout(() => setUploadSuccess(false), SUCCESS_DISPLAY_DURATION)
    },
    [onImageUpload, toast]
  )

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    
    const context = canvasRef.current.getContext("2d")
    if (!context) return

    const video = videoRef.current
    let width = video.videoWidth
    let height = video.videoHeight
    
    // Scale to max dimensions
    const { MAX_WIDTH, MAX_HEIGHT } = IMAGE_CONSTRAINTS
    if (width > height) {
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height)
        height = MAX_HEIGHT
      }
    }
    
    canvasRef.current.width = width
    canvasRef.current.height = height
    context.drawImage(video, 0, 0, width, height)
    
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", IMAGE_CONSTRAINTS.CAMERA_QUALITY)
    onImageUpload(dataUrl)
    setIsCameraOpen(false)
    setUploadSuccess(true)
    
    toast({
      title: "Photo captured!",
      description: "Your image is ready for poem generation.",
    })
    
    setTimeout(() => setUploadSuccess(false), SUCCESS_DISPLAY_DURATION)
  }, [onImageUpload, toast])

  const triggerFileInput = useCallback(() => {
    if (!currentImage) {
      fileInputRef.current?.click()
    }
  }, [currentImage])

  return (
    <div className="space-y-3">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Image Upload</h3>
        {uploadSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-green-500 animate-in fade-in-0 slide-in-from-right-2">
            <Check className="h-3.5 w-3.5" />
            <span className="font-medium">Success!</span>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="font-medium">Processing...</span>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "relative group border-2 border-dashed rounded-lg transition-all duration-200",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragging && "border-primary bg-primary/10 scale-[1.02]",
          !isDragging && !currentImage && "border-border",
          currentImage && "p-0 border-solid border-border hover:border-primary/30",
          isProcessing && "pointer-events-none opacity-60",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        aria-label="Upload image area"
      >
        {currentImage ? (
          <div className="relative aspect-video w-full">
            <Image
              src={currentImage}
              alt="Uploaded preview"
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="rounded-lg object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                handleClearImage()
              }}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-6 sm:py-8 px-4 cursor-pointer">
            <div className={cn(
              "transition-transform duration-200",
              isDragging && "scale-110"
            )}>
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-center">
                <span className="font-semibold text-primary">Click to upload</span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground/70 text-center">
                PNG, JPG, or WEBP • Max 800KB recommended
              </p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={Object.keys(ACCEPTED_IMAGE_TYPES).join(',')}
          className="hidden"
          onChange={handleFileSelect}
          disabled={isProcessing}
          aria-label="File input"
        />
      </div>

      {/* Progress bar */}
      {isProcessing && uploadProgress > 0 && (
        <div className="space-y-1 animate-in fade-in-0 slide-in-from-bottom-2">
          <Progress value={uploadProgress} className="h-1.5" />
          <p className="text-xs text-muted-foreground text-center">
            {uploadProgress}% complete
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="text-xs font-medium hover:bg-primary/10 transition-colors"
        >
          <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
          Browse Files
        </Button>
        
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isProcessing}
              className="text-xs font-medium hover:bg-primary/10 transition-colors"
            >
              <Camera className="mr-1.5 h-3.5 w-3.5" />
              Take Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Camera Capture</DialogTitle>
              <DialogDescription>
                Position your subject and click capture when ready.
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
                playsInline
                aria-label="Camera preview"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/95">
                  <CameraOff className="w-12 h-12 text-destructive mb-4" />
                  <Alert variant="destructive" className="max-w-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access in your browser settings to use this feature.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <Button 
                size="sm" 
                onClick={handleCapture} 
                disabled={!hasCameraPermission}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Button */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isProcessing}
            className="w-full text-xs font-medium hover:bg-primary/10 transition-colors"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Choose from Gallery
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
            <DialogDescription>
              Select from our curated collection of inspirational images.
            </DialogDescription>
          </DialogHeader>
          <div 
            className="grid grid-cols-3 gap-3 py-4 max-h-[60vh] overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--border)) transparent'
            }}
          >
            {PlaceHolderImages.map((image) => (
              <button
                key={image.id}
                className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
                onClick={() => handlePlaceholderSelect(image)}
                aria-label={`Select ${image.description}`}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                  <p className="text-white text-xs p-3 leading-snug font-medium">
                    {image.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default ImageUploader