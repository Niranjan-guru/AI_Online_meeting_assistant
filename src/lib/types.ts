export type MoMOutput = {
  summary: string;
  minutesOfMeeting: string;
  actionItems: string;
};

export type StoredMoM = {
  id: string;
  createdAt: string;
  transcription: string;
} & MoMOutput;

export type MeetingGroup = {
  id:string;
  name: string;
  createdAt: string;
  moms: StoredMoM[];
};
