'use server';

/**
 * @fileOverview Generates Minutes of Meeting (MoM) from a meeting transcription, considering historical MoMs for continuity.
 *
 * - generateMinutesOfMeeting - A function that generates MoM from the provided transcription.
 * - GenerateMinutesOfMeetingInput - The input type for the generateMinutesOfMeeting function.
 * - GenerateMinutesOfMeetingOutput - The return type for the generateMinutesOfMeeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMinutesOfMeetingInputSchema = z.object({
  transcription: z
    .string()
    .describe('The transcription of the online meeting.'),
  previousMom: z
    .string()
    .optional()
    .describe('The content of the previous Minutes of Meeting, if any.'),
});
export type GenerateMinutesOfMeetingInput = z.infer<typeof GenerateMinutesOfMeetingInputSchema>;

const GenerateMinutesOfMeetingOutputSchema = z.object({
  minutesOfMeeting: z.string().describe('The generated Minutes of Meeting document.'),
  actionItems: z.string().describe('A list of identified action items with assigned owners and deadlines.'),
  summary: z.string().describe('A concise summary of the meeting key discussion points and decisions.'),
});
export type GenerateMinutesOfMeetingOutput = z.infer<typeof GenerateMinutesOfMeetingOutputSchema>;

export async function generateMinutesOfMeeting(
  input: GenerateMinutesOfMeetingInput
): Promise<GenerateMinutesOfMeetingOutput> {
  return generateMinutesOfMeetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMinutesOfMeetingPrompt',
  input: {schema: GenerateMinutesOfMeetingInputSchema},
  output: {schema: GenerateMinutesOfMeetingOutputSchema},
  prompt: `You are an AI assistant specialized in generating Minutes of Meeting (MoM) documents from meeting transcriptions.

  Your task is to create a comprehensive MoM, identifying key discussion points, decisions made, and specific action items. If a previous MoM is available, consider it as context and create the new MoM as a continuation, updating existing items where necessary.

  Transcription: {{{transcription}}}

  {{#if previousMom}}
  Previous Minutes of Meeting: {{{previousMom}}}
  {{else}}
  This is the first meeting, so generate the MoM accordingly.
  {{/if}}

  Output the minutes of meeting in a well structured format including:
  - A concise summary of the meeting's key discussion points and decisions.
  - A detailed list of Action Items, including the assigned owner and deadline for each item.

  Ensure that the output is clear, concise, and well-organized for easy readability.

  Follow the output schema strictly, especially the Action Items format.
`,
});

const generateMinutesOfMeetingFlow = ai.defineFlow(
  {
    name: 'generateMinutesOfMeetingFlow',
    inputSchema: GenerateMinutesOfMeetingInputSchema,
    outputSchema: GenerateMinutesOfMeetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
