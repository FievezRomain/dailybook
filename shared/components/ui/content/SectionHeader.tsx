import { Pressable, Text, View } from 'react-native';
import { typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export function SectionHeader({ label, count, actionLabel = 'Voir tous', onAction }: { label: string; count: number; actionLabel?: string; onAction?: () => void }) {
  const { colors } = useAppTheme();
  return <View style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center' }}><Text accessibilityRole="header" style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl }}>{label} : {count}</Text>{onAction ? <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.md }}>{actionLabel}</Text></Pressable> : null}</View>;
}
