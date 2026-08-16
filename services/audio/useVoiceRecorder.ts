import { useEffect } from 'react';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { File } from 'expo-file-system';

import {
  VOICE_NOTE_CONTENT_TYPE,
  VOICE_NOTE_MAX_DURATION_SECONDS,
  VOICE_NOTE_MAX_SIZE_BYTES,
  type VoiceRecording,
} from '@features/notes/types';
import logger from '@services/logs/LoggerService';

export type VoiceRecorderAdapter = {
  durationMillis: number;
  isRecording: boolean;
  requestPermission: () => Promise<boolean>;
  start: () => Promise<void>;
  stop: () => Promise<VoiceRecording>;
  cancel: () => Promise<void>;
};

export function useVoiceRecorder(): VoiceRecorderAdapter {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);

  useEffect(() => () => {
    if (recorder.isRecording) {
      void recorder.stop().catch((error: unknown) => {
        logger.error('Voice recorder cleanup failed', error, {
          feature: 'notes',
          operation: 'record_cleanup',
        });
      });
    }
  }, [recorder]);

  const requestPermission = async (): Promise<boolean> => {
    const permission = await requestRecordingPermissionsAsync();
    return permission.granted;
  };

  const start = async (): Promise<void> => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record({ forDuration: VOICE_NOTE_MAX_DURATION_SECONDS });
  };

  const stop = async (): Promise<VoiceRecording> => {
    try {
      await recorder.stop();
    } finally {
      await setAudioModeAsync({ allowsRecording: false });
    }

    if (!recorder.uri) {
      throw new Error("L'enregistrement audio n'est pas disponible.");
    }

    const file = new File(recorder.uri);
    const durationSeconds = Math.max(1, Math.ceil(recorderState.durationMillis / 1000));
    if (!file.exists || file.size < 1) {
      throw new Error("L'enregistrement audio est vide.");
    }
    if (file.size > VOICE_NOTE_MAX_SIZE_BYTES) {
      file.delete();
      throw new Error("L'enregistrement dépasse la taille autorisée.");
    }

    return {
      uri: recorder.uri,
      durationSeconds,
      sizeBytes: file.size,
      contentType: VOICE_NOTE_CONTENT_TYPE,
    };
  };

  const cancel = async (): Promise<void> => {
    try {
      if (recorder.isRecording) await recorder.stop();
    } finally {
      await setAudioModeAsync({ allowsRecording: false });
      if (recorder.uri) {
        const file = new File(recorder.uri);
        if (file.exists) file.delete();
      }
    }
  };

  return {
    durationMillis: recorderState.durationMillis,
    isRecording: recorderState.isRecording,
    requestPermission,
    start,
    stop,
    cancel,
  };
}