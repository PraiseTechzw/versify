'use server';

/**
 * @fileOverview A flow to generate a title for a poem.
 *
 * - generatePoemTitle - A function that generates a title for a poem.
 * - GeneratePoemTitleInput - The input type for the generatePoemTitle function.
 * - GeneratePoemTitleOutput - The return type for the generatePoemTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemTitleInputSchema = z.object({
  poem: z.string().describe('The poem to generate a title for.'),
});

export type GeneratePoemTitleInput = z.infer<typeof GeneratePoemTitleInputSchema>;

const GeneratePoemTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the poem.'),
});

export type GeneratePoemTitleOutput = z.infer<typeof GeneratePoemTitleOutputSchema>;

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
