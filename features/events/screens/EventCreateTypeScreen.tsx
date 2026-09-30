import { Pressable, Text, View } from 'react-native';
import { FormSheet, Icon, LinearProgress, type VascoIconName } from '../../../shared/components/ui';
import { eventTypePresentation } from '../../../shared/components/ui/content/domainCardUtils';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export const eventCreateTypes = [
  { id: 'soins', description: 'Traitement, vaccin ou suivi', ...eventTypePresentation.care },
  { id: 'rdv', description: 'Vétérinaire ou praticien', ...eventTypePresentation.appointment },
  { id: 'balade', description: 'Sortie, distance et durée', ...eventTypePresentation.walk },
  { id: 'entrainement', description: 'Séance et progression', ...eventTypePresentation.training },
  { id: 'concours', description: 'Épreuve et classement', ...eventTypePresentation.competition },
  { id: 'depense', description: 'Achat, catégorie et montant', ...eventTypePresentation.expense },
  { id: 'autre', description: 'Un événement personnalisé', ...eventTypePresentation.other },
] as const satisfies readonly { id: string; label: string; description: string; icon: VascoIconName }[];

export interface EventCreateTypeScreenProps { onBack: () => void; onContinue: () => void; onClose?: () => void }

export function EventCreateTypeScreen({ onBack, onContinue, onClose = onBack }: EventCreateTypeScreenProps) {
  const { colors, isDark } = useAppTheme();
  const selected = useEventWizardStore((state) => state.formData.eventType);
  const setField = useEventWizardStore((state) => state.setField);
  const select = (id: string) => { setField('eventType', id); onContinue(); };

  return <FormSheet title="Type d’événement" onBack={onBack} onClose={onClose} dirty={Boolean(selected)} testID="event-create-type">
    <LinearProgress current={1} total={4} label="Étape 1 sur 4" />
    <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24, marginTop: spacing.md }}>Que souhaitez-vous organiser ?</Text>
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {eventCreateTypes.map((type) => {
        const active = selected === type.id;
        const accent = colors[type.color];
        const wide = type.id === 'autre';
        const tint = `${accent}${isDark ? '24' : '14'}`;
        return <Pressable
          key={type.id}
          accessibilityRole="radio"
          accessibilityLabel={type.label}
          accessibilityHint={type.description}
          accessibilityState={{ checked: active }}
          onPress={() => select(type.id)}
          style={({ pressed }) => ({
            width: wide ? '100%' : '47.5%',
            minHeight: wide ? 96 : 132,
            overflow: 'hidden',
            flexDirection: wide ? 'row' : 'column',
            alignItems: wide ? 'center' : 'stretch',
            gap: wide ? spacing.md : spacing.sm,
            padding: spacing.md,
            paddingTop: wide ? spacing.md : spacing.lg,
            borderRadius: radii.xl,
            borderWidth: active ? 2 : 1,
            borderColor: active ? accent : colors.border,
            backgroundColor: active || pressed ? tint : colors.surface,
            shadowColor: colors.textPrimary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: isDark ? 0 : 0.06,
            shadowRadius: 8,
            elevation: active ? 2 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          })}
        >
          <View accessibilityElementsHidden style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 4, backgroundColor: accent }} />
          <View accessibilityElementsHidden style={{ width: 44, height: 44, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, backgroundColor: tint }}>
            <Icon name={type.icon} size="lg" color={accent} />
          </View>
          <View style={{ flex: wide ? 1 : undefined, minWidth: 0, gap: 3 }}>
            <Text numberOfLines={2} style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 21 }}>{type.label}</Text>
            <Text numberOfLines={2} style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, lineHeight: 17 }}>{type.description}</Text>
          </View>
          {wide ? <Icon name="next" size="sm" color={accent} /> : null}
        </Pressable>;
      })}
    </View>
  </FormSheet>;
}
