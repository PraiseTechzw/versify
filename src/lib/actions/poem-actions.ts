'use server'

import { generatePoemTitle } from '@/ai/flows/generate-poem-title'
import { providePoemInspirationInsights, type PoemInspirationInsightsOutput } from '@/ai/flows/provide-poem-inspiration-insights'
import { rewritePoemLineWithAISuggestions } from '@/ai/flows/rewrite-poem-line-with-ai-suggestions'

export async function generatePoemTitleAction(poem: string): Promise<string> {
  try {
    console.log('[generatePoemTitleAction] Starting title generation...')
    const result = await generatePoemTitle({ poem })
    console.log('[generatePoemTitleAction] Title generation successful')
    return result.title
  } catch (error: any) {
    console.error('[generatePoemTitleAction] Error:', error)
    throw new Error('Failed to generate title. Please try again.')
  }
}

export async function providePoemInspirationInsightsAction(poem: string): Promise<PoemInspirationInsightsOutput> {
  try {
    console.log('[providePoemInspirationInsightsAction] Starting insights generation...')
    const result = await providePoemInspirationInsights({ poem })
    console.log('[providePoemInspirationInsightsAction] Insights generation successful')
    return result
  } catch (error: any) {
    console.error('[providePoemInspirationInsightsAction] Error:', error)
    throw new Error('Failed to generate insights. Please try again.')
  }
}

export async function rewritePoemLineAction(originalLine: string, context: string): Promise<string[]> {
  try {
    console.log('[rewritePoemLineAction] Starting line rewrite...')
    const result = await rewritePoemLineWithAISuggestions({ originalLine, context })
    console.log('[rewritePoemLineAction] Line rewrite successful')
    return result.suggestions
  } catch (error: any) {
    console.error('[rewritePoemLineAction] Error:', error)
    throw new Error('Failed to generate suggestions. Please try again.')
  }
}