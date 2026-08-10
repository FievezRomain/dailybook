import { Text, View } from 'react-native';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export type StatusBadgeTone = 'info' | 'success' | 'warning' | 'error';
export type StatusBadgeSize = 'small' | 'medium';

export interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
  size?: StatusBadgeSize;
  accessibilityLabel?: string;
}

export function StatusBadge({ label, tone = 'info', size = 'small', accessibilityLabel }: StatusBadgeProps) {
  const { colors } = useAppTheme();
  const toneColor = tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : tone === 'error' ? colors.error : colors.borderFocus;
  const medium = size === 'medium';
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? label}
      style={{
        height: medium ? 36 : 28,
        paddingHorizontal: medium ? 16 : 12,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: toneColor,
        backgroundColor: tone === 'error' ? colors.errorSurface : colors.surfaceVariant,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
      }}
    >
      <View style={{ width: medium ? 8 : 6, height: medium ? 8 : 6, borderRadius: radii.full, backgroundColor: toneColor }} />
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: medium ? 13 : 11 }}>
        {label}
      </Text>
    </View>
  );
}
