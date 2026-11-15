import { Text, View } from 'react-native';

import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export function RewardSectionIntroduction({ title, message }: { title: string; message: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl }}>
        {title}
      </Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.normal }}>
        {message}
      </Text>
    </View>
  );
}
