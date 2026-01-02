"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setIsEmailSent(true)
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not send reset email. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 max-w-md mx-auto lg:max-w-none lg:mx-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Sign In</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Success State */}
          <div className="text-center space-y-6">
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-headline">Versify</h1>
                <p className="text-sm text-muted-foreground">AI Poetry Generator</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-4">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => {
                  setIsEmailSent(false)
                  setEmail("")
                }}
                variant="outline" 
                className="w-full"
              >
                Try different email
              </Button>
              
              <div className="text-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Hero Image */}
        <div className="hidden lg:flex lg:flex-1 relative bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2V8ZW58MHx8fHwxNjczMzM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Serene mountain lake reflection"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <blockquote className="space-y-4">
              <p className="text-xl font-medium leading-relaxed">
                "The secret to getting ahead is getting started."
              </p>
              <footer className="text-sm opacity-80">— Mark Twain</footer>
            </blockquote>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 max-w-md mx-auto lg:max-w-none lg:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Sign In</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-headline">Versify</h1>
            <p className="text-sm text-muted-foreground">AI Poetry Generator</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Forgot your password?</h2>
            <p className="text-muted-foreground">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="discord-input"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full discord-button h-11" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Email
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="hidden lg:flex lg:flex-1 relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2V8ZW58MHx8fHwxNjczMzM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Serene mountain lake reflection"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed">
              "The secret to getting ahead is getting started."
            </p>
            <footer className="text-sm opacity-80">— Mark Twain</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}