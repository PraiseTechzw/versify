'use server';
/**
 * @fileOverview This file defines a Genkit flow that provides insights into the AI's creative process behind a generated poem.
 *
 * This flow analyzes an image and a poem to explain the visual and emotional elements that inspired each line.
 *
 * - `providePoemInspirationInsights`: The main exported function.
 * - `PoemInspirationInsightsInput`: The Zod schema for the input.
 * - `PoemInspirationInsightsOutput`: The Zod schema for the output.
 */

import {ai, executeWithModelFallback} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input required to get inspiration insights.
 */
const PoemInspirationInsightsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  poem: z.string().describe('The generated poem for which insights are needed.'),
});
export type PoemInspirationInsightsInput = z.infer<typeof PoemInspirationInsightsInputSchema>;

/**
 * Defines the schema for the output containing the inspiration insights.
 */
const PoemInspirationInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      line: z.string().describe('A line from the poem.'),
      emotions: z.array(z.string()).describe('Emotions detected in the image that inspired the line.'),
      visualElements: z.array(z.string()).describe('Visual elements detected in the image that inspired the line.'),
    })
  ).describe('Insights into the inspiration behind each line of the poem.'),
  moodVisualization: z.string().describe('A general description of the overall mood conveyed by the image and poem combination.'),
});
export type PoemInspirationInsightsOutput = z.infer<typeof PoemInspirationInsightsOutputSchema>;

/**
 * Provides AI-generated insights into the creative inspiration behind a poem.
 * It analyzes an image and poem to explain the visual and emotional drivers for each line.
 *
 * @param {PoemInspirationInsightsInput} input - The input containing the image data URI and the poem text.
 * @returns {Promise<PoemInspirationInsightsOutput>} A promise that resolves to the detailed insights.
 */
export async function providePoemInspirationInsights(input: PoemInspirationInsightsInput): Promise<PoemInspirationInsightsOutput> {
  return providePoemInspirationInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'poemInspirationInsightsPrompt',
  input: {schema: PoemInspirationInsightsInputSchema},
  output: {schema: PoemInspirationInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes an image and a poem to provide insights into the creative process. Given the image and the poem, you should identify the emotions and visual elements that inspired specific lines of the poem. Also provide a mood visualization for the poem.\n\nImage: {{media url=photoDataUri}}\nPoem: {{{poem}}}\n\nAnalyze the poem, line by line, associating each line with the emotions and visual elements from the image that likely inspired it. Finally, provide a mood visualization.\nOutput the result in JSON format.`,
});

const providePoemInspirationInsightsFlow = ai.defineFlow(
  {
    name: 'providePoemInspirationInsightsFlow',
    inputSchema: PoemInspirationInsightsInputSchema,
    outputSchema: PoemInspirationInsightsOutputSchema,
  },
  async input => {
    return executeWithModelFallback(async (model) => {
      console.log(`Generating insights with model: ${model}`);
      const {output} = await prompt(input, { model });
      return output!;
    });
  }
);
