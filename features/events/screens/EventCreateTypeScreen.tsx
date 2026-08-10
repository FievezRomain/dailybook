import { Pressable, Text, View } from 'react-native';
import { FormSheet, Icon, LinearProgress, type VascoIconName } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export const eventCreateTypes = [
  { id: 'soins', label: 'Soins', icon: 'medical' }, { id: 'rdv', label: 'Rendez-vous', icon: 'calendar' },
  { id: 'balade', label: 'Balade', icon: 'animals' }, { id: 'entrainement', label: 'Entraînement', icon: 'tracking' },
  { id: 'concours', label: 'Concours', icon: 'trophy' }, { id: 'depense', label: 'Dépense', icon: 'expense' },
  { id: 'autre', label: 'Autre', icon: 'more' },
] as const satisfies readonly { id: string; label: string; icon: VascoIconName }[];

export interface EventCreateTypeScreenProps { onBack: () => void; onContinue: () => void; onClose?: () => void }

export function EventCreateTypeScreen({ onBack, onContinue, onClose = onBack }: EventCreateTypeScreenProps) {
  const { colors } = useAppTheme();
  const selected = useEventWizardStore((state) => state.formData.eventType);
  const setField = useEventWizardStore((state) => state.setField);
  const select = (id: string) => { setField('eventType', id); onContinue(); };

  return <FormSheet title="Type d’événement" onBack={onBack} onClose={onClose} dirty={Boolean(selected)} testID="event-create-type"><LinearProgress current={1} total={4} label="Étape 1 sur 4" /><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24, marginTop: spacing.md }}>Que souhaitez-vous organiser ?</Text><View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{eventCreateTypes.map((type) => { const active = selected === type.id; return <Pressable key={type.id} accessibilityRole="radio" accessibilityLabel={type.label} accessibilityState={{ checked: active }} onPress={() => select(type.id)} style={({ pressed }) => ({ width: type.id === 'autre' ? '100%' : '47.5%', minHeight: 96, flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: spacing.md, borderRadius: radii.lg, borderWidth: active ? 2 : 1, borderColor: active ? colors.primary : colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.82 : 1 })}><Icon name={type.icon} size="lg" color={active ? colors.primary : colors.textPrimary} /><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22, paddingTop: spacing.xs }}>{type.label}</Text></Pressable>; })}</View></FormSheet>;
}
