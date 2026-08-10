import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { normalizeProgress } from './progressUtils';

export interface LinearProgressProps { current: number; total: number; label?: string; style?: StyleProp<ViewStyle>; testID?: string }
export function LinearProgress({ current, total, label, style, testID }: LinearProgressProps) {
  const { colors } = useAppTheme();
  const progress = normalizeProgress(current, total);
  const text = label ?? `Étape ${progress.current} sur ${progress.total}`;
  return <View accessible accessibilityRole="progressbar" accessibilityLabel={text} accessibilityValue={{ min: 1, max: progress.total, now: progress.current }} style={[{ width: '100%', gap: spacing.sm }, style]} testID={testID}><View style={{ height: componentTokens.navigation.linearProgressHeight, flexDirection: 'row', borderRadius: radii.xs, overflow: 'hidden', backgroundColor: colors.surfaceVariant }}><View style={{ flex: progress.ratio, backgroundColor: colors.primary }} /><View style={{ flex: 1 - progress.ratio }} /></View><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16, letterSpacing: 0.1 }}>{text}</Text></View>;
}
