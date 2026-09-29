import { Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export function AnimalSelectorMore({ expanded, onPress, testID }: { expanded: boolean; onPress: () => void; testID?: string }) {
  const { colors } = useAppTheme();
  const metrics = componentTokens.content.animalSelector;
  const label = expanded ? 'Voir moins' : 'Voir plus';
  return <Pressable accessibilityRole="button" accessibilityLabel={`${label} d’animaux`} accessibilityState={{ expanded }} onPress={onPress} testID={testID} style={({ pressed }) => ({ width: metrics.width, minHeight: metrics.height, alignItems: 'center', justifyContent: 'center', gap: 6, opacity: pressed ? 0.72 : 1 })}><View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.full, backgroundColor: colors.surface }}><Text accessibilityElementsHidden style={{ color: colors.textSecondary, fontFamily: typography.fonts.semiBold, fontSize: 24 }}>{expanded ? '−' : '+'}</Text></View><Text numberOfLines={1} style={{ width: metrics.width, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: 13, lineHeight: 20, textAlign: 'center' }}>{label}</Text></Pressable>;
}
