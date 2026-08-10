import { Pressable, Text, View } from 'react-native';
import { FormSheet, Icon, type VascoIconName } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export interface EventCreateEntryScreenProps {
  onBack: () => void;
  onGuided: () => void;
  onAi: () => void;
  onClose?: () => void;
}

function EntryCard({ icon, title, description, onPress }: { icon: VascoIconName; title: string; description: string; onPress: () => void }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={description} onPress={onPress} style={({ pressed }) => ({ minHeight: 126, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.82 : 1 })}><Icon name={icon} size="lg" color={colors.textPrimary} /><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{description}</Text></View></Pressable>;
}

export function EventCreateEntryScreen({ onBack, onGuided, onAi, onClose = onBack }: EventCreateEntryScreenProps) {
  const { colors } = useAppTheme();
  return <FormSheet title="Nouvel événement" onBack={onBack} onClose={onClose} testID="event-create-entry"><View style={{ gap: spacing.xs, marginTop: spacing.lg, marginBottom: spacing.lg }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl, lineHeight: 28 }}>Comment souhaitez-vous commencer ?</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>Vous pourrez vérifier et modifier toutes les informations avant l’enregistrement.</Text></View><EntryCard icon="add" title="Création guidée" description="Quelques étapes simples, avec une aide à chaque décision." onPress={onGuided} /><EntryCard icon="more" title="Décrire avec l’IA" description="Écrivez naturellement, puis validez les informations détectées." onPress={onAi} /><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, paddingHorizontal: spacing.md }}>Exemple : « Vaccin de Milo mardi à 9 h chez le vétérinaire ».</Text></FormSheet>;
}
