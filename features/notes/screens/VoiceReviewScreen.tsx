import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, RootScreen, TextArea, TextField, TopBar } from '@shared/components/ui';
import { useNoteMutations } from '@hooks/queries/useNotesQuery';
import { VoiceUploadService } from '@services/storage/VoiceUploadService';
import { radii, spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import type { VoiceNoteDraft, VoiceRecording } from '../types';

export interface VoiceReviewScreenProps {
  draft: VoiceNoteDraft;
  recording: VoiceRecording;
  onCancel: () => void;
  onCreated: (noteId?: number) => void;
}

export function VoiceReviewScreen({ draft, recording, onCancel, onCreated }: VoiceReviewScreenProps) {
  const { colors } = useAppTheme();
  const { create } = useNoteMutations();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(draft.title);
  const [transcript, setTranscript] = useState(draft.transcript);

  const createNote = async () => {
    const note = await create.mutateAsync({ titre: title.trim(), note: transcript.trim() });
    VoiceUploadService.deleteLocal(recording.uri);
    onCreated(note.id);
  };

  return (
    <RootScreen scroll={false} header={<TopBar title="Vérifier la transcription" />} bottomBar={null} contentContainerStyle={{ flex: 1, paddingTop: spacing.lg, paddingBottom: spacing.lg }} testID="voice-review-screen">
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32 }}>Transcription</Text>

      <View style={{ minHeight: 430, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, backgroundColor: colors.surface, padding: spacing.md, gap: spacing.md }}>
        {editing ? (
          <>
            <TextField label="Titre" value={title} onChangeText={setTitle} maxLength={120} testID="voice-review-title" />
            <TextArea label="Contenu" value={transcript} onChangeText={setTranscript} maxLength={500} containerStyle={{ flex: 1 }} testID="voice-review-content" />
          </>
        ) : (
          <>
            <View style={{ gap: spacing.xs }}>
              <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>Titre</Text>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 23 }}>{title}</Text>
            </View>
            <View style={{ gap: spacing.xs }}>
              <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>Contenu</Text>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{transcript}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Modifier le texte de la transcription" onPress={() => setEditing(true)} style={{ minHeight: 44, marginTop: 'auto', alignSelf: 'flex-end', justifyContent: 'center', paddingHorizontal: spacing.md }}>
              <Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>Modifier le texte</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={{ marginTop: 'auto', gap: spacing.xs }}>
        <Button label="Créer la note" fullWidth size="large" loading={create.isPending} disabled={!title.trim() || !transcript.trim()} onPress={() => void createNote()} testID="voice-review-create" />
        <Button label="Annuler" variant="ghost" fullWidth onPress={onCancel} />
      </View>
    </RootScreen>
  );
}