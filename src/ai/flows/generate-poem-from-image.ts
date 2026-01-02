'use server';

/**
 * @fileOverview Generates a poem based on the content of an image.
 *
 * This file defines the Genkit flow for generating a poem and its title from an image.
 * It includes schema definitions for the input and output, the prompt configuration, and the flow itself.
 *
 * - `generatePoemFromImage`: The main function exported to be used in the application.
 * - `GeneratePoemFromImageInput`: The Zod schema for the input parameters.
 * - `GeneratePoemFromImageOutput`: The Zod schema for the output of the generation.
 */

import {ai, getAvailableModel, trackModelUsage} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input required to generate a poem from an image.
 */
const GeneratePoemFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to generate a poem from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  poetryStyle: z.string().optional().describe('The style of poetry to generate.'),
  tone: z.string().optional().describe('The tone of the poem.'),
  length: z.string().optional().describe('The desired length of the poem (e.g., short, medium, long).'),
  literalVsSymbolic: z.string().optional().describe('Whether the poem should be more literal or symbolic.'),
  narrative: z.string().optional().describe('The narrative style of the poem.'),
  keywordEmphasis: z.string().optional().describe('Keywords to emphasize in the poem.'),
});
export type GeneratePoemFromImageInput = z.infer<typeof GeneratePoemFromImageInputSchema>;

/**
 * Defines the schema for the output produced after generating a poem from an image.
 */
const GeneratePoemFromImageOutputSchema = z.object({
  title: z.string().describe('The title of the poem.'),
  poem: z.string().describe('The generated poem.'),
  emotions: z.array(z.string()).optional().describe('The emotions detected in the image.'),
  visualElements: z.array(z.string()).optional().describe('The visual elements detected in the image.'),
});
export type GeneratePoemFromImageOutput = z.infer<typeof GeneratePoemFromImageOutputSchema>;

/**
 * Generates a poem based on an image and a set of creative controls.
 * This is a wrapper around the `generatePoemFromImageFlow`.
 *
 * @param {GeneratePoemFromImageInput} input - The input data for the poem generation, including the image and creative controls.
 * @returns {Promise<GeneratePoemFromImageOutput>} A promise that resolves to the generated poem, title, and analysis.
 */
export async function generatePoemFromImage(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  return generatePoemFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemFromImagePrompt',
  input: {schema: GeneratePoemFromImageInputSchema},
  output: {schema: GeneratePoemFromImageOutputSchema},
  prompt: `You are a poet specializing in creating poems from images.

  Analyze the image and generate a poem that reflects its content, considering objects, colors, and emotions detected in the image.

  Here are some creative controls to consider:
  Poetry Style: {{{poetryStyle}}}
  Tone: {{{tone}}}
  Length: {{{length}}}
  Literal vs Symbolic: {{{literalVsSymbolic}}}
  Narrative: {{{narrative}}}
  Keyword Emphasis: {{{keywordEmphasis}}}

  Image: {{media url=photoDataUri}}

  Return the title of the poem, the poem, the emotions detected in the image, and the visual elements detected in the image.
  The output should be a valid JSON conforming to the GeneratePoemFromImageOutputSchema.
  Ensure that the poem is unique and personalized to the image content.
`,
});

const generatePoemFromImageFlow = ai.defineFlow(
  {
    name: 'generatePoemFromImageFlow',
    inputSchema: GeneratePoemFromImageInputSchema,
    outputSchema: GeneratePoemFromImageOutputSchema,
  },
  async input => {
    const selectedModel = getAvailableModel();
    console.log(`Using model: ${selectedModel}`);
    
    try {
      const {output} = await prompt(input, { model: selectedModel });
      trackModelUsage(selectedModel);
      return output!;
    } catch (error: any) {
      // If rate limited, try with a different model
      if (error.code === 429 || error.status === 'RESOURCE_EXHAUSTED') {
        console.warn(`Rate limit hit for ${selectedModel}, trying alternative model...`);
        
        // Try with a different model
        const fallbackModel = getAvailableModel();
        if (fallbackModel !== selectedModel) {
          try {
            const {output} = await prompt(input, { model: fallbackModel });
            trackModelUsage(fallbackModel);
            return output!;
          } catch (fallbackError) {
            console.error('All models exhausted:', fallbackError);
            throw new Error('All AI models are currently rate limited. Please try again in a few minutes.');
          }
        }
      }
      
      // Re-throw the original error if it's not a rate limit issue
      throw error;
    }
  }
);
