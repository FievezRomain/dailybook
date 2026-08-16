import { useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';

import { useGroupsQuery, useInvitationsQuery } from '../../../hooks/queries/useGroupsQuery';
import { useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import { BottomBar, EmptyState, ErrorState, FloatingActionButton, GlobalCreateMenu, GroupCard, RootScreen, Skeleton, TopBar, resolveAsyncState, type GlobalCreateTarget } from '../../../shared/components/ui';
import type { Material } from '../../../theme/materials';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getInitials } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { getGroupInitials, getGroupSummary, isGroupManager } from '../groupUtils';

interface GroupsListScreenProps {
  material?: Material;
  onSelectTab: (tab: MainTabId) => void;
  onOpenGroup: (groupId: number) => void;
  onOpenInvitation: (invitationId: number) => void;
  onCreateGroup: () => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function GroupsListScreen({ material = 'solid', onSelectTab, onOpenGroup, onOpenInvitation, onCreateGroup, onCreate, onNotifications, onAccount }: GroupsListScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const groupsQuery = useGroupsQuery();
  const invitationsQuery = useInvitationsQuery();
  const notificationsQuery = useNotificationsQuery();
  const [createOpen, setCreateOpen] = useState(false);
  const groups = groupsQuery.data ?? [];
  const invitations = invitationsQuery.data ?? [];
  const state = resolveAsyncState({ loading: groupsQuery.isLoading, error: groupsQuery.isError, hasData: groups.length > 0 });
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.is_read).length;
  const refresh = async () => { await Promise.all([groupsQuery.refetch(), invitationsQuery.refetch()]); };

  return <><RootScreen
    header={<TopBar title="Groupes" material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />}
    bottomBar={<BottomBar items={tabs} activeId="more" onSelect={onSelectTab} material={material} testID="main-tabs" />}
    floatingAction={<FloatingActionButton accessibilityLabel="Créer" testID="groups-create" onPress={() => setCreateOpen(true)} material={material} />}
    refreshControl={<RefreshControl refreshing={groupsQuery.isRefetching || invitationsQuery.isRefetching} onRefresh={() => void refresh()} />}
    contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
    material={material}
    testID="groups-list"
  >
    {invitations.length ? <View style={{ gap: spacing.sm }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.lg }}>Invitations</Text>{invitations.map((invitation) => <GroupCard key={invitation.id} name={invitation.group_name || `Groupe ${invitation.group_id}`} summary={invitation.proposed_by_name ? `Invitation de ${invitation.proposed_by_name}` : 'Invitation reçue'} description="Répondez pour rejoindre ce groupe." initials={getGroupInitials(invitation.group_name || 'Groupe')} role="invited" onPress={() => onOpenInvitation(invitation.id)} testID={`group-invitation-${invitation.id}`} />)}</View> : null}
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>Vos groupes</Text>{groups.length ? <Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{groups.length} groupe{groups.length > 1 ? 's' : ''}</Text> : null}</View>
    {state === 'loading' ? <View style={{ gap: spacing.md }}><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></View>
      : state === 'error' ? <ErrorState title="Liste indisponible" message="Impossible de charger vos groupes. Vérifiez la connexion puis réessayez." onRetry={() => void groupsQuery.refetch()} />
        : groups.length === 0 ? <EmptyState title="Aucun groupe" message="Créez un espace pour partager le suivi de vos animaux avec vos proches." />
          : <View style={{ gap: spacing.md }}>{groups.map((group) => <GroupCard key={group.id} name={group.name} summary={getGroupSummary(group)} description={group.informations} initials={getGroupInitials(group.name)} role={isGroupManager(group, user?.email) ? 'owner' : 'member'} onPress={() => onOpenGroup(group.id)} testID={`group-card-${group.id}`} />)}</View>}
  </RootScreen><GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={onCreate} material={material} testID="groups-create-menu" /></>;
}
