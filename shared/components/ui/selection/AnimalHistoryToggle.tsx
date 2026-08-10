import { Pressable, Text } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export function AnimalHistoryToggle({ expanded, onPress, testID }: { expanded: boolean; onPress: () => void; testID?: string }) {
  const { colors } = useAppTheme();
  const label = expanded ? 'Voir moins' : 'Voir plus';
  return <Pressable accessibilityRole="button" accessibilityLabel={`${label} d’animaux`} accessibilityState={{ expanded }} onPress={onPress} testID={testID} style={({ pressed }) => ({ minHeight: 44, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, opacity: pressed ? 0.68 : 1 })}><Text accessibilityElementsHidden style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{expanded ? '−' : '+'}</Text><Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.control }}>{label}</Text></Pressable>;
}
