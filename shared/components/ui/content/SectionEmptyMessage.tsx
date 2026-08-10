import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface SectionEmptyMessageProps {
  title: string;
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionEmptyMessage({ title, message, style }: SectionEmptyMessageProps) {
  const { colors } = useAppTheme();
  return <View accessibilityRole="summary" accessibilityLabel={`${title}. ${message}`} style={[{ minHeight: 76, gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }, style]}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{message}</Text></View>;
}
