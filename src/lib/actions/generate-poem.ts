'use server'

import { generatePoemFromImage, type GeneratePoemFromImageInput, type GeneratePoemFromImageOutput } from '@/ai/flows/generate-poem-from-image'

export async function generatePoemAction(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  try {
    console.log('[generatePoemAction] Starting poem generation...')
    const result = await generatePoemFromImage(input)
    console.log('[generatePoemAction] Poem generation successful')
    return result
  } catch (error: any) {
    console.error('[generatePoemAction] Error:', error)
    
    // Re-throw with better error handling
    if (error?.code === 429 || error?.status === 'RESOURCE_EXHAUSTED') {
      throw new Error('Service temporarily busy. Please try again in a few moments.')
    }
    
    if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
      throw new Error('Rate limit reached. Please wait a moment before generating another poem.')
    }
    
    if (error?.message?.includes('All models exhausted')) {
      throw new Error('All AI models are currently busy. Please try again later.')
    }
    
    throw new Error('Failed to generate poem. Please try again.')
  }
}