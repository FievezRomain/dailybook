import type { ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Avatar } from '../content';
import { NotificationBadge } from '../feedback';
import { Icon } from '../icons';
import { NavigationSurface } from './NavigationSurface';

export interface TopBarProps { title: string; context?: 'root' | 'detail'; material?: Material; scrolled?: boolean; onBack?: () => void; onNotifications?: () => void; unreadNotifications?: number; onAccount?: () => void; avatarInitials?: string; avatarImageUrl?: string | null; trailing?: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }

export function TopBar({ title, context = 'root', material = 'solid', scrolled = false, onBack, onNotifications, unreadNotifications = 0, onAccount, avatarInitials = 'VA', avatarImageUrl, trailing, style, testID }: TopBarProps) {
  const { colors } = useAppTheme();
  return (
    <NavigationSurface material={material} style={[{ height: componentTokens.navigation.topBarHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, borderBottomWidth: scrolled ? 1 : 0, borderBottomColor: colors.border, backgroundColor: material === 'glass' ? colors.glassBackground : colors.surface }, style]}>
      {context === 'detail' ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={onBack} style={{ width: 24, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size="lg" /></Pressable>
      ) : (
        <View accessibilityElementsHidden style={{ width: 24, height: 24 }}><Icon name="animals" size="lg" color={colors.primary} /></View>
      )}
      <Text numberOfLines={1} style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xl, lineHeight: typography.lineHeights.relaxed }} testID={testID}>{title}</Text>
      {trailing ?? (
        <>
          {onNotifications ? (
            <Pressable accessibilityRole="button" accessibilityLabel={unreadNotifications > 0 ? `Notifications, ${unreadNotifications} non lues` : 'Notifications'} onPress={onNotifications} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="notifications" size="md" />
              {unreadNotifications > 0 ? <View pointerEvents="none" style={{ position: 'absolute', right: 1, top: 4 }}><NotificationBadge type="dot" accessibilityLabel={`${unreadNotifications} notifications non lues`} /></View> : null}
            </Pressable>
          ) : null}
          {onAccount ? <Pressable accessibilityRole="button" accessibilityLabel="Profil et réglages" onPress={onAccount} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }}><Avatar initials={avatarInitials} imageUrl={avatarImageUrl} accessibilityLabel="" decorative /></Pressable> : null}
        </>
      )}
    </NavigationSurface>
  );
}
