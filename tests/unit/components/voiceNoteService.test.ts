import type { VoiceRecording } from '../../../features/notes/types';
import httpClient from '../../../services/api/httpClient';
import { VoiceNoteService } from '../../../services/api/VoiceNoteService';

jest.mock('../../../services/api/httpClient');

const mockedHttp = httpClient as jest.Mocked<typeof httpClient>;

const recording: VoiceRecording = {
  uri: 'file:///private/voice-note.m4a',
  durationSeconds: 42,
  sizeBytes: 4096,
  contentType: 'audio/mp4',
};

describe('VoiceNoteService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requests a constrained upload using metadata only', async () => {
    const ticket = {
      uploadId: '15c5034d-06bd-4a53-b86d-1731fd597ba4',
      url: 'https://signed.example/upload',
      fields: { key: 'server-controlled-key' },
      expiresIn: 300,
    };
    mockedHttp.post.mockResolvedValueOnce({ data: ticket } as never);

    await expect(VoiceNoteService.createUpload(recording)).resolves.toEqual(ticket);
    expect(mockedHttp.post).toHaveBeenCalledWith('/notes/voice/uploads', {
      contentType: 'audio/mp4',
      durationSeconds: 42,
      sizeBytes: 4096,
    });
  });

  it('confirms transcription with the opaque upload id', async () => {
    const draft = { title: 'Observation', transcript: 'Texte corrigible', language: 'fr' as const };
    mockedHttp.post.mockResolvedValueOnce({ data: draft } as never);

    await expect(VoiceNoteService.transcribe('opaque-id')).resolves.toEqual(draft);
    expect(mockedHttp.post).toHaveBeenCalledWith(
      '/notes/voice/transcriptions',
      { uploadId: 'opaque-id', language: 'fr' },
      { timeout: 60_000 },
    );
  });

  it('cancels by encoded opaque id', async () => {
    mockedHttp.delete.mockResolvedValueOnce({} as never);

    await VoiceNoteService.cancelUpload('id/with separator');

    expect(mockedHttp.delete).toHaveBeenCalledWith('/notes/voice/uploads/id%2Fwith%20separator');
  });
});