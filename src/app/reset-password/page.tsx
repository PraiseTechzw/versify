"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Lock, ArrowLeft, Loader2, Eye, EyeOff, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
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

  useEffect(() => {
    // Check if we have the necessary tokens from the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
      })
      router.push('/forgot-password')
    }
  }, [searchParams, router, toast])

  const handleResetPassword = async (e: React.FormEvent) => {
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

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated. You can now sign in.",
      })
      
      router.push('/login')
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not update password. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Reset your password</h2>
            <p className="text-muted-foreground">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
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
                Confirm New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
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

            <Button 
              type="submit" 
              className="w-full discord-button h-11" 
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
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
          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuZXclMjBiZWdpbm5pbmd8ZW58MHx8fHwxNjczMzM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="New beginning - sunrise over mountains"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed">
              "Every moment is a fresh beginning."
            </p>
            <footer className="text-sm opacity-80">— T.S. Eliot</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}