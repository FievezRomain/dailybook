import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { Icon } from '../icons';

export interface SectionEmptyMessageProps {
  title: string;
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionEmptyMessage({ title, message, style }: SectionEmptyMessageProps) {
  const { colors } = useAppTheme();
  return <Card accessibilityLabel={`${title}. ${message}`} style={[{ width: '100%', maxWidth: 420, minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 12 }, style]}><View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.surfaceVariant }}><Icon name="empty" size="lg" color={colors.primary} /></View><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{message}</Text></View></Card>;
}
