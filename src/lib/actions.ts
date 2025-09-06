'use server';

import {
  generateMinutesOfMeeting,
  type GenerateMinutesOfMeetingInput,
  type GenerateMinutesOfMeetingOutput,
} from '@/ai/flows/generate-minutes-of-meeting';
import {
  transcribeVideo,
  type TranscribeVideoInput,
  type TranscribeVideoOutput,
} from '@/ai/flows/transcribe-video';

type MoMActionResult = GenerateMinutesOfMeetingOutput | { error: string };
type TranscriptionActionResult = TranscribeVideoOutput | { error: string };

export async function generateMoMAction(
  input: GenerateMinutesOfMeetingInput
): Promise<MoMActionResult> {
  try {
    const result = await generateMinutesOfMeeting(input);
    return result;
  } catch (error) {
    console.error('Error generating Minutes of Meeting:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred while generating the MoM.' };
  }
}

export async function transcribeVideoAction(
  input: TranscribeVideoInput
): Promise<TranscriptionActionResult> {
  try {
    const result = await transcribeVideo(input);
    return result;
  } catch (error) {
    console.error('Error transcribing video:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred while transcribing the video.' };
  }
}
