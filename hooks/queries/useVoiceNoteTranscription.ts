import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

import type { VoiceNoteDraft, VoiceRecording } from '@features/notes/types';
import { VoiceNoteService } from '@services/api/VoiceNoteService';
import logger from '@services/logs/LoggerService';
import { VoiceUploadService } from '@services/storage/VoiceUploadService';

export function useVoiceNoteTranscription() {
  return useMutation<VoiceNoteDraft, Error, VoiceRecording>({
    retry: false,
    mutationFn: async (recording) => {
      let uploadId: string | undefined;
      try {
        const ticket = await VoiceNoteService.createUpload(recording);
        uploadId = ticket.uploadId;
        await VoiceUploadService.upload(ticket, recording);
        return await VoiceNoteService.transcribe(uploadId);
      } catch (error) {
        if (uploadId) {
          await VoiceNoteService.cancelUpload(uploadId).catch((cleanupError: unknown) => {
            logger.error('Voice upload cleanup failed', cleanupError, {
              feature: 'notes',
              operation: 'voice_cleanup',
            });
          });
        }
        throw error;
      }
    },
    onMutate: (recording) => {
      logger.breadcrumb('notes', 'voice_transcription_started', {
        durationSeconds: recording.durationSeconds,
        sizeBytes: recording.sizeBytes,
      });
    },
    onError: async (error) => {
      logger.error('Voice transcription failed', error, {
        feature: 'notes',
        operation: 'voice_transcription',
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
  });
}