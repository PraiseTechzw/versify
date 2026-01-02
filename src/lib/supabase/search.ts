import { createSearchClient, type PoemSearchMetadata } from "@/lib/upstash/search"
import type { Poem } from "@/context/LibraryContext"

/**
 * Index a poem in Upstash Vector Search for semantic search capabilities.
 */
export async function indexPoem(poem: Poem) {
  const searchClient = createSearchClient()

  const searchText = `${poem.title} ${poem.poem}`
  const metadata: PoemSearchMetadata = {
    id: poem.id,
    title: poem.title,
    userId: poem.userId!,
    collection: poem.collection || undefined,
    createdAt: poem.createdAt,
  }

  await searchClient.upsert({
    id: poem.id,
    data: searchText,
    metadata,
  })
}

/**
 * Remove a poem from Upstash Vector Search.
 */
export async function removeFromSearchIndex(poemId: string) {
  const searchClient = createSearchClient()
  await searchClient.delete(poemId)
}

/**
 * Search poems using semantic/vector search via Upstash.
 */
export async function semanticSearchPoems(query: string, userId: string, topK = 10) {
  const searchClient = createSearchClient()

  const results = await searchClient.query({
    data: query,
    topK,
    includeMetadata: true,
    filter: `userId = '${userId}'`,
  })

  return results
}
