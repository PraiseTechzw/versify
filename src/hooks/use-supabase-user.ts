"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { User } from "@/lib/supabase/auth"

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: { user: SupabaseUser }) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

    if (profile) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        displayName: profile.display_name,
        photoURL: profile.photo_url,
        notificationPreferences: profile.notification_preferences,
      })
    } else {
      // Fallback if profile doesn't exist
      setUser({
        id: authUser.id,
        email: authUser.email,
        displayName: authUser.user_metadata?.display_name,
        photoURL: authUser.user_metadata?.avatar_url,
      })
    }
  }

  return { user, loading }
}
