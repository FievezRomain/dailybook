import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from '../content';

export type MetricTrend = 'up' | 'stable' | 'down';
export interface MetricCardProps { label: string; value: string; trend?: MetricTrend; trendLabel?: string; supportingText?: string; density?: 'default' | 'compact'; material?: Material; onPress?: () => void; style?: StyleProp<ViewStyle>; testID?: string }

export function MetricCard({ label, value, trend, trendLabel, supportingText, density = 'default', material = 'solid', onPress, style, testID }: MetricCardProps) {
  const { colors } = useAppTheme();
  const symbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const accent = trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary;
  const detail = supportingText ?? trendLabel;
  return <Card accessibilityLabel={`${label}, ${value}${detail ? `, ${detail}` : ''}`} material={material} onPress={onPress} testID={testID} style={[{ width: componentTokens.content.metricCard.width, height: density === 'compact' ? componentTokens.content.statisticCard.summaryHeight : componentTokens.content.metricCard.height, gap: 6 }, style]}>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: density === 'compact' ? typography.sizes.sm : typography.sizes.control, lineHeight: 20, letterSpacing: 0.1 }}>{label}</Text>
    <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: density === 'compact' ? typography.sizes.xl : typography.sizes.xxl, lineHeight: density === 'compact' ? 28 : 32 }}>{value}</Text>
    {detail ? <View style={{ flexDirection: 'row', gap: 4 }}>{trend ? <Text accessibilityLabel={trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'} style={{ color: accent, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{symbol}</Text> : null}<Text style={{ flex: 1, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{detail}</Text></View> : null}
  </Card>;
}
