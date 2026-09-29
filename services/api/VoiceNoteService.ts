import type {
  VoiceNoteDraft,
  VoiceNoteUploadTicket,
  VoiceRecording,
} from '@features/notes/types';

import httpClient from './httpClient';

const TRANSCRIPTION_TIMEOUT_MS = 60_000;

export const VoiceNoteService = {
  async createUpload(recording: VoiceRecording): Promise<VoiceNoteUploadTicket> {
    const response = await httpClient.post<VoiceNoteUploadTicket>('/notes/voice/uploads', {
      contentType: recording.contentType,
      durationSeconds: recording.durationSeconds,
      sizeBytes: recording.sizeBytes,
    });
    return response.data;
  },

  async transcribe(uploadId: string): Promise<VoiceNoteDraft> {
    const response = await httpClient.post<VoiceNoteDraft>(
      '/notes/voice/transcriptions',
      { uploadId, language: 'fr' },
      { timeout: TRANSCRIPTION_TIMEOUT_MS },
    );
    return response.data;
  },

  async cancelUpload(uploadId: string): Promise<void> {
    await httpClient.delete(`/notes/voice/uploads/${encodeURIComponent(uploadId)}`);
  },
};