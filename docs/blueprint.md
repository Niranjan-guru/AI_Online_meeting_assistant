# **App Name**: MinuteAI

## Core Features:

- Transcription Upload/Input: Accepts online meeting transcriptions as input (e.g. text file, direct copy/paste).
- AI-Powered MoM Generation: Uses an LLM to automatically generate Minutes of Meeting (MoM) from the provided transcription, identifying key discussion points, decisions, and action items. Tool considers historical MoMs if available to update existing items.
- Historical MoM Analysis: Stores the MoM locally to keep a record, for use by the LLM when creating the next MoM.
- Action Item Extraction: Identifies and extracts action items with assigned owners and deadlines from the transcript. Action items will appear in their own section, separate from other notes.
- Summary Generation: Generate a concise summary of the meeting's key discussion points and decisions.
- MoM Download: Allows the user to download the generated Minutes of Meeting in a suitable format (e.g., .txt, .md).
- Edit and Refine: Offers a simple editing interface, that permits to refine/edit the extracted or summarized information directly within the app. These edits will persist in the next MoM generated from this group.

## Style Guidelines:

- Primary color: A calm blue (#5DADE2), evoking trust and productivity.
- Background color: A very light gray (#F5F5F5), providing a clean and unobtrusive backdrop.
- Accent color: A warm orange (#F39C12) used sparingly for calls to action and highlighting important elements.
- Body and headline font: 'PT Sans', sans-serif, providing readability and a modern, yet humanist, touch.
- Simple, clear icons to represent different functions (upload, download, edit, etc.).
- A clean, intuitive layout that allows users to easily upload transcripts, view the generated MoM, and download the final document.
- Subtle animations for feedback on actions like uploading, processing, and downloading to enhance user experience without being distracting.