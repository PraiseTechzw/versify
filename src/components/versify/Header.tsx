"use client"

import { Library, Leaf, User, LogIn, Settings, Hash, Users, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ThemeToggle } from "../theme-toggle"
import Link from "next/link"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { logout } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

/**
 * Discord-style header component for the application.
 * Features a clean top bar with channel-like navigation and user controls.
 */
export default function Header() {
  const { user } = useSupabaseUser()
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await logout(supabase)
    router.push("/")
  }

  return (
    <div className="flex items-center gap-2">
      {user && (
        <>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              <span className="hidden md:inline">Library</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Users className="h-4 w-4" />
          </Button>
        </>
      )}

      <ThemeToggle />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="text-xs">
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="sm:hidden">
              <Link href="/library" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                Library
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogIn className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </Button>
      )}
    </div>
  )
}