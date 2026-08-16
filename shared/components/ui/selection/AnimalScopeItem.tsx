import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';

export interface AnimalScopeItemProps { selected: boolean; onPress: () => void; label?: string; testID?: string }

export function AnimalScopeItem({ selected, onPress, label = 'Tous', testID }: AnimalScopeItemProps) {
  const { colors } = useAppTheme();
  const metrics = componentTokens.content.animalSelector;
  const surface = <View style={{ width: metrics.imageSize, height: metrics.imageSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}><Icon name="animalScope" size="lg" color={colors.primaryDark} /></View>;
  const visual = selected ? <LinearGradient colors={[colors.primaryLight, colors.primary, colors.primaryDark]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={{ width: metrics.ringSize, height: metrics.ringSize, padding: 3, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' }}><View style={{ flex: 1, width: '100%', borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>{surface}</View></LinearGradient> : <View style={{ width: metrics.ringSize, height: metrics.ringSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}>{surface}</View>;
  return <Pressable accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{ selected }} onPress={onPress} testID={testID} style={({ pressed }) => ({ width: metrics.width, minHeight: metrics.height, alignItems: 'center', gap: 10, opacity: pressed ? 0.84 : 1 })}>{visual}<Text numberOfLines={1} style={{ width: metrics.width, color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20, textAlign: 'center' }}>{label}</Text></Pressable>;
}
