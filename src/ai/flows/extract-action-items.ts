'use server';

/**
 * @fileOverview Extracts action items from meeting transcripts, identifying tasks, owners, and deadlines.
 *
 * - extractActionItems - A function that extracts action items from meeting transcripts.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActionItemsInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting.'),
});
export type ExtractActionItemsInput = z.infer<typeof ExtractActionItemsInputSchema>;

const ExtractActionItemsOutputSchema = z.object({
  actionItems: z.array(
    z.object({
      task: z.string().describe('The action item task.'),
      owner: z.string().describe('The person responsible for the action item.'),
      deadline: z.string().describe('The deadline for the action item.'),
    })
  ).describe('A list of action items extracted from the transcript.'),
});
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;

export async function extractActionItems(input: ExtractActionItemsInput): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: ExtractActionItemsInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `You are an AI assistant tasked with extracting action items from meeting transcripts.

  Analyze the following transcript and identify all action items, including the task, assigned owner, and deadline.
  Present the action items in a structured format.

  Transcript: {{{transcript}}}

  If no action items are found, return an empty list.
  `,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
