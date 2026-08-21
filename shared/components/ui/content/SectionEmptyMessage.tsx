import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface SectionEmptyMessageProps {
  title: string;
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionEmptyMessage({ title, message, style }: SectionEmptyMessageProps) {
  const { colors } = useAppTheme();
  return <View accessibilityRole="summary" accessibilityLabel={`${title}. ${message}`} style={[{ minHeight: 76, gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: 12 }, style]}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{message}</Text></View>;
}
