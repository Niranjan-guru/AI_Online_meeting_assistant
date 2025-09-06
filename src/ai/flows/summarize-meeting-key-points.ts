'use server';
/**
 * @fileOverview Summarizes the key discussion points and decisions of a meeting from its transcription.
 *
 * - summarizeMeetingKeyPoints - A function that takes a meeting transcription and optionally a previous MoM
 *   to generate a concise summary of key discussion points and decisions.
 * - SummarizeMeetingKeyPointsInput - The input type for the summarizeMeetingKeyPoints function.
 * - SummarizeMeetingKeyPointsOutput - The return type for the summarizeMeetingKeyPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingKeyPointsInputSchema = z.object({
  transcription: z
    .string()
    .describe('The transcription of the meeting to summarize.'),
  previousMom: z
    .string()
    .optional()
    .describe('The content of the previous MoM, if available.'),
});
export type SummarizeMeetingKeyPointsInput = z.infer<
  typeof SummarizeMeetingKeyPointsInputSchema
>;

const SummarizeMeetingKeyPointsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the meeting.'),
});
export type SummarizeMeetingKeyPointsOutput = z.infer<
  typeof SummarizeMeetingKeyPointsOutputSchema
>;

export async function summarizeMeetingKeyPoints(
  input: SummarizeMeetingKeyPointsInput
): Promise<SummarizeMeetingKeyPointsOutput> {
  const prompt = ai.definePrompt({
    name: 'summarizeMeetingKeyPointsPrompt',
    input: {schema: SummarizeMeetingKeyPointsInputSchema},
    output: {schema: SummarizeMeetingKeyPointsOutputSchema},
    prompt: `You are an AI assistant specialized in creating meeting minutes.

    Your task is to summarize the key discussion points and decisions from a meeting transcription.
    If a previous MoM is provided, take it as the continuation of the meeting series and update the summary accordingly.

    Transcription: {{{transcription}}}

    {{~#if previousMom}}
    Previous MoM: {{{previousMom}}}
    {{~/if}}

    Please provide a concise summary of the meeting's key discussion points and decisions.
    Focus on the main topics covered and the outcomes achieved.
    The summary should be easily understandable and highlight the most important information.
    `,
  });

  const summarizeMeetingKeyPointsFlow = ai.defineFlow(
    {
      name: 'summarizeMeetingKeyPointsFlow',
      inputSchema: SummarizeMeetingKeyPointsInputSchema,
      outputSchema: SummarizeMeetingKeyPointsOutputSchema,
    },
    async input => {
      const {output} = await prompt(input);
      return output!;
    }
  );

  return summarizeMeetingKeyPointsFlow(input);
}
