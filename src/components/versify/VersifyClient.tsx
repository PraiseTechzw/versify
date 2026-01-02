"use client"

import { useState, useEffect } from "react"
import type { GeneratePoemFromImageOutput } from "@/ai/flows/generate-poem-from-image"
import { useToast } from "@/hooks/use-toast"
import { generatePoemFromImage } from "@/ai/flows/generate-poem-from-image"
import ImageUploader from "@/components/versify/ImageUploader"
import CreativeControls from "@/components/versify/CreativeControls"
import PoemDisplay from "@/components/versify/PoemDisplay"
import PoemSkeleton from "./PoemSkeleton"
import Header from "./Header"
import { Wand2, Hash, Menu, Sparkles, ChevronRight, ChevronLeft, X } from "lucide-react"
import Image from "next/image"
import { useLibrary } from "@/context/LibraryContext"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { VersifyLogo } from "../ui/versify-logo"

/**
 * @type {CreativeControlsState}
 * Defines the state for the various creative controls available for poem generation.
 */
export type CreativeControlsState = {
  poetryStyle: string
  tone: string
  length: string
  literalVsSymbolic: string
  narrative: string
  keywordEmphasis: string
}

/**
 * The default state for the creative controls.
 */
const defaultControls: CreativeControlsState = {
  poetryStyle: "Free Verse",
  tone: "Neutral",
  length: "Medium",
  literalVsSymbolic: "Balanced",
  narrative: "Descriptive",
  keywordEmphasis: "",
}

/**
 * Discord-style main client component with responsive design.
 */
