import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, Icon, RootScreen, TopBar } from '@shared/components/ui';
import { useVoiceRecorder } from '@services/audio/useVoiceRecorder';
import { radii, spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import type { VoiceRecording } from '../types';

const waveform = [18, 34, 52, 28, 62, 42, 24, 54, 36, 20, 46, 30, 58, 26, 40, 18];

export interface VoiceRecordingScreenProps {
  onCancel: () => void;
  onRecorded: (recording: VoiceRecording) => void;
}

export function VoiceRecordingScreen({ onCancel, onRecorded }: VoiceRecordingScreenProps) {
  const { colors } = useAppTheme();
  const recorder = useVoiceRecorder();
  const [error, setError] = useState<string>();
  const [finishing, setFinishing] = useState(false);

  const startRecording = async () => {
    setError(undefined);
    const granted = await recorder.requestPermission();
    if (!granted) {
      setError('Autorisez le micro pour enregistrer une note vocale. Vous pouvez aussi revenir et écrire la note.');
      return;
    }
    await recorder.start();
  };

  const finishRecording = async () => {
    setFinishing(true);
    try {
      onRecorded(await recorder.stop());
    } catch {
      setError("Impossible de finaliser l'enregistrement. Réessayez.");
    } finally {
      setFinishing(false);
    }
  };

  const cancelRecording = async () => {
    await recorder.cancel().catch(() => undefined);
    onCancel();
  };

  const seconds = Math.floor(recorder.durationMillis / 1000);
  const elapsed = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <RootScreen
      scroll={false}
      header={<TopBar title="Note vocale" />}
      bottomBar={null}
      contentContainerStyle={{ flex: 1, paddingTop: spacing.xl, paddingBottom: spacing.xl }}
      testID="voice-recording-screen"
    >
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32 }}>Enregistrement</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 19 }}>Parlez naturellement, vous pourrez corriger la transcription.</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', paddingTop: spacing.xl, gap: spacing.lg }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={recorder.isRecording ? 'Enregistrement en cours' : "Commencer l'enregistrement"}
          accessibilityState={{ disabled: recorder.isRecording }}
          disabled={recorder.isRecording}
          onPress={() => void startRecording()}
          testID="voice-record-start"
          style={({ pressed }) => ({
            width: 152,
            height: 152,
            borderRadius: 76,
            borderWidth: 2,
            borderColor: colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <View style={{ width: 132, height: 132, borderRadius: 66, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="microphone" size="xxl" color={colors.primaryDark} />
          </View>
        </Pressable>

        <Text accessibilityRole="timer" accessibilityLabel={`${seconds} secondes`} style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: 28, lineHeight: 41 }}>{elapsed}</Text>

        <View accessible={false} style={{ width: '100%', height: 82, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: spacing.sm }}>
          {waveform.map((height, index) => <View key={`${height}-${index}`} style={{ width: 4, height, borderRadius: 2, backgroundColor: colors.primaryDark, opacity: recorder.isRecording ? 0.75 : 0.28 }} />)}
        </View>
        {error ? <Text accessibilityRole="alert" style={{ color: colors.error, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: 19, textAlign: 'center' }}>{error}</Text> : null}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <Button label="Annuler" variant="secondary" size="medium" onPress={() => void cancelRecording()} style={{ flex: 1 }} />
        <Button label="Terminer" size="medium" disabled={!recorder.isRecording} loading={finishing} onPress={() => void finishRecording()} style={{ flex: 1 }} testID="voice-record-finish" />
      </View>
    </RootScreen>
  );
}