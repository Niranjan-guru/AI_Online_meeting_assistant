import { config } from 'dotenv';
config();

import '@/ai/flows/generate-minutes-of-meeting.ts';
import '@/ai/flows/extract-action-items.ts';
import '@/ai/flows/summarize-meeting-key-points.ts';