import { Redis } from "@upstash/redis"

/**
 * Creates an Upstash Redis client for caching and real-time features.
 * Uses environment variables for configuration.
 */
export function createRedisClient() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
}

/**
 * Cache key utilities for consistent caching patterns
 */
export const CacheKeys = {
  userPoems: (userId: string) => `user:${userId}:poems`,
  poem: (poemId: string) => `poem:${poemId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  userNotifications: (userId: string) => `user:${userId}:notifications`,
} as const

/**
 * Cache TTL (Time To Live) constants in seconds
 */
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const
