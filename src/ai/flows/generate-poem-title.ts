
'use server';

/**
 * @fileOverview A flow to generate a title for a poem.
 *
 * This file defines the Genkit flow for generating a title based on the content of a given poem.
 *
 * - `generatePoemTitle`: The main exported function to be used in the application.
 * - `GeneratePoemTitleInput`: The Zod schema for the input.
 * - `GeneratePoemTitleOutput`: The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for the input required to generate a poem title.
 */
const GeneratePoemTitleInputSchema = z.object({
  poem: z.string().describe('The poem to generate a title for.'),
});

export type GeneratePoemTitleInput = z.infer<typeof GeneratePoemTitleInputSchema>;

/**
 * Defines the schema for the output produced when generating a poem title.
 */
const GeneratePoemTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the poem.'),
});

export type GeneratePoemTitleOutput = z.infer<typeof GeneratePoemTitleOutputSchema>;

/**
 * Generates a title for a given poem.
 *
 * @param {GeneratePoemTitleInput} input - The input object containing the poem.
 * @returns {Promise<GeneratePoemTitleOutput>} A promise that resolves to the generated title.
 */
export async function generatePoemTitle(input: GeneratePoemTitleInput): Promise<GeneratePoemTitleOutput> {
  return generatePoemTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemTitlePrompt',
  input: {schema: GeneratePoemTitleInputSchema},
  output: {schema: GeneratePoemTitleOutputSchema},
  prompt: `Generate a title for the following poem:\n\n{{{poem}}}`,
});

const generatePoemTitleFlow = ai.defineFlow(
  {
    name: 'generatePoemTitleFlow',
    inputSchema: GeneratePoemTitleInputSchema,
    outputSchema: GeneratePoemTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
