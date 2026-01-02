"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, UserPlus, Eye, EyeOff, ArrowLeft, Loader2, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { signup, loginWithGoogle } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Password validation
  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { label: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.test(password))
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Please ensure your password meets all requirements.",
      })
      return
    }

    if (!passwordsMatch) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "Please accept the terms of service to continue.",
      })
      return
    }

    setIsLoading(true)
    try {
      await signup(supabase, email, password, displayName)
      toast({ 
        title: "Account created!", 
        description: "Welcome to Versify. Please check your email to verify your account." 
      })
      router.push("/")
    } catch (error: any) {
      console.error("Signup error:", error)
      let description = "Could not create an account. Please try again."
      
      if (error?.message) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          description = "An account with this email already exists. Please sign in instead."
        } else if (error.message.includes("Password") || error.message.includes("password")) {
          description = "Password is too weak. Please choose a stronger password."
        } else if (error.message.includes("Email") || error.message.includes("email")) {
          description = "Please enter a valid email address."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          description = "Network error. Please check your connection and try again."
        } else if (error.message.includes("rate limit")) {
          description = "Too many attempts. Please wait a moment and try again."
        } else {
          // Include the actual error message for debugging
          description = `Registration failed: ${error.message}`
        }
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle(supabase)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "Could not sign up with Google. Please try again.",
      })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 max-w-md mx-auto lg:max-w-none lg:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Versify</span>
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
            <p className="text-muted-foreground">Start your poetic journey with Versify</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your display name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="discord-input"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="discord-input"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="discord-input pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Requirements */}
              {password && (
                <div className="space-y-1 mt-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {req.test(password) ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className={cn(
                        req.test(password) ? "text-green-500" : "text-muted-foreground"
                      )}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "discord-input pr-10",
                    confirmPassword && !passwordsMatch && "border-destructive"
                  )}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full discord-button h-11" 
              disabled={isLoading || !isPasswordValid || !passwordsMatch || !acceptTerms}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              className="w-full h-11" 
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.58 2.22-4.82 2.22-4.14 0-7.5-3.44-7.5-7.6s3.36-7.6 7.5-7.6c2.34 0 3.87.94 4.78 1.84l2.6-2.58C18.14 2.14 15.48 1 12.48 1 7.02 1 3 5.02 3 10.5s4.02 9.5 9.48 9.5c2.82 0 5.26-1.04 7.02-2.72 1.84-1.56 2.68-4.14 2.68-6.62 0-.6-.05-1.16-.14-1.72H12.48z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
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
          src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBwYXRofGVufDB8fHx8MTc2NzMxMzAwMXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="A winding path through a sunlit forest"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed">
              "The best way to find out if you can trust somebody is to trust them."
            </p>
            <footer className="text-sm opacity-80">— Ernest Hemingway</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}