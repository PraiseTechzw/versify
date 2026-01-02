import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash', // Default model
});

// Available Gemini models with their configurations
export const AVAILABLE_MODELS = [
  {
    name: 'googleai/gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    maxRequests: 20,
    resetInterval: 60000, // 1 minute
  },
  {
    name: 'googleai/gemini-2.5-flash-lite',
    displayName: 'Gemini 2.5 Flash Lite',
    maxRequests: 20,
    resetInterval: 60000, // 1 minute
  },
  {
    name: 'googleai/gemini-2.5-flash-tts',
    displayName: 'Gemini 2.5 Flash TTS',
    maxRequests: 10,
    resetInterval: 60000, // 1 minute
  },
  {
    name: 'googleai/gemini-3-flash',
    displayName: 'Gemini 3 Flash',
    maxRequests: 20,
    resetInterval: 60000, // 1 minute
  },
] as const;

// Model usage tracking
const modelUsage = new Map<string, { count: number; lastReset: number }>();

/**
 * Get the next available model based on usage limits
 */
export function getAvailableModel(): string {
  const now = Date.now();
  
  for (const model of AVAILABLE_MODELS) {
    const usage = modelUsage.get(model.name) || { count: 0, lastReset: now };
    
    // Reset counter if interval has passed
    if (now - usage.lastReset >= model.resetInterval) {
      usage.count = 0;
      usage.lastReset = now;
      modelUsage.set(model.name, usage);
    }
    
    // Check if model is available
    if (usage.count < model.maxRequests) {
      return model.name;
    }
  }
  
  // If all models are exhausted, return the first one (will handle rate limit gracefully)
  return AVAILABLE_MODELS[0].name;
}

/**
 * Track model usage
 */
export function trackModelUsage(modelName: string) {
  const now = Date.now();
  const usage = modelUsage.get(modelName) || { count: 0, lastReset: now };
  usage.count++;
  modelUsage.set(modelName, usage);
}

/**
 * Get model usage statistics
 */
export function getModelUsageStats() {
  const stats = [];
  for (const model of AVAILABLE_MODELS) {
    const usage = modelUsage.get(model.name) || { count: 0, lastReset: Date.now() };
    stats.push({
      ...model,
      currentUsage: usage.count,
      available: usage.count < model.maxRequests,
    });
  }
  return stats;
}
