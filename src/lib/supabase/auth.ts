import type { SupabaseClient } from "@supabase/supabase-js"

export interface User {
  id: string
  email?: string
  displayName?: string
  photoURL?: string
  notificationPreferences?: {
    dailyInspiration: boolean
    holidayEvents: boolean
  }
}

/**
 * Sign in with email and password
 */
export async function login(supabase: SupabaseClient, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign in with Google OAuth
 */
export async function loginWithGoogle(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign up with email, password, and display name
 */
export async function signup(supabase: SupabaseClient, email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        full_name: displayName, // This will be used by the trigger
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error

  // The profile will be created automatically by the database trigger
  // But we can also update it manually to ensure the display_name is set correctly
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      display_name: displayName,
      photo_url: null,
      notification_preferences: {
        dailyInspiration: true,
        holidayEvents: true,
      },
    })

    // Don't throw on profile error as the trigger should handle it
    if (profileError) {
      console.warn("Profile creation warning:", profileError)
    }
  }

  return data
}

/**
 * Sign out the current user
 */
export async function logout(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Update user profile
 */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: {
    displayName?: string
    photoURL?: string
    notificationPreferences?: {
      dailyInspiration: boolean
      holidayEvents: boolean
    }
  },
) {
  const updates: any = {}

  if (profile.displayName !== undefined) {
    updates.display_name = profile.displayName
  }
  if (profile.photoURL !== undefined) {
    updates.photo_url = profile.photoURL
  }
  if (profile.notificationPreferences !== undefined) {
    updates.notification_preferences = profile.notificationPreferences
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", userId)

  if (error) throw error

  // Update auth metadata if display name changed
  if (profile.displayName !== undefined) {
    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: profile.displayName },
    })
    if (authError) throw authError
  }
}
