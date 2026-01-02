import { createRedisClient, CacheKeys, CacheTTL } from "./redis"
import type { Poem } from "@/context/LibraryContext"
import type { User } from "@/lib/supabase/auth"

/**
 * Cache user poems with automatic expiration.
 */
export async function cacheUserPoems(userId: string, poems: Poem[]) {
  const redis = createRedisClient()
  const key = CacheKeys.userPoems(userId)

  await redis.setex(key, CacheTTL.MEDIUM, JSON.stringify(poems))
}

/**
 * Get cached user poems.
 */
export async function getCachedUserPoems(userId: string): Promise<Poem[] | null> {
  const redis = createRedisClient()
  const key = CacheKeys.userPoems(userId)

  const cached = await redis.get(key)
  return cached ? (JSON.parse(cached as string) as Poem[]) : null
}

/**
 * Cache a single poem.
 */
export async function cachePoem(poem: Poem) {
  const redis = createRedisClient()
  const key = CacheKeys.poem(poem.id)

  await redis.setex(key, CacheTTL.MEDIUM, JSON.stringify(poem))
}

/**
 * Get a cached poem by ID.
 */
export async function getCachedPoem(poemId: string): Promise<Poem | null> {
  const redis = createRedisClient()
  const key = CacheKeys.poem(poemId)

  const cached = await redis.get(key)
  return cached ? (JSON.parse(cached as string) as Poem) : null
}

/**
 * Invalidate cached poems for a user.
 */
export async function invalidateUserPoemsCache(userId: string) {
  const redis = createRedisClient()
  const key = CacheKeys.userPoems(userId)

  await redis.del(key)
}

/**
 * Invalidate a specific cached poem.
 */
export async function invalidatePoemCache(poemId: string) {
  const redis = createRedisClient()
  const key = CacheKeys.poem(poemId)

  await redis.del(key)
}

/**
 * Cache user profile data.
 */
export async function cacheUserProfile(user: User) {
  const redis = createRedisClient()
  const key = CacheKeys.userProfile(user.id)

  await redis.setex(key, CacheTTL.LONG, JSON.stringify(user))
}

/**
 * Get cached user profile.
 */
export async function getCachedUserProfile(userId: string): Promise<User | null> {
  const redis = createRedisClient()
  const key = CacheKeys.userProfile(userId)

  const cached = await redis.get(key)
  return cached ? (JSON.parse(cached as string) as User) : null
}

/**
 * Invalidate user profile cache.
 */
export async function invalidateUserProfileCache(userId: string) {
  const redis = createRedisClient()
  const key = CacheKeys.userProfile(userId)

  await redis.del(key)
}