export default function VersifyClient() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [poemResult, setPoemResult] = useState<GeneratePoemFromImageOutput | null>(null)
  const [controls, setControls] = useState<CreativeControlsState>(defaultControls)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [trialUsed, setTrialUsed] = useState(false)
  const { toast } = useToast()
  const { poemForEditing, clearPoemForEditing } = useLibrary()
  const { user, loading: userLoading } = useSupabaseUser()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if trial has been used for non-logged-in users
    if (!userLoading && !user) {
      const trialUsedStorage = localStorage.getItem("versify-trial-used")
      if (trialUsedStorage === "true") {
        setTrialUsed(true)
      }
    } else if (!userLoading && user) {
      // Reset trial for logged-in users
      setTrialUsed(false)
      localStorage.removeItem("versify-trial-used")
    }
  }, [user, userLoading])

  useEffect(() => {
    if (!isMounted) return
    if (poemForEditing) {
      if (!user || user.id !== poemForEditing.userId) {
        toast({
          title: "Cannot edit poem",
          description: "You can only edit your own poems.",
          variant: "destructive",
        })
        clearPoemForEditing()
        return
      }
      const sessionData = {
        imageDataUrl: poemForEditing.image.imageUrl,
        poemResult: {
          title: poemForEditing.title,
          poem: poemForEditing.poem,
          emotions: [],
          visualElements: [],
        },
        controls: poemForEditing.controls || defaultControls,
      }

      setImageDataUrl(sessionData.imageDataUrl)
      setPoemResult(sessionData.poemResult)
      setControls(sessionData.controls)
      setCurrentStep(2)
      localStorage.setItem("versify-session", JSON.stringify(sessionData))

      clearPoemForEditing()
      toast({
        title: "Editing Poem",
        description: `Loaded "${poemForEditing.title}" into the editor.`,
      })
    }
  }, [poemForEditing, clearPoemForEditing, toast, user, isMounted])

  useEffect(() => {
    if (!isMounted) return
    try {
      const session = { imageDataUrl, poemResult, controls }
      localStorage.setItem("versify-session", JSON.stringify(session))
    } catch (error) {
      console.error("Failed to save session to localStorage", error)
    }
  }, [imageDataUrl, poemResult, controls, isMounted])

  const handleGenerate = async () => {
    if (!imageDataUrl) {
      toast({ title: "Please upload an image first.", variant: "destructive" })
      return
    }

    // Check trial limit for non-logged-in users
    if (!userLoading && !user && trialUsed) {
      toast({
        title: "Trial limit reached",
        description: "Sign up to continue generating unlimited poems!",
        variant: "destructive",
      })
      // Redirect to signup after a short delay
      setTimeout(() => {
        window.location.href = "/signup"
      }, 2000)
      return
    }

    setIsLoading(true)
    try {
      const result = await generatePoemFromImage({
        photoDataUri: imageDataUrl,
        ...controls,
      })
      setPoemResult(result)
      setIsSidebarOpen(false)

      // Mark trial as used for non-logged-in users
      if (!userLoading && !user) {
        setTrialUsed(true)
        localStorage.setItem("versify-trial-used", "true")
      }
    } catch (error: any) {
      console.error("Poem generation error:", error)
      
      let title = "Failed to generate poem"
      let description = "An unexpected error occurred. Please try again."
      
      // Handle specific error types
      if (error?.code === 429 || error?.status === 'RESOURCE_EXHAUSTED') {
        title = "Service temporarily busy"
        description = "Our AI service is experiencing high demand. Please try again in a few moments."
      } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
        title = "Rate limit reached"
        description = "Please wait a moment before generating another poem."
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        title = "Connection error"
        description = "Please check your internet connection and try again."
      } else if (error?.message?.includes('All models exhausted')) {
        title = "Service unavailable"
        description = "All AI models are currently busy. Please try again later."
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (url: string) => {
    console.log("VersifyClient: handleImageUpload called with:", url)
    setImageDataUrl(url)
    if (!url) {
      setPoemResult(null)
      setCurrentStep(1)
      console.log("VersifyClient: Image cleared, step set to 1")
    } else {
      setCurrentStep(2)
      console.log("VersifyClient: Image uploaded, step set to 2")
    }
  }

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full bg-card">
      {/* Sidebar Header - Fixed */}
      <div className="p-6 border-b border-border flex-shrink-0 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-primary/20 p-4 rounded-xl shadow-lg">
            <VersifyLogo size={64} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary font-headline">Versify</h1>
            <p className="text-xs text-muted-foreground">AI Poetry Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs text-foreground font-medium">Transform images into poetry</p>
        </div>

        {/* Trial Status for Non-Logged-In Users */}
        {!userLoading && !user && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            trialUsed 
              ? "bg-destructive/10 border-destructive/20" 
              : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
          }`}>
            {trialUsed ? (
              <>
                <X className="h-4 w-4 text-destructive" />
                <p className="text-xs text-destructive font-medium">Trial used - Sign up for more!</p>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Free trial: 1 poem remaining</p>
              </>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentStep === 1
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background/20 text-xs font-bold">
              1
            </span>
            Upload
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => imageDataUrl && setCurrentStep(2)}
            disabled={!imageDataUrl}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentStep === 2
                ? "bg-primary text-primary-foreground shadow-sm"
                : imageDataUrl
                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background/20 text-xs font-bold">
              2
            </span>
            Customize
          </button>
        </div>
      </div>

      {/* Sidebar Content - No scrollbar needed now */}
      <div className="flex-1 p-6 overflow-hidden">
        {currentStep === 1 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Upload Image</h3>
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageDataUrl} />
            {imageDataUrl && (
              <Button
                onClick={() => setCurrentStep(2)}
                className="w-full mt-4"
                size="lg"
              >
                Next: Customize
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Customize & Generate</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            
            {imageDataUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm mb-4">
                <Image
                  src={imageDataUrl}
                  alt="Selected image"
                  className="object-cover"
                  fill
                  sizes="400px"
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--border)) transparent'
            }}>
              {!userLoading && !user && trialUsed ? (
                <div className="text-center py-8 space-y-4">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-xl">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Trial Complete!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You've used your free poem generation. Sign up to create unlimited poems!
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => window.location.href = "/signup"}
                        className="w-full"
                        size="sm"
                      >
                        Sign Up - It's Free!
                      </Button>
                      <Button 
                        onClick={() => window.location.href = "/login"}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Already have an account?
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <CreativeControls
                  controls={controls}
                  setControls={setControls}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (!isMounted || userLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden lg:block w-96 xl:w-[28rem] border-r border-border">
          <div className="flex-1 p-4">
            <PoemSkeleton />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6">
            <PoemSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile, larger on desktop */}
      <div className="hidden lg:block w-96 xl:w-[28rem] border-r border-border shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-md p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with mobile menu button */}
        <div className="flex items-center h-14 px-4 lg:px-6 bg-card border-b border-border shadow-sm">
          {/* Mobile menu button */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden mr-3">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Channel info */}
          <div className="flex items-center gap-3 flex-1">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">poem-generator</span>
            <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {!userLoading && !user && trialUsed 
                ? "Trial complete - Sign up for more!" 
                : !userLoading && !user 
                ? "Free trial: 1 poem remaining"
                : "Create beautiful poems from images"
              }
            </span>
          </div>

          {/* Header controls */}
          <Header />
        </div>
        
        {/* Chat-like Content Area */}
        <div className="flex-1 overflow-y-auto bg-background/50" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--border)) transparent'
        }}>
          {/* Trial Banner for Non-Logged-In Users */}
          {!userLoading && !user && trialUsed && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
              <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Trial Complete!</p>
                      <p className="text-xs text-muted-foreground">Sign up to generate unlimited poems</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.location.href = "/signup"}
                      size="sm"
                      className="text-xs"
                    >
                      Sign Up Free
                    </Button>
                    <Button 
                      onClick={() => window.location.href = "/login"}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {isLoading && !poemResult ? (
              <div className="discord-message">
                <PoemSkeleton />
              </div>
            ) : poemResult && imageDataUrl ? (
              <div className="discord-message">
                <PoemDisplay
                  key={poemResult.poem}
                  poemResult={poemResult}
                  image={imageDataUrl}
                  onRegenerate={handleGenerate}
                  isRegenerating={isLoading}
                  controls={controls}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center text-muted-foreground p-6 lg:p-8">
                {imageDataUrl ? (
                  <div className="discord-message max-w-lg w-full">
                    <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden shadow-lg border border-border">
                      <Image
                        src={imageDataUrl}
                        alt="Ready for poem"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">Image Ready</h2>
                    <p className="text-base mb-6">
                      Customize your poem settings in the sidebar and generate!
                    </p>
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                      <SheetTrigger asChild>
                        <Button size="lg" className="lg:hidden">
                          <Menu className="mr-2 h-5 w-5" />
                          Open Controls
                        </Button>
                      </SheetTrigger>
                    </Sheet>
                  </div>
                ) : (
                  <div className="discord-message max-w-lg w-full">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-full mb-6 mx-auto w-fit shadow-lg">
                      <Wand2 className="w-14 h-14 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Versify</h2>
                    <p className="text-base leading-relaxed mb-8 text-muted-foreground">
                      Upload an image to get started. Our AI will create beautiful poetry inspired by your visual content.
                    </p>
                    {!userLoading && !user && (
                      <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                          🎉 Free Trial: Generate 1 poem without signing up!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Sign up for unlimited poem generation
                        </p>
                      </div>
                    )}
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                      <SheetTrigger asChild>
                        <Button size="lg" className="lg:hidden shadow-md">
                          <Sparkles className="mr-2 h-5 w-5" />
                          Get Started
                        </Button>
                      </SheetTrigger>
                    </Sheet>
                    <div className="mt-8 pt-8 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        On desktop? Use the sidebar to upload and customize →
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}