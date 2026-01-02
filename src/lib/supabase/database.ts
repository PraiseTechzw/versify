import type { SupabaseClient } from "@supabase/supabase-js"
import type { Poem } from "@/context/LibraryContext"
import { cachePoem, invalidateUserPoemsCache, invalidatePoemCache } from "@/lib/upstash/cache"
import { indexPoem, removeFromSearchIndex } from "@/lib/supabase/search"

/**
 * Adds a new poem to the Supabase database.
 */
export async function addPoem(
  supabase: SupabaseClient,
  userId: string,
  poemData: Omit<Poem, "id" | "userId" | "createdAt">,
) {
  const { data, error } = await supabase
    .from("poems")
    .insert({
      user_id: userId,
      title: poemData.title,
      poem: poemData.poem,
      image: poemData.image,
      collection: poemData.collection || null,
      controls: poemData.controls || null,
    })
    .select()
    .single()

  if (error) throw error

  const poem = {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    poem: data.poem,
    image: data.image,
    collection: data.collection,
    controls: data.controls,
    createdAt: data.created_at,
  }
  await cachePoem(poem)
  await invalidateUserPoemsCache(userId)

  await indexPoem(poem)

  return data
}

/**
 * Updates an existing poem in the Supabase database.
 */
export async function updatePoem(supabase: SupabaseClient, poemId: string, poemData: Partial<Poem>) {
  const updates: any = {}

  if (poemData.title !== undefined) updates.title = poemData.title
  if (poemData.poem !== undefined) updates.poem = poemData.poem
  if (poemData.image !== undefined) updates.image = poemData.image
  if (poemData.collection !== undefined) updates.collection = poemData.collection
  if (poemData.controls !== undefined) updates.controls = poemData.controls

  const { data, error } = await supabase.from("poems").update(updates).eq("id", poemId).select().single()

  if (error) throw error

  await invalidatePoemCache(poemId)
  if (data.user_id) {
    await invalidateUserPoemsCache(data.user_id)
  }

  const poem = {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    poem: data.poem,
    image: data.image,
    collection: data.collection,
    controls: data.controls,
    createdAt: data.created_at,
  }
  await cachePoem(poem)
  await indexPoem(poem)

  return data
}

/**
 * Deletes a poem from the Supabase database.
 */
export async function deletePoem(supabase: SupabaseClient, poemId: string) {
  const { data: poem } = await supabase.from("poems").select("user_id").eq("id", poemId).single()

  const { error } = await supabase.from("poems").delete().eq("id", poemId)

  if (error) throw error

  await invalidatePoemCache(poemId)
  if (poem?.user_id) {
    await invalidateUserPoemsCache(poem.user_id)
  }
  await removeFromSearchIndex(poemId)
}

/**
 * Fetches all poems for a specific user.
 */
export async function getUserPoems(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

/**
 * Fetches a single poem by ID.
 */
export async function getPoemById(supabase: SupabaseClient, poemId: string) {
  const { data, error } = await supabase.from("poems").select("*").eq("id", poemId).single()

  if (error) throw error
  return data
}

/**
 * Search poems by text content (title and poem body).
 */
export async function searchPoems(supabase: SupabaseClient, userId: string, searchQuery: string) {
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .eq("user_id", userId)
    .or(`title.ilike.%${searchQuery}%,poem.ilike.%${searchQuery}%`)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
