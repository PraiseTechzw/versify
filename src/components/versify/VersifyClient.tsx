"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet"
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
 * Main Versify client component with step-based workflow
 */
export default function VersifyClient() {
  // Core state
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [poemResult, setPoemResult] = useState<GeneratePoemFromImageOutput | null>(null)
  const [controls, setControls] = useState<CreativeControlsState>(defaultControls)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [trialUsed, setTrialUsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Hooks
  const { toast } = useToast()
  const { poemForEditing, clearPoemForEditing } = useLibrary()
  const { user, loading: userLoading } = useSupabaseUser()

  // Derived state
  const isUserLoggedIn = !userLoading && !!user?.id

  // Initialize component
  useEffect(() => {
    console.log('🚀 VersifyClient mounted')
    setIsMounted(true)

    // Check trial status
    if (isUserLoggedIn) {
      console.log('✅ User logged in, resetting trial')
      setTrialUsed(false)
      localStorage.removeItem("versify-trial-used")
    } else if (!userLoading) {
      console.log('👤 No user, checking trial status')
      const trialUsedStorage = localStorage.getItem("versify-trial-used")
      if (trialUsedStorage === "true") {
        console.log('⚠️ Trial already used')
        setTrialUsed(true)
      }
    }
  }, [isUserLoggedIn, userLoading])

  // Handle poem editing from library
  useEffect(() => {
    if (!isMounted || !poemForEditing) return

    console.log('📝 Loading poem for editing:', poemForEditing.title)

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
  }, [poemForEditing, user, isMounted, clearPoemForEditing, toast])

  // Save session to localStorage
  useEffect(() => {
    if (!isMounted) return
    
    try {
      const session = { imageDataUrl, poemResult, controls }
      localStorage.setItem("versify-session", JSON.stringify(session))
    } catch (error) {
      console.error("Failed to save session:", error)
    }
  }, [imageDataUrl, poemResult, controls, isMounted])

  // Handle image upload
  const handleImageUpload = useCallback((url: string) => {
    console.log('🖼️ Image upload handler called, URL length:', url.length)
    setImageDataUrl(url)
    
    if (!url) {
      console.log('❌ No URL, resetting state')
      setPoemResult(null)
      setCurrentStep(1)
    } else {
      console.log('✅ Image uploaded, moving to step 2')
      setCurrentStep(2)
    }
  }, [])

  // Handle poem generation
  const handleGenerate = useCallback(async () => {
    console.log('🎨 Generate poem called')
    
    if (!imageDataUrl) {
      console.log('❌ No image data')
      toast({ title: "Please upload an image first.", variant: "destructive" })
      return
    }

    // Check trial limit for non-logged-in users
    if (!isUserLoggedIn && trialUsed) {
      console.log('⚠️ Trial limit reached')
      toast({
        title: "Trial limit reached",
        description: "Sign up to continue generating unlimited poems!",
        variant: "destructive",
      })
      setTimeout(() => {
        window.location.href = "/signup"
      }, 2000)
      return
    }

    console.log('✅ Starting poem generation')
    setIsLoading(true)
    
    try {
      const result = await generatePoemFromImage({
        photoDataUri: imageDataUrl,
        ...controls,
      })
      
      console.log('✅ Poem generated successfully')
      setPoemResult(result)
      setIsSidebarOpen(false)

      // Mark trial as used for non-logged-in users
      if (!isUserLoggedIn) {
        console.log('📝 Marking trial as used')
        setTrialUsed(true)
        localStorage.setItem("versify-trial-used", "true")
      }
    } catch (error: any) {
      console.error("❌ Poem generation error:", error)

      let title = "Failed to generate poem"
      let description = "An unexpected error occurred. Please try again."

      // Handle specific error types
      if (error?.code === 429 || error?.status === "RESOURCE_EXHAUSTED") {
        title = "Service temporarily busy"
        description = "Our AI service is experiencing high demand. Please try again in a few moments."
      } else if (error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
        title = "Rate limit reached"
        description = "Please wait a moment before generating another poem."
      } else if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
        title = "Connection error"
        description = "Please check your internet connection and try again."
      } else if (error?.message?.includes("All models exhausted")) {
        title = "Service unavailable"
        description = "All AI models are currently busy. Please try again later."
      }

      toast({
        title,
        description,
        variant: "destructive",
      })
    } finally {
      console.log('🏁 Generation complete')
      setIsLoading(false)
    }
  }, [imageDataUrl, isUserLoggedIn, trialUsed, controls, toast])

  // Sidebar content component
  const SidebarContent = useCallback(() => (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-card via-card to-card/95">
      {/* Sidebar Header - Fixed */}
      <div className="p-6 border-b border-border/50 flex-shrink-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4 group">
          <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-3 rounded-2xl shadow-lg border border-primary/20 group-hover:scale-105 transition-transform duration-300">
            <VersifyLogo size={48} theme="auto" className="text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-headline">
              Versify
            </h1>
            <p className="text-xs text-muted-foreground/80">AI Poetry Generator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl border border-primary/20 shadow-sm mb-4 backdrop-blur-sm group hover:shadow-md transition-all duration-300">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <p className="text-xs text-foreground font-medium">Transform images into poetry</p>
        </div>

        {/* Trial Status for Non-Logged-In Users */}
        {!isUserLoggedIn && (
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-4 transition-all duration-300 hover:shadow-md ${
              trialUsed
                ? "bg-gradient-to-r from-destructive/15 to-destructive/5 border-destructive/30 shadow-destructive/5"
                : "bg-gradient-to-r from-green-100/50 to-green-50/30 dark:from-green-950/30 dark:to-green-900/20 border-green-300/50 dark:border-green-800/50 shadow-green-500/5"
            }`}
          >
            {trialUsed ? (
              <>
                <X className="h-4 w-4 text-destructive animate-in zoom-in-50 duration-300" />
                <p className="text-xs text-destructive font-semibold">Trial used - Sign up for more!</p>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
                <p className="text-xs text-green-700 dark:text-green-300 font-semibold">
                  Free trial: 1 poem remaining
                </p>
              </>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-105 ${
              currentStep === 1
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted/80 text-muted-foreground hover:bg-muted"
            }`}
            aria-label="Go to step 1: Upload"
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${
              currentStep === 1 ? "bg-background/20 ring-2 ring-background/30" : "bg-background/10"
            }`}>
              1
            </span>
            Upload
          </button>
          <ChevronRight className={`h-4 w-4 transition-colors duration-300 ${
            currentStep === 2 ? "text-primary" : "text-muted-foreground"
          }`} />
          <button
            type="button"
            onClick={() => imageDataUrl && setCurrentStep(2)}
            disabled={!imageDataUrl}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              currentStep === 2
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105"
                : imageDataUrl
                  ? "bg-muted/80 text-muted-foreground hover:bg-muted hover:scale-105"
                  : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
            }`}
            aria-label="Go to step 2: Customize"
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${
              currentStep === 2 ? "bg-background/20 ring-2 ring-background/30" : "bg-background/10"
            }`}>
              2
            </span>
            Customize
          </button>
        </div>
      </div>

      {/* Sidebar Content - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gradient-to-b from-transparent to-muted/5"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--primary) / 0.3) transparent'
        }}
      >
        {currentStep === 1 ? (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-left-8 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Upload Image</h3>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageDataUrl} />
            {imageDataUrl && (
              <Button
                onClick={() => setCurrentStep(2)}
                className="w-full mt-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90"
                size="lg"
              >
                Next: Customize
                <ChevronRight className="ml-2 h-5 w-5 animate-pulse" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Customize & Generate</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="h-8 px-3 hover:bg-muted/80 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            {imageDataUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl mb-6 group hover:border-primary/40 transition-all duration-300">
                <Image
                  src={imageDataUrl}
                  alt="Selected image"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setCurrentStep(1)}
                    className="shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-300"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            )}

            {!isUserLoggedIn && trialUsed ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in-0 zoom-in-95 duration-500">
                <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 rounded-2xl border border-primary/20 shadow-xl">
                  <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-4 rounded-full mb-4 mx-auto w-fit">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Trial Complete!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    You've used your free poem generation. Sign up to create unlimited poems!
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => (window.location.href = "/signup")} 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90" 
                      size="lg"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Sign Up - It's Free!
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/login")}
                      variant="outline"
                      className="w-full hover:bg-muted/50 transition-all duration-300"
                      size="lg"
                    >
                      Already have an account?
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <CreativeControls
                  controls={controls}
                  setControls={setControls}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ), [currentStep, imageDataUrl, isUserLoggedIn, trialUsed, controls, isLoading, handleImageUpload, handleGenerate])

  // Loading state
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-96 xl:w-[28rem] border-r border-border shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-md p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center h-14 px-4 lg:px-6 bg-card border-b border-border shadow-sm flex-shrink-0">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden mr-3">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex items-center gap-3 flex-1">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">poem-generator</span>
            <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {!isUserLoggedIn && trialUsed
                ? "Trial complete - Sign up for more!"
                : !isUserLoggedIn
                  ? "Free trial: 1 poem remaining"
                  : "Create beautiful poems from images"}
            </span>
          </div>

          <Header />
        </div>

        {/* Trial Banner */}
        {!isUserLoggedIn && trialUsed && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border flex-shrink-0">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Trial Complete!</p>
                    <p className="text-xs text-muted-foreground">Sign up to generate unlimited poems</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => (window.location.href = "/signup")} size="sm" className="text-xs">
                    Sign Up Free
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/login")}
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background/50">
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
                  user={user}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 lg:p-8">
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
                    <p className="text-base mb-6 text-muted-foreground">
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
                      Upload an image to get started. Our AI will create beautiful poetry inspired by your visual
                      content.
                    </p>
                    {!isUserLoggedIn && (
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