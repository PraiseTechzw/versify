'use server';
/**
 * @fileOverview AI flow for rewriting a specific line of a poem with AI suggestions.
 *
 * - rewritePoemLineWithAISuggestions - A function that accepts a poem and a line number and returns AI suggestions for rewriting that line.
 * - RewritePoemLineWithAISuggestionsInput - The input type for the rewritePoemLineWithAISuggestions function.
 * - RewritePoemLineWithAISuggestionsOutput - The return type for the rewritePoemLineWithAISuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewritePoemLineWithAISuggestionsInputSchema = z.object({
  poem: z.string().describe('The complete poem as a single string.'),
  lineNumber: z
    .number()
    .int()
    .min(1)
    .describe('The line number in the poem to rewrite (1-indexed).'),
});
export type RewritePoemLineWithAISuggestionsInput = z.infer<
  typeof RewritePoemLineWithAISuggestionsInputSchema
>;

const RewritePoemLineWithAISuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of AI-generated suggestions for rewriting the line.'),
});
export type RewritePoemLineWithAISuggestionsOutput = z.infer<
  typeof RewritePoemLineWithAISuggestionsOutputSchema
>;

export async function rewritePoemLineWithAISuggestions(
  input: RewritePoemLineWithAISuggestionsInput
): Promise<RewritePoemLineWithAISuggestionsOutput> {
  return rewritePoemLineWithAISuggestionsFlow(input);
}

const rewritePoemLinePrompt = ai.definePrompt({
  name: 'rewritePoemLinePrompt',
  input: {schema: RewritePoemLineWithAISuggestionsInputSchema},
  output: {schema: RewritePoemLineWithAISuggestionsOutputSchema},
  prompt: `You are a expert poet, skilled at improving existing poems.

  The user will provide a poem and a line number.  You will provide 3 alternative rewrites for the line, attempting to keep the meaning and tone of the original line.  The rewrites should be creative and interesting.

  Poem:
  {{poem}}

  Line Number: {{lineNumber}}

  Suggestions:
  `,
});

const rewritePoemLineWithAISuggestionsFlow = ai.defineFlow(
  {
    name: 'rewritePoemLineWithAISuggestionsFlow',
    inputSchema: RewritePoemLineWithAISuggestionsInputSchema,
    outputSchema: RewritePoemLineWithAISuggestionsOutputSchema,
  },
  async input => {
    const {output} = await rewritePoemLinePrompt(input);
    return output!;
  }
);
