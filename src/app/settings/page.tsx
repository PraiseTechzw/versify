"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/versify/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  Trash2, 
  Camera, 
  Hash,
  Menu,
  Loader2,
  Check,
  X
} from "lucide-react"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { logout, updateProfile } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const poetryStyles = ["Free Verse", "Haiku", "Sonnet", "Limerick", "Ballad"]

export default function SettingsPage() {
  const { user, loading } = useSupabaseUser()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")

  // Form states
  const [displayName, setDisplayName] = useState("")
  const [defaultStyle, setDefaultStyle] = useState("Free Verse")
  const [dailyInspiration, setDailyInspiration] = useState(false)
  const [holidayEvents, setHolidayEvents] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "")
      const prefs = user.notificationPreferences
      if (prefs) {
        setDailyInspiration(prefs.dailyInspiration || false)
        setHolidayEvents(prefs.holidayEvents || false)
      }
    }
  }, [user])

  const handleSaveChanges = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await updateProfile(supabase, user.id, { displayName })
      setHasChanges(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationChange = async (type: "daily" | "holiday", value: boolean) => {
    if (!user) return

    const newPreferences = {
      dailyInspiration: type === "daily" ? value : dailyInspiration,
      holidayEvents: type === "holiday" ? value : holidayEvents,
    }

    if (type === "daily") setDailyInspiration(value)
    if (type === "holiday") setHolidayEvents(value)

    try {
      await updateProfile(supabase, user.id, { notificationPreferences: newPreferences })
      toast({
        title: "Notification updated",
        description: `${type === "daily" ? "Daily inspiration" : "Holiday events"} ${value ? "enabled" : "disabled"}.`,
      })
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not update notification settings.",
        variant: "destructive",
      })
      if (type === "daily") setDailyInspiration(!value)
      if (type === "holiday") setHolidayEvents(!value)
    }
  }

  const handleLogout = async () => {
    await logout(supabase)
    router.push("/")
  }

  const handleDeleteAccount = async () => {
    await logout(supabase)
    toast({
      title: "Account deleted",
      description: "We're sorry to see you go. Your account has been deleted.",
    })
    router.push("/")
  }

  const sections = [
    { id: "profile", label: "My Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy & Safety", icon: Shield },
  ]

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">settings</span>
        </div>
        <p className="text-xs text-muted-foreground">Manage your account</p>
      </div>
      
      <div className="p-4 space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id)
              setIsSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              activeSection === section.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </button>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden lg:flex w-60 discord-sidebar">
          <SidebarContent />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center h-12 px-4 bg-card border-b border-border">
            <div className="flex items-center gap-2 flex-1">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">settings</span>
            </div>
            <Header />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden lg:flex w-60 discord-sidebar">
          <SidebarContent />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center h-12 px-4 bg-card border-b border-border">
            <div className="flex items-center gap-2 flex-1">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">settings</span>
            </div>
            <Header />
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="discord-message max-w-md text-center">
              <User className="w-12 h-12 mb-4 text-primary/50 mx-auto" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Sign in required</h2>
              <p className="text-sm text-muted-foreground mb-4">You need to be signed in to access settings.</p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">My Account</h2>
              <p className="text-muted-foreground">Manage your profile information and preferences.</p>
            </div>

            <div className="discord-card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-lg">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{user.displayName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">Verified</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value)
                      setHasChanges(true)
                    }}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultStyle">Favorite Poetry Style</Label>
                  <Select value={defaultStyle} onValueChange={setDefaultStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {poetryStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasChanges && (
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">You have unsaved changes</p>
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Notifications</h2>
              <p className="text-muted-foreground">Manage how you receive updates and inspiration.</p>
            </div>

            <div className="discord-card p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Daily Inspiration</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily poem and writing prompt to spark creativity.
                  </p>
                </div>
                <Switch
                  checked={dailyInspiration}
                  onCheckedChange={(checked) => handleNotificationChange("daily", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Holiday & Special Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Get themed poems and special content for holidays and events.
                  </p>
                </div>
                <Switch
                  checked={holidayEvents}
                  onCheckedChange={(checked) => handleNotificationChange("holiday", checked)}
                />
              </div>
            </div>
          </div>
        )

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Appearance</h2>
              <p className="text-muted-foreground">Customize how Versify looks and feels.</p>
            </div>

            <div className="discord-card p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Privacy & Safety</h2>
              <p className="text-muted-foreground">Manage your account security and data.</p>
            </div>

            <div className="discord-card p-6 space-y-4 border-destructive/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    These actions are permanent and cannot be undone.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you absolutely sure? This action cannot be undone. This will permanently 
                        delete your account and remove all your data from our servers, including:
                        <br /><br />
                        • All your saved poems
                        <br />
                        • Your profile information
                        <br />
                        • Your preferences and settings
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleDeleteAccount}
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-60 discord-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0 discord-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center h-12 px-4 bg-card border-b border-border">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden mr-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2 flex-1">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">settings</span>
            <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {sections.find(s => s.id === activeSection)?.label}
            </span>
          </div>
          <Header />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 discord-scrollbar overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}