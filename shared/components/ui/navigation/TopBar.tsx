import { useEffect, useState, type ReactNode } from 'react';
import { Image, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Avatar } from '../content';
import { NotificationBadge } from '../feedback';
import { Icon } from '../icons';
import { NavigationSurface } from './NavigationSurface';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { FileService } from '../../../../services/api/FileService';

export interface TopBarProps { title: string; context?: 'root' | 'detail'; material?: Material; scrolled?: boolean; onBack?: () => void; onNotifications?: () => void; unreadNotifications?: number; onAccount?: () => void; avatarInitials?: string; avatarImageUrl?: string | null; trailing?: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }

export function TopBar({ title, context = 'root', material = 'solid', scrolled = false, onBack, onNotifications, unreadNotifications = 0, onAccount, avatarInitials, avatarImageUrl, trailing, style, testID }: TopBarProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const firebasePhotoUrl = useAuthStore((state) => state.firebaseUser?.photoURL);
  const [storedImageUrl, setStoredImageUrl] = useState<string | undefined>(() => user?.filename && user.id ? FileService.getCachedDownloadUrl(user.filename, 'user', user.id) : undefined);
  useEffect(() => {
    if (!user?.filename || !user.id) { setStoredImageUrl(undefined); return; }
    setStoredImageUrl(FileService.getCachedDownloadUrl(user.filename, 'user', user.id));
    void FileService.getDownloadUrl(user.filename, 'user', user.id).then(setStoredImageUrl).catch(() => undefined);
  }, [user?.filename, user?.id]);
  const resolvedInitials = avatarInitials ?? user?.prenom?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() ?? 'VA';
  const resolvedImageUrl = avatarImageUrl ?? storedImageUrl ?? firebasePhotoUrl;
  const fallbackImageUrl = resolvedImageUrl === firebasePhotoUrl ? undefined : firebasePhotoUrl;
  const brandedRoot = context === 'root' && title.trim().toLocaleUpperCase('fr-FR') === 'VASCO';
  return (
    <NavigationSurface material={material} style={[{ height: componentTokens.navigation.topBarHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, borderBottomWidth: scrolled ? 1 : 0, borderBottomColor: colors.border, backgroundColor: material === 'glass' ? colors.glassBackground : colors.surface, shadowColor: colors.textPrimary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 }, style]}>
      {context === 'detail' ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={onBack} style={{ width: 24, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size="lg" /></Pressable>
      ) : null}
      {brandedRoot ? (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image accessibilityIgnoresInvertColors source={require('../../../../assets/logo.png')} resizeMode="contain" style={{ width: componentTokens.navigation.brandedTopBarLogoSize, height: componentTokens.navigation.brandedTopBarLogoSize }} />
          <Text numberOfLines={1} accessibilityLabel="Vasco" style={{ color: colors.primary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xl, lineHeight: typography.lineHeights.relaxed, textTransform: 'uppercase' }} testID={testID}>VASCO</Text>
        </View>
      ) : (
        <Text numberOfLines={1} accessibilityLabel={title} style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl, lineHeight: typography.lineHeights.relaxed }} testID={testID}>{title}</Text>
      )}
      {trailing ?? (
        <>
          {onNotifications ? (
            <Pressable accessibilityRole="button" accessibilityLabel={unreadNotifications > 0 ? `Notifications, ${unreadNotifications} non lues` : 'Notifications'} onPress={onNotifications} testID={testID ? `${testID}-notifications` : 'top-bar-notifications'} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={unreadNotifications > 0 ? "notificationsUnread" : "notifications"} size="md" />
              {unreadNotifications > 0 ? <View pointerEvents="none" style={{ position: 'absolute', right: -3, top: 1 }}><NotificationBadge type="count" count={unreadNotifications} accessibilityLabel={`${unreadNotifications} notifications non lues`} /></View> : null}
            </Pressable>
          ) : null}
          {onAccount ? <Pressable accessibilityRole="button" accessibilityLabel="Profil et réglages" onPress={onAccount} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }}><Avatar initials={resolvedInitials} imageUrl={resolvedImageUrl} fallbackImageUrl={fallbackImageUrl} accessibilityLabel="" decorative /></Pressable> : null}
        </>
      )}
    </NavigationSurface>
  );
}
