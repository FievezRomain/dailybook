import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';

export interface StatisticHistoryGroupProps {
  label: string;
  summary: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  indicatorColor?: string;
}

export function StatisticHistoryGroup({ label, summary, children, defaultExpanded = false, indicatorColor }: StatisticHistoryGroupProps) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  return <View style={{ gap: spacing.sm }}>
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}, ${summary}`} accessibilityState={{ expanded }} onPress={() => setExpanded((value) => !value)} style={({ pressed }) => ({ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, opacity: pressed ? 0.78 : 1 })}>
      {indicatorColor ? <View accessibilityElementsHidden style={{ width: 10, height: 10, borderRadius: radii.full, backgroundColor: indicatorColor }} /> : null}
      <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{label}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{summary}</Text>
      <Icon name={expanded ? 'expand' : 'next'} size="md" color={colors.textSecondary} />
    </Pressable>
    {expanded ? <View style={{ gap: spacing.sm }}>{children}</View> : null}
  </View>;
}
