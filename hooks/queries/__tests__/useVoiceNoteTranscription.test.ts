/** @jest-environment jsdom */
import { act, renderHook, waitFor } from '@testing-library/react';

import type { VoiceNoteUploadTicket, VoiceRecording } from '../../../features/notes/types';
import { VoiceNoteService } from '../../../services/api/VoiceNoteService';
import { VoiceUploadService } from '../../../services/storage/VoiceUploadService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { useVoiceNoteTranscription } from '../useVoiceNoteTranscription';

jest.mock('../../../services/api/VoiceNoteService', () => ({
  VoiceNoteService: {
    createUpload: jest.fn(),
    transcribe: jest.fn(),
    cancelUpload: jest.fn(),
  },
}));
jest.mock('../../../services/storage/VoiceUploadService', () => ({
  VoiceUploadService: {
    upload: jest.fn(),
    deleteLocal: jest.fn(),
  },
}));
jest.mock('@services/logs/LoggerService', () => ({
  __esModule: true,
  default: {
    breadcrumb: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedVoiceNoteService = VoiceNoteService as jest.Mocked<typeof VoiceNoteService>;
const mockedVoiceUploadService = VoiceUploadService as jest.Mocked<typeof VoiceUploadService>;

const recording: VoiceRecording = {
  uri: 'file:///private/voice-note.m4a',
  durationSeconds: 42,
  sizeBytes: 4096,
  contentType: 'audio/mp4',
};

const ticket: VoiceNoteUploadTicket = {
  uploadId: 'opaque-upload-id',
  url: 'https://signed.example/upload',
  fields: { key: 'server-controlled-key' },
  expiresIn: 300,
};

describe('useVoiceNoteTranscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedVoiceNoteService.createUpload.mockResolvedValue(ticket);
    mockedVoiceUploadService.upload.mockResolvedValue();
    mockedVoiceNoteService.transcribe.mockResolvedValue({
      title: 'Observation',
      transcript: 'Texte à vérifier',
      language: 'fr',
    });
  });

  it('uploads and transcribes without deleting the local recording before review', async () => {
    const { result } = renderHook(() => useVoiceNoteTranscription(), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(recording);
    });

    expect(mockedVoiceNoteService.createUpload).toHaveBeenCalledWith(recording);
    expect(mockedVoiceUploadService.upload).toHaveBeenCalledWith(ticket, recording);
    expect(mockedVoiceNoteService.transcribe).toHaveBeenCalledWith(ticket.uploadId);
    expect(mockedVoiceUploadService.deleteLocal).not.toHaveBeenCalled();
  });

  it('cancels the remote upload after a transcription failure and keeps the local recording retryable', async () => {
    mockedVoiceNoteService.transcribe
      .mockRejectedValueOnce(new Error('Transcription unavailable'))
      .mockResolvedValueOnce({ title: 'Retry', transcript: 'Recovered', language: 'fr' });
    mockedVoiceNoteService.cancelUpload.mockResolvedValue();
    const { result } = renderHook(() => useVoiceNoteTranscription(), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(recording)).rejects.toThrow('Transcription unavailable');
    });

    expect(mockedVoiceNoteService.cancelUpload).toHaveBeenCalledWith(ticket.uploadId);
    expect(mockedVoiceUploadService.deleteLocal).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.mutateAsync(recording);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedVoiceUploadService.upload).toHaveBeenCalledTimes(2);
    expect(mockedVoiceNoteService.transcribe).toHaveBeenCalledTimes(2);
  });
});