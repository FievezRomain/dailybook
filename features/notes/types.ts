export type CreateNotePayload = {
  titre: string;
  note: string;
  is_pinned?: boolean;
};

export type UpdateNotePayload = CreateNotePayload & { id: number };

export const VOICE_NOTE_MAX_DURATION_SECONDS = 300;
export const VOICE_NOTE_MAX_SIZE_BYTES = 10 * 1024 * 1024;
export const VOICE_NOTE_CONTENT_TYPE = 'audio/mp4' as const;

export type VoiceRecording = {
  uri: string;
  durationSeconds: number;
  sizeBytes: number;
  contentType: typeof VOICE_NOTE_CONTENT_TYPE;
};

export type VoiceNoteUploadTicket = {
  uploadId: string;
  url: string;
  fields: Record<string, string>;
  expiresIn: number;
};

export type VoiceNoteDraft = {
  title: string;
  transcript: string;
  language: 'fr';
};
