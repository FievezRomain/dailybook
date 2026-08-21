import { useState } from 'react';
import { View } from 'react-native';

import { useNotificationsQuery } from '@hooks/queries/useNotificationsQuery';
import { useAuthStore } from '@stores/useAuthStore';
import { BottomBar, FloatingActionButton, GlobalCreateMenu, PlusHubItem, RootScreen, TopBar, type GlobalCreateTarget } from '@shared/components/ui';
import type { Material } from '@theme/materials';
import { spacing } from '@theme/scales';

import { getInitials } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';

interface PlusHubScreenProps {
  material?: Material;
  onSelectTab: (tab: MainTabId) => void;
  onGroups: () => void;
  onContacts: () => void;
  onNotes: () => void;
  onWishes: () => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function PlusHubScreen({ material = 'solid', onSelectTab, onGroups, onContacts, onNotes, onWishes, onCreate, onNotifications, onAccount }: PlusHubScreenProps) {
  const user = useAuthStore((state) => state.user);
  const notificationsQuery = useNotificationsQuery();
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.is_read).length;
  const [createOpen, setCreateOpen] = useState(false);

  return <>
    <RootScreen
      header={<TopBar title="Autre" material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />}
      bottomBar={<BottomBar items={tabs} activeId="more" onSelect={onSelectTab} material={material} testID="main-tabs" />}
      floatingAction={<FloatingActionButton accessibilityLabel="Créer" onPress={() => setCreateOpen(true)} material={material} testID="other-create" />}
      contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
      material={material}
      testID="plus-hub"
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        <PlusHubItem title="Groupes" description="Espaces partagés" icon="group" onPress={onGroups} material={material} testID="plus-groups" />
        <PlusHubItem title="Contacts" description="Personnes utiles" icon="contact" onPress={onContacts} material={material} testID="plus-contacts" />
        <PlusHubItem title="Notes" description="Textes et notes vocales" icon="note" onPress={onNotes} material={material} testID="plus-notes" />
        <PlusHubItem title="Souhaits" description="Idées et envies" icon="heart" onPress={onWishes} material={material} testID="plus-wishes" />
      </View>
    </RootScreen>
    <GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={onCreate} material={material} testID="other-create-menu" />
  </>;
}
