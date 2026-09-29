import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { BrandLoader, Button, RootScreen, TopBar } from '@shared/components/ui';
import { useVoiceNoteTranscription } from '@hooks/queries/useVoiceNoteTranscription';
import { spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import type { VoiceNoteDraft, VoiceRecording } from '../types';

export interface VoiceProcessingScreenProps {
  recording: VoiceRecording;
  onCancel: () => void;
  onTranscribed: (draft: VoiceNoteDraft) => void;
}

export function VoiceProcessingScreen({ recording, onCancel, onTranscribed }: VoiceProcessingScreenProps) {
  const { colors } = useAppTheme();
  const transcription = useVoiceNoteTranscription();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    transcription.mutate(recording, { onSuccess: onTranscribed });
  }, [onTranscribed, recording, transcription]);

  return (
    <RootScreen scroll={false} header={<TopBar title="Note vocale" />} bottomBar={null} contentContainerStyle={{ flex: 1, paddingTop: 60 }} testID="voice-processing-screen">
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32 }}>Transcription en cours</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 19 }}>Vasco transforme votre voix en texte...</Text>
      </View>

      <View accessible accessibilityRole="progressbar" accessibilityLabel="Transcription de la note vocale en cours" accessibilityState={{ busy: transcription.isPending }} style={{ alignItems: 'center', paddingTop: 76, gap: spacing.xl }}>
        {transcription.isError ? (
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <Text accessibilityRole="alert" style={{ color: colors.error, fontFamily: typography.fonts.medium, fontSize: typography.sizes.md, lineHeight: 22, textAlign: 'center' }}>La transcription n'a pas abouti. Votre enregistrement est toujours disponible.</Text>
            <Button label="Réessayer" onPress={() => { started.current = true; transcription.mutate(recording, { onSuccess: onTranscribed }); }} />
            <Button label="Annuler" variant="ghost" onPress={onCancel} />
          </View>
        ) : (
          <>
            <BrandLoader size="display" accessibilityLabel="Transcription en cours" />
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 17, textAlign: 'center' }}>Votre enregistrement reste disponible pendant la transcription.</Text>
          </>
        )}
      </View>
    </RootScreen>
  );
}