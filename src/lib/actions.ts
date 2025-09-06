'use server';

import {
  generateMinutesOfMeeting,
  type GenerateMinutesOfMeetingInput,
  type GenerateMinutesOfMeetingOutput,
} from '@/ai/flows/generate-minutes-of-meeting';

type ActionResult = GenerateMinutesOfMeetingOutput | { error: string };

export async function generateMoMAction(
  input: GenerateMinutesOfMeetingInput
): Promise<ActionResult> {
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
