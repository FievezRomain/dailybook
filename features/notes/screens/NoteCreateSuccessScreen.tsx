import { Text, View } from 'react-native';

import { Button, RootScreen, TopBar } from '@shared/components/ui';
import { spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

export interface NoteCreateSuccessScreenProps {
  onBackToNotes: () => void;
  onViewNote: () => void;
}

export function NoteCreateSuccessScreen({ onBackToNotes, onViewNote }: NoteCreateSuccessScreenProps) {
  const { colors } = useAppTheme();
  return (
    <RootScreen scroll={false} header={<TopBar title="Note créée" />} bottomBar={null} contentContainerStyle={{ flex: 1, alignItems: 'center', paddingTop: 118 }} testID="note-create-success">
      <View style={{ width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}>
        <Text accessibilityLabel="Création réussie" style={{ color: colors.primaryDark, fontFamily: typography.fonts.bold, fontSize: 34 }}>✓</Text>
      </View>
      <Text accessibilityRole="header" style={{ marginTop: spacing.xl, color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: 24, lineHeight: 35 }}>Note enregistrée</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: 19, textAlign: 'center' }}>Elle est maintenant disponible dans vos notes.</Text>
      <View style={{ width: '100%', marginTop: 100, gap: spacing.md }}>
        <Button label="Voir la note" fullWidth size="large" onPress={onViewNote} />
        <Button label="Retour aux notes" fullWidth size="medium" variant="secondary" onPress={onBackToNotes} />
      </View>
    </RootScreen>
  );
}