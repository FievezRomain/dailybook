import { Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from '../content';

export type MetricTrend = 'up' | 'stable' | 'down';
export interface MetricCardProps { label: string; value: string; trend: MetricTrend; trendLabel: string; onPress?: () => void; testID?: string }

export function MetricCard({ label, value, trend, trendLabel, onPress, testID }: MetricCardProps) {
  const { colors } = useAppTheme();
  const symbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const accent = trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary;
  return <Card accessibilityLabel={`${label}, ${value}, ${trendLabel}`} onPress={onPress} testID={testID} style={{ width: componentTokens.content.metricCard.width, height: componentTokens.content.metricCard.height, gap: 6 }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20, letterSpacing: 0.1 }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2 }}>{value}</Text><View style={{ flexDirection: 'row', gap: 4 }}><Text accessibilityLabel={trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'} style={{ color: accent, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{symbol}</Text><Text style={{ flex: 1, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{trendLabel}</Text></View></Card>;
}
