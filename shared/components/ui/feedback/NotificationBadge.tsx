import { Text, View } from 'react-native';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export type NotificationBadgeTone = 'primary' | 'error';

export interface NotificationBadgeProps {
  type?: 'dot' | 'count';
  tone?: NotificationBadgeTone;
  count?: number;
  accessibilityLabel?: string;
}

export function NotificationBadge({
  type = 'dot',
  tone = 'primary',
  count = 0,
  accessibilityLabel,
}: NotificationBadgeProps) {
  const { colors } = useAppTheme();
  const backgroundColor = tone === 'error' ? colors.error : colors.primary;
  const displayCount = count > 99 ? '99+' : String(Math.max(0, count));
  const label = accessibilityLabel ?? (type === 'dot' ? 'Contenu non lu' : `${count} éléments non lus`);

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{
        width: type === 'dot' ? 10 : displayCount.length > 2 ? 28 : 20,
        minWidth: type === 'dot' ? 10 : 20,
        height: type === 'dot' ? 10 : 18,
        borderRadius: radii.pill,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {type === 'count' ? (
        <Text style={{ color: colors.textOnPrimary, fontFamily: typography.fonts.medium, fontSize: 10 }}>
          {displayCount}
        </Text>
      ) : null}
    </View>
  );
}
