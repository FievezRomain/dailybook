import { BlurView } from 'expo-blur';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { materialTokens, type Material } from '../../../../theme/materials';
import { palette } from '../../../../theme/primitives';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { useResolvedMaterial } from '../../../../theme/useResolvedMaterial';
import { Icon, type VascoIconName } from '../icons';

export interface FloatingActionButtonProps { icon?: VascoIconName; accessibilityLabel: string; onPress: () => void; material?: Material; style?: StyleProp<ViewStyle>; testID?: string }

export function FloatingActionButton({ icon = 'add', accessibilityLabel, onPress, material = 'solid', style, testID }: FloatingActionButtonProps) {
  const { colors, isDark } = useAppTheme();
  const resolvedMaterial = useResolvedMaterial(material);
  const surfaceStyle = [{ width: 56, height: 56, borderRadius: radii.full, overflow: 'hidden' as const, backgroundColor: resolvedMaterial === 'glass' ? colors.glassBackground : colors.primary, shadowColor: palette.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 4 }, style];
  const content = <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} testID={testID} style={({ pressed }) => ({ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.72 : 1 })}><Icon name={icon} size="lg" color={resolvedMaterial === 'glass' ? colors.primary : colors.textOnPrimary} /></Pressable>;
  if (resolvedMaterial === 'glass') return <BlurView intensity={materialTokens.blur.tabBar} tint={isDark ? 'dark' : 'light'} style={surfaceStyle}>{content}</BlurView>;
  return <View style={surfaceStyle}>{content}</View>;
}
