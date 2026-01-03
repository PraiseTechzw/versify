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
import { Wand2, Hash, Menu, Sparkles, ChevronRight, ChevronLeft, X, Zap } from "lucide-react"
import Image from "next/image"
import { useLibrary } from "@/context/LibraryContext"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet"
import { VersifyLogo } from "../ui/versify-logo"

export type CreativeControlsState = {
  poetryStyle: string
  tone: string
  length: string
  literalVsSymbolic: string
  narrative: string
  keywordEmphasis: string
}

const defaultControls: CreativeControlsState = {
  poetryStyle: "Free Verse",
  tone: "Neutral",
  length: "Medium",
  literalVsSymbolic: "Balanced",
  narrative: "Descriptive",
  keywordEmphasis: "",
}

export default function VersifyClient() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [poemResult, setPoemResult] = useState<GeneratePoemFromImageOutput | null>(null)
  const [controls, setControls] = useState<CreativeControlsState>(defaultControls)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [trialUsed, setTrialUsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { toast } = useToast()
  const { poemForEditing, clearPoemForEditing } = useLibrary()
  const { user, loading: userLoading } = useSupabaseUser()

  const isUserLoggedIn = !userLoading && !!user?.id

  useEffect(() => {
    setIsMounted(true)

    if (isUserLoggedIn) {
      setTrialUsed(false)
      localStorage.removeItem("versify-trial-used")
    } else if (!userLoading) {
      const trialUsedStorage = localStorage.getItem("versify-trial-used")
      if (trialUsedStorage === "true") {
        setTrialUsed(true)
      }
    }
  }, [isUserLoggedIn, userLoading])

  useEffect(() => {
    if (!isMounted || !poemForEditing) return

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

  useEffect(() => {
    if (!isMounted) return
    
    try {
      const session = { imageDataUrl, poemResult, controls }
      localStorage.setItem("versify-session", JSON.stringify(session))
    } catch (error) {
      // Silent fail
    }
  }, [imageDataUrl, poemResult, controls, isMounted])

  const handleImageUpload = useCallback((url: string) => {
    setImageDataUrl(url)
    
    if (!url) {
      setPoemResult(null)
      setCurrentStep(1)
    } else {
      setCurrentStep(2)
    }
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!imageDataUrl) {
      toast({ title: "Please upload an image first.", variant: "destructive" })
      return
    }

    if (!isUserLoggedIn && trialUsed) {
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

    setIsLoading(true)
    
    try {
      const result = await generatePoemFromImage({
        photoDataUri: imageDataUrl,
        ...controls,
      })
      
      setPoemResult(result)
      setIsSidebarOpen(false)

      if (!isUserLoggedIn) {
        setTrialUsed(true)
        localStorage.setItem("versify-trial-used", "true")
      }
    } catch (error: any) {
      let title = "Failed to generate poem"
      let description = "An unexpected error occurred. Please try again."

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
      setIsLoading(false)
    }
  }, [imageDataUrl, isUserLoggedIn, trialUsed, controls, toast])

  const SidebarContent = useCallback(() => (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-card/95 via-card to-background/50 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Sidebar Header */}
      <div className="p-6 border-b border-border/50 flex-shrink-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-xl relative">
        <div className="flex items-center gap-4 mb-5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-primary/30 to-primary/10 p-3.5 rounded-2xl shadow-2xl border border-primary/30 group-hover:scale-110 transition-transform duration-500">
              <VersifyLogo size={48} theme="auto" className="text-primary relative z-10" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent font-headline mb-0.5 tracking-tight">
              Versify
            </h1>
            <p className="text-xs text-muted-foreground/90 font-medium">Powered by AI Poetry Magic ✨</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 rounded-xl border border-primary/30 shadow-lg mb-5 backdrop-blur-sm group hover:shadow-xl hover:border-primary/40 transition-all duration-500">
          <div className="p-1.5 bg-primary/20 rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" style={{ animationDuration: '2s' }} />
          </div>
          <p className="text-xs text-foreground font-semibold tracking-wide">Transform images into poetry</p>
        </div>

        {!isUserLoggedIn && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-5 transition-all duration-500 hover:shadow-xl relative overflow-hidden ${
              trialUsed
                ? "bg-gradient-to-r from-destructive/20 via-destructive/15 to-destructive/10 border-destructive/40"
                : "bg-gradient-to-r from-green-100/60 to-emerald-50/40 dark:from-green-950/40 dark:to-emerald-900/30 border-green-400/60 dark:border-green-700/60"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} />
            {trialUsed ? (
              <>
                <div className="p-1.5 bg-destructive/20 rounded-lg">
                  <X className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-xs text-destructive font-bold tracking-wide">Trial complete • Sign up now!</p>
              </>
            ) : (
              <>
                <div className="p-1.5 bg-green-500/20 rounded-lg">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 font-bold tracking-wide">
                  1 free poem • No signup needed!
                </p>
              </>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-500 hover:scale-105 shadow-lg relative overflow-hidden group ${
              currentStep === 1
                ? "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-primary/30 hover:shadow-primary/40"
                : "bg-gradient-to-r from-muted/90 to-muted/70 text-muted-foreground hover:from-muted hover:to-muted/90"
            }`}
            aria-label="Go to step 1: Upload"
          >
            {currentStep === 1 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
            )}
            <span className={`relative flex items-center justify-center w-6 h-6 rounded-full text-xs font-black transition-all duration-500 ${
              currentStep === 1 ? "bg-background/25 ring-2 ring-background/40 shadow-lg" : "bg-background/15"
            }`}>
              1
            </span>
            <span className="relative">Upload</span>
          </button>
          <ChevronRight className={`h-5 w-5 transition-all duration-500 ${
            currentStep === 2 ? "text-primary scale-110" : "text-muted-foreground"
          }`} />
          <button
            type="button"
            onClick={() => imageDataUrl && setCurrentStep(2)}
            disabled={!imageDataUrl}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-500 shadow-lg relative overflow-hidden group ${
              currentStep === 2
                ? "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-primary/30 hover:shadow-primary/40 hover:scale-105"
                : imageDataUrl
                  ? "bg-gradient-to-r from-muted/90 to-muted/70 text-muted-foreground hover:from-muted hover:to-muted/90 hover:scale-105"
                  : "bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
            }`}
            aria-label="Go to step 2: Customize"
          >
            {currentStep === 2 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
            )}
            <span className={`relative flex items-center justify-center w-6 h-6 rounded-full text-xs font-black transition-all duration-500 ${
              currentStep === 2 ? "bg-background/25 ring-2 ring-background/40 shadow-lg" : "bg-background/15"
            }`}>
              2
            </span>
            <span className="relative">Customize</span>
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gradient-to-b from-transparent via-muted/5 to-muted/10 relative"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--primary) / 0.4) transparent'
        }}
      >
        {currentStep === 1 ? (
          <div className="space-y-5 animate-in fade-in-0 slide-in-from-left-8 duration-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-1.5 bg-gradient-to-b from-primary via-primary/80 to-primary/50 rounded-full shadow-lg shadow-primary/50" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Upload Your Image</h3>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageDataUrl} />
            {imageDataUrl && (
              <Button
                onClick={() => setCurrentStep(2)}
                className="w-full mt-6 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all duration-500 hover:scale-[1.03] bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-base font-bold py-6 relative overflow-hidden group"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">Next: Customize Your Poem</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in-0 slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1.5 bg-gradient-to-b from-primary via-primary/80 to-primary/50 rounded-full shadow-lg shadow-primary/50" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Customize & Generate</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="h-9 px-3 hover:bg-muted/80 transition-all duration-300 rounded-lg font-semibold"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
            </div>

            {imageDataUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl mb-6 group hover:border-primary/50 transition-all duration-500 hover:shadow-3xl">
                <Image
                  src={imageDataUrl}
                  alt="Selected image"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  fill
                  sizes="400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setCurrentStep(1)}
                    className="shadow-2xl backdrop-blur-md hover:scale-110 transition-transform duration-300 font-bold"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            )}

            {!isUserLoggedIn && trialUsed ? (
              <div className="text-center py-10 space-y-5 animate-in fade-in-0 zoom-in-95 duration-700">
                <div className="bg-gradient-to-br from-primary/25 via-primary/15 to-transparent p-10 rounded-3xl border-2 border-primary/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} />
                  <div className="relative bg-gradient-to-br from-primary/40 to-primary/20 p-5 rounded-2xl mb-5 mx-auto w-fit shadow-2xl">
                    <Sparkles className="w-14 h-14 text-primary animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">
                    Trial Complete!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs mx-auto">
                    You've created your free poem. Sign up now to unlock unlimited AI poetry generation!
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => (window.location.href = "/signup")} 
                      className="w-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-base font-bold py-6 relative overflow-hidden group" 
                      size="lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                      <span className="relative">Sign Up - Completely Free!</span>
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/login")}
                      variant="outline"
                      className="w-full hover:bg-muted/80 transition-all duration-300 text-base font-semibold py-6 border-2"
                      size="lg"
                    >
                      Already have an account? Login
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
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

  if (!isMounted || userLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="hidden lg:block w-96 xl:w-[28rem] border-r border-border/50 backdrop-blur-sm relative z-10">
          <div className="flex-1 p-6 space-y-8">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl shadow-lg" />
              <div className="space-y-2.5 flex-1">
                <div className="h-7 bg-gradient-to-r from-primary/30 to-primary/20 rounded-lg w-36" />
                <div className="h-4 bg-muted/80 rounded w-44" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl animate-pulse shadow-xl" />
              <div className="h-14 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl animate-pulse shadow-lg" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col relative z-10">
          <Header />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="space-y-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-primary/40 to-primary/20 rounded-full flex items-center justify-center shadow-2xl">
                  <Wand2 className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Loading Versify
                </h3>
                <p className="text-sm text-muted-foreground animate-pulse">Preparing your poetry workspace...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-96 xl:w-[28rem] border-r border-border/50 shadow-2xl backdrop-blur-sm relative z-10">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-md p-0 border-r border-border/50">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-tl from-accent/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <div className="flex items-center h-16 px-4 lg:px-6 bg-card/80 border-b border-border/50 shadow-lg flex-shrink-0 backdrop-blur-xl relative z-20">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden mr-3 hover:bg-primary/10 transition-all duration-300 rounded-lg">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg shadow-lg">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <span className="font-black text-foreground tracking-tight">poem-generator</span>
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-1 hidden sm:block" />
            <span className="text-sm text-muted-foreground font-medium hidden sm:block">
              {!isUserLoggedIn && trialUsed
                ? "✨ Sign up for unlimited poems"
                : !isUserLoggedIn
                  ? "🎉 1 free poem available"
                  : "Create beautiful AI poetry"}
            </span>
          </div>

          <Header />
        </div>

        {/* Trial Banner */}
        {!isUserLoggedIn && trialUsed && (
          <div className="bg-gradient-to-r from-primary/20 via-primary/15 to-accent/15 border-b border-primary/30 flex-shrink-0 backdrop-blur-sm relative z-20 animate-in slide-in-from-top-6 duration-700 shadow-lg">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-primary/30 to-primary/20 rounded-xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-base font-black text-foreground">Your Trial is Complete!</p>
                    <p className="text-xs text-muted-foreground font-medium">Sign up now for unlimited poem generation</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => (window.location.href = "/signup")} 
                    size="sm" 
                    className="text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 px-6"
                  >
                    Sign Up Free
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/login")}
                    variant="outline"
                    size="sm"
                    className="text-sm font-semibold hover:bg-muted/80 transition-all duration-300 border-2"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto relative z-10" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--primary) / 0.4) transparent'
        }}>
          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative">
            {isLoading && !poemResult ? (
              <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in-0 zoom-in-95 duration-700">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-primary/30 to-primary/15 rounded-full flex items-center justify-center shadow-2xl">
                      <Wand2 className="w-16 h-16 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                      Creating Your Poem
                    </h3>
                    <p className="text-base text-muted-foreground font-medium animate-pulse">
                      Our AI is analyzing your image and crafting beautiful poetry...
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.4s' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : poemResult && imageDataUrl ? (
              <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700">
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
                  <div className="max-w-lg w-full space-y-8 animate-in fade-in-0 zoom-in-95 duration-700">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/30 group hover:border-primary/50 transition-all duration-500">
                      <Image
                        src={imageDataUrl}
                        alt="Ready for poem generation"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent tracking-tight">
                        Image Ready for Poetry
                      </h2>
                      <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        Perfect! Now customize your poem settings in the sidebar and let our AI create something magical.
                      </p>
                      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                          <Button 
                            size="lg" 
                            className="lg:hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-lg font-bold py-6 px-8 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Menu className="mr-3 h-6 w-6" />
                            <span className="relative">Open Poetry Controls</span>
                          </Button>
                        </SheetTrigger>
                      </Sheet>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-lg w-full space-y-10 animate-in fade-in-0 zoom-in-95 duration-700">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                      <div className="relative bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 p-12 rounded-full mx-auto w-fit shadow-2xl border border-primary/30">
                        <Wand2 className="w-20 h-20 text-primary animate-pulse" style={{ animationDuration: '2s' }} />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-4xl font-black bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent tracking-tight">
                        Welcome to Versify
                      </h2>
                      <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        Transform any image into beautiful, personalized poetry with the power of AI. 
                        Upload your photo and watch as our advanced AI creates unique verses inspired by your visual story.
                      </p>
                      {!isUserLoggedIn && (
                        <div className="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:from-green-950/40 dark:to-emerald-900/30 rounded-2xl border-2 border-green-300/60 dark:border-green-700/60 shadow-xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} />
                          <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                              <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400 animate-pulse" />
                            </div>
                            <div>
                              <p className="text-lg font-black text-green-800 dark:text-green-200 mb-1">
                                🎉 Free Trial Available!
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                Generate your first poem completely free - no signup required!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                          <Button 
                            size="lg" 
                            className="lg:hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-xl font-bold py-8 px-10 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Sparkles className="mr-3 h-6 w-6 animate-pulse" />
                            <span className="relative">Start Creating Poetry</span>
                          </Button>
                        </SheetTrigger>
                      </Sheet>
                      <div className="pt-8 border-t border-border/50">
                        <p className="text-sm text-muted-foreground font-medium">
                          💡 <span className="font-semibold">Desktop users:</span> Use the sidebar to upload and customize your poetry →
                        </p>
                      </div>
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