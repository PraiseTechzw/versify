import { Index } from "@upstash/vector"

/**
 * Creates an Upstash Vector Search client for poem search functionality.
 * Uses environment variables for configuration.
 */
export function createSearchClient() {
  return new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  })
}

/**
 * Search metadata types for poems
 */
export interface PoemSearchMetadata {
  id: string
  title: string
  userId: string
  collection?: string
  createdAt: string
}
