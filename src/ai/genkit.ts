import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Define available models in order of preference
export const AVAILABLE_MODELS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.5-flash-lite', 
  'googleai/gemini-3-flash',
  'googleai/gemini-1.5-flash',
  'googleai/gemini-1.5-pro'
] as const;

export const ai = genkit({
  plugins: [googleAI()],
  model: AVAILABLE_MODELS[0], // Default to first model
});

// Model fallback utility
export async function executeWithModelFallback<T>(
  operation: (model: string) => Promise<T>,
  startIndex: number = 0
): Promise<T> {
  for (let i = startIndex; i < AVAILABLE_MODELS.length; i++) {
    const model = AVAILABLE_MODELS[i];
    try {
      console.log(`Attempting with model: ${model}`);
      return await operation(model);
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error?.message || error);
      
      // Check if it's a quota/rate limit error
      const isQuotaError = error?.code === 429 || 
                          error?.status === 'RESOURCE_EXHAUSTED' ||
                          error?.message?.includes('quota') ||
                          error?.message?.includes('rate limit') ||
                          error?.message?.includes('Too Many Requests');
      
      // If it's the last model or not a quota error, throw the error
      if (i === AVAILABLE_MODELS.length - 1 || !isQuotaError) {
        throw error;
      }
      
      // Continue to next model for quota errors
      console.log(`Quota exhausted for ${model}, trying next model...`);
    }
  }
  
  throw new Error('All models exhausted');
}
