import { Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Button, FormSheet } from '../../../shared/components/ui';
import { getSelectedAnimalNames } from '../eventCreationUtils';
import { getEventDetailsConfig } from '../eventDetailsConfig';

export interface EventCreateAiReviewScreenProps { onBack: () => void; onEdit: () => void; onContinue: () => void; onClose?: () => void }

export function EventCreateAiReviewScreen({ onBack, onEdit, onContinue, onClose = onBack }: EventCreateAiReviewScreenProps) {
  const { colors } = useAppTheme(); const form = useEventWizardStore((state) => state.formData); const animals = useAnimalsQuery().data ?? []; const names = getSelectedAnimalNames(form.animaux ?? [], animals); const config = getEventDetailsConfig(form.eventType);
  const date = form.dateevent ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${form.dateevent}T12:00:00`)) : 'Date à compléter';
  const missing = [!form.dateevent ? 'La date n’a pas été détectée.' : undefined, !form.nom ? 'L’intitulé reste à vérifier.' : undefined].filter(Boolean).join(' ');
  const footer = <View style={{ gap: spacing.md, paddingHorizontal: spacing.md }}><Button label="Modifier les informations" onPress={onEdit} variant="secondary" fullWidth /><Button label="Confirmer et continuer" onPress={onContinue} size="large" fullWidth /></View>;
  return <FormSheet title="Vérifier les informations" onBack={onBack} onClose={onClose} dirty footer={footer} testID="event-create-ai-review"><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, marginTop: spacing.lg }}>À confirmer avant l’enregistrement</Text><View accessibilityRole="summary" style={{ minHeight: 330, gap: spacing.md, padding: spacing.md, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{config.title} · {form.nom || 'À compléter'}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{date}{form.heuredebutevent ? ` · ${form.heuredebutevent}` : ''}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>Animal détecté · {names.join(', ') || 'À sélectionner'}</Text>{form.lieu ? <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>Lieu · {form.lieu}</Text> : null}<Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22, marginTop: spacing.md }}>À vérifier</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{missing || 'Vérifiez que toutes les informations correspondent à votre demande.'}</Text></View></FormSheet>;
}
