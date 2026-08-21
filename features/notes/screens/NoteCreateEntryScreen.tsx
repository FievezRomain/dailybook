import { Pressable, Text, View } from 'react-native';
import { FormSheet, Icon, type VascoIconName } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

interface Props { onBack: () => void; onWritten: () => void; onVoice: () => void }

function EntryCard({ icon, title, description, onPress }: { icon: VascoIconName; title: string; description: string; onPress: () => void }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={description} onPress={onPress} style={({ pressed }) => ({ minHeight: 126, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.82 : 1 })}>
    <Icon name={icon} size="lg" color={colors.textPrimary} />
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{title}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{description}</Text>
    </View>
  </Pressable>;
}

export function NoteCreateEntryScreen({ onBack, onWritten, onVoice }: Props) {
  const { colors } = useAppTheme();
  return <FormSheet title="Nouvelle note" onBack={onBack} onClose={onBack} testID="note-create-entry">
    <View style={{ gap: spacing.xs, marginTop: spacing.lg, marginBottom: spacing.lg }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl }}>Comment souhaitez-vous commencer ?</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control }}>Vous pourrez vérifier votre note avant son enregistrement.</Text>
    </View>
    <EntryCard icon="add" title="Créer une note écrite" description="Saisissez et mettez en forme votre note manuellement." onPress={onWritten} />
    <EntryCard icon="microphone" title="Dicter avec l’IA" description="Enregistrez une note vocale puis vérifiez sa transcription." onPress={onVoice} />
  </FormSheet>;
}
