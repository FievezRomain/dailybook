import { Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from '../content';

export type MetricTrend = 'up' | 'stable' | 'down';
export interface MetricCardProps { label: string; value: string; trend: MetricTrend; trendLabel: string; density?: 'default' | 'compact'; material?: Material; onPress?: () => void; testID?: string }

export function MetricCard({ label, value, trend, trendLabel, density = 'default', material = 'solid', onPress, testID }: MetricCardProps) {
  const { colors } = useAppTheme();
  const symbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const accent = trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary;
  return <Card accessibilityLabel={`${label}, ${value}, ${trendLabel}`} material={material} onPress={onPress} testID={testID} style={{ width: componentTokens.content.metricCard.width, height: density === 'compact' ? componentTokens.content.statisticCard.summaryHeight : componentTokens.content.metricCard.height, gap: 6 }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: density === 'compact' ? typography.sizes.sm : typography.sizes.control, lineHeight: 20, letterSpacing: 0.1 }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: density === 'compact' ? typography.sizes.xl : typography.sizes.xxl, lineHeight: density === 'compact' ? 28 : 32 }}>{value}</Text><View style={{ flexDirection: 'row', gap: 4 }}><Text accessibilityLabel={trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'} style={{ color: accent, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{symbol}</Text><Text style={{ flex: 1, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{trendLabel}</Text></View></Card>;
}
