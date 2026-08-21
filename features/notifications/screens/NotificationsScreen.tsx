import { useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';

import { useGroupMutations } from '../../../hooks/queries/useGroupsQuery';
import { useNotificationMutations, useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Banner, BottomBar, Button, EmptyState, ErrorState, NotificationCard, RootScreen, Skeleton, Snackbar, TopBar, resolveAsyncState } from '../../../shared/components/ui';
import type { Material } from '../../../theme/materials';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getInitials } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { formatNotificationTime, isMemberInvitation, toNotificationType } from '../notificationUtils';
import { NotificationSwipeRow } from '../components/NotificationSwipeRow';
import type { Notification } from '../../../models/Notification';

interface NotificationsScreenProps {
  material?: Material;
  activeTab: MainTabId;
  onSelectTab: (tab: MainTabId) => void;
  onAccount?: () => void;
  onBack: () => void;
  onOpenNotification?: (notification: Notification) => void;
}

export function NotificationsScreen({ material = 'solid', activeTab, onSelectTab, onAccount, onBack, onOpenNotification }: NotificationsScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const query = useNotificationsQuery();
  const mutations = useNotificationMutations();
  const groupMutations = useGroupMutations();
  const notifications = query.data ?? [];
  const state = resolveAsyncState({ loading: query.isLoading, error: query.isError, hasData: notifications.length > 0 });
  const unread = notifications.filter((item) => !item.is_read).length;
  const [feedback, setFeedback] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const responding = groupMutations.respondInvitation.isPending;

  const respond = async (notificationId: number, invitationId: number, status: 'accepted' | 'declined') => {
    setActionError(undefined);
    try {
      await groupMutations.respondInvitation.mutateAsync({ invitationId: String(invitationId), body: { status } });
      await mutations.setRead.mutateAsync({ id: notificationId, isRead: true });
      setFeedback(status === 'accepted' ? 'Invitation acceptée.' : 'Invitation refusée.');
    } catch {
      setActionError('Votre réponse n’a pas pu être enregistrée. Réessayez.');
    }
  };
  const openNotification = (notification: Notification) => {
    if (!notification.is_read) mutations.setRead.mutate({ id: notification.id, isRead: true });
    onOpenNotification?.(notification);
  };

  return <>
    <RootScreen
      header={<TopBar title="Notifications" context="detail" material={material} onBack={onBack} />}
      bottomBar={<BottomBar items={tabs} activeId={activeTab} onSelect={onSelectTab} material={material} testID="main-tabs" />}
      refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}
      contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxl }}
      material={material}
      testID="notifications-list"
    >
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>Rappels, invitations et informations importantes</Text>
      {unread > 0 ? <Pressable accessibilityRole="button" accessibilityLabel="Tout marquer comme lu" disabled={mutations.markAllAsRead.isPending} onPress={() => mutations.markAllAsRead.mutate()} style={{ minHeight: 44, alignSelf: 'flex-end', justifyContent: 'center' }}><Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>Tout marquer comme lu</Text></Pressable> : null}
      {actionError ? <Banner tone="error" title="Réponse impossible" message={actionError} onDismiss={() => setActionError(undefined)} /> : null}
      {query.isError && notifications.length > 0 ? <Banner tone="error" title="Actualisation impossible" message="Les notifications déjà chargées restent disponibles." onDismiss={undefined} /> : null}
      {state === 'loading' ? <View style={{ gap: spacing.md }}><Skeleton /><Skeleton /><Skeleton /></View>
        : state === 'error' ? <ErrorState title="Notifications indisponibles" message="Impossible de charger vos notifications." onRetry={() => void query.refetch()} />
          : notifications.length === 0 ? <EmptyState title="Aucune notification" message="Vos rappels, invitations et informations importantes apparaîtront ici." />
            : <View style={{ gap: spacing.sm }}>{notifications.map((notification) => isMemberInvitation(notification) ? <View key={notification.id} style={{ width: '100%', maxWidth: 360, minHeight: 190, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{notification.title || 'Invitation dans un groupe'}</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{[notification.proposed_by, formatNotificationTime(notification.created_at)].filter(Boolean).join(' · ')}</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{notification.message}</Text>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}><Button label="Refuser" variant="secondary" size="small" disabled={responding} onPress={() => void respond(notification.id, notification.object_id!, 'declined')} style={{ flex: 1 }} /><Button label="Accepter" size="small" loading={responding} onPress={() => void respond(notification.id, notification.object_id!, 'accepted')} style={{ flex: 1 }} /></View>
            </View> : <NotificationSwipeRow key={notification.id} read={notification.is_read} onToggleRead={() => mutations.setRead.mutate({ id: notification.id, isRead: !notification.is_read })} onDelete={() => mutations.remove.mutate(notification.id)}><NotificationCard title={notification.title || 'Notification'} message={notification.message || ''} timestamp={formatNotificationTime(notification.created_at)} type={toNotificationType(notification.type)} read={notification.is_read} onPress={() => openNotification(notification)} testID={`notification-${notification.id}`} /></NotificationSwipeRow>)}</View>}
    </RootScreen>
    <Snackbar visible={Boolean(feedback)} message={feedback || ''} onHidden={() => setFeedback(undefined)} />
  </>;
}
