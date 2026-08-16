import { useMemo, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';

import { useNotificationsQuery } from '@hooks/queries/useNotificationsQuery';
import { useWishesQuery } from '@hooks/queries/useWishesQuery';
import { useAuthStore } from '@stores/useAuthStore';
import {
  BottomBar,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  GlobalCreateMenu,
  RootScreen,
  Skeleton,
  TabBar,
  TopBar,
  WishCard,
  resolveAsyncState,
  type GlobalCreateTarget,
} from '@shared/components/ui';
import type { Material } from '@theme/materials';
import { spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import { getInitials } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { filterWishesByTab, getWishMetadata, getWishPriceLabel, type WishListTab } from '../wishUtils';

const wishTabs = [
  { id: 'planned', label: 'À prévoir' },
  { id: 'acquired', label: 'Acquis' },
  { id: 'archived', label: 'Archivés' },
] as const;

interface WishesListScreenProps {
  material?: Material;
  activeMainTab?: MainTabId;
  onSelectTab: (tab: MainTabId) => void;
  onOpenWish: (wishId: number) => void;
  onCreateWish: () => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function WishesListScreen({ material = 'solid', activeMainTab = 'home', onSelectTab, onOpenWish, onCreateWish, onCreate, onNotifications, onAccount }: WishesListScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const wishesQuery = useWishesQuery();
  const notificationsQuery = useNotificationsQuery();
  const [activeTab, setActiveTab] = useState<WishListTab>('planned');
  const [createOpen, setCreateOpen] = useState(false);
  const wishes = wishesQuery.data ?? [];
  const visibleWishes = useMemo(() => filterWishesByTab(wishes, activeTab), [activeTab, wishes]);
  const state = resolveAsyncState({ loading: wishesQuery.isLoading, error: wishesQuery.isError, hasData: wishes.length > 0 });
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.is_read).length;

  const emptyCopy = activeTab === 'planned'
    ? ['Aucun souhait à prévoir', 'Ajoutez une envie pour la retrouver ici.']
    : activeTab === 'acquired'
      ? ['Aucun souhait acquis', 'Les envies réalisées apparaîtront ici.']
      : ['Aucun souhait archivé', "L’archivage sera disponible lorsque le suivi le permettra."];

  return <>
    <RootScreen
      header={<TopBar title="Souhaits" material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />}
      bottomBar={<BottomBar items={tabs} activeId={activeMainTab} onSelect={onSelectTab} material={material} testID="main-tabs" />}
      floatingAction={<FloatingActionButton accessibilityLabel="Créer" testID="wishes-create" onPress={() => setCreateOpen(true)} material={material} />}
      refreshControl={<RefreshControl refreshing={wishesQuery.isRefetching} onRefresh={() => void wishesQuery.refetch()} />}
      contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
      material={material}
      testID="wishes-list"
    >
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>Souhaits</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>Vos envies à prévoir et à suivre</Text>
      </View>
      <TabBar items={wishTabs} activeId={activeTab} onSelect={setActiveTab} style={{ backgroundColor: 'transparent' }} />
      <View style={{ gap: spacing.md }}>
        {state === 'loading' ? <LoadingWishes /> : state === 'error' ? <ErrorState title="Liste indisponible" message="Vos souhaits déjà enregistrés ne sont pas perdus. Vérifiez la connexion puis réessayez." onRetry={() => void wishesQuery.refetch()} /> : visibleWishes.length === 0 ? <EmptyState title={emptyCopy[0]} message={emptyCopy[1]} /> : <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>{[0, 1].map((column) => <View key={column} style={{ flex: 1, gap: spacing.md }}>{visibleWishes.filter((_, index) => index % 2 === column).map((wish) => (
          <WishCard
            key={wish.id}
            title={wish.nom}
            status={wish.acquis ? 'completed' : 'planned'}
            metadata={getWishMetadata(wish)}
            priceLabel={getWishPriceLabel(wish)}
            material={material}
            onPress={() => onOpenWish(wish.id)}
            testID={`wish-card-${wish.id}`}
          />
        ))}</View>)}</View>}
      </View>
    </RootScreen>
    <GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={onCreate} material={material} testID="wishes-create-menu" />
  </>;
}

function LoadingWishes() {
  return <View style={{ gap: spacing.md }}><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></View>;
}
