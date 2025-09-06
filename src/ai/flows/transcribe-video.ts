'use server';

/**
 * @fileOverview Transcribes audio from a video file.
 *
 * - transcribeVideo - A function that takes a video and returns the transcript.
 * - TranscribeVideoInput - The input type for the transcribeVideo function.
 * - TranscribeVideoOutput - The return type for the transcribeVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranscribeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a meeting, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeVideoInput = z.infer<typeof TranscribeVideoInputSchema>;

const TranscribeVideoOutputSchema = z.object({
  transcript: z.string().describe('The transcription of the video.'),
});
export type TranscribeVideoOutput = z.infer<typeof TranscribeVideoOutputSchema>;

export async function transcribeVideo(
  input: TranscribeVideoInput
): Promise<TranscribeVideoOutput> {
  const transcribeVideoFlow = ai.defineFlow(
    {
      name: 'transcribeVideoFlow',
      inputSchema: TranscribeVideoInputSchema,
      outputSchema: TranscribeVideoOutputSchema,
    },
    async ({ videoDataUri }) => {
      const model = ai.model('googleai/gemini-2.5-flash');

      const result = await ai.generate({
        model,
        prompt: [
          {
            media: {
              url: videoDataUri,
            },
          },
          {
            text: 'Transcribe the audio from this video. Only return the transcribed text.',
          },
        ],
      });

      const transcript = result.text;

      return { transcript };
    }
  );

  return transcribeVideoFlow(input);
}
