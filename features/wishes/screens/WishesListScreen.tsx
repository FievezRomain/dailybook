import { useEffect, useMemo, useState } from "react";
import { Image, RefreshControl, Text, View } from "react-native";

import { useNotificationsQuery } from "@hooks/queries/useNotificationsQuery";
import { useWishesQuery } from "@hooks/queries/useWishesQuery";
import { useWishImageQuery } from "@hooks/queries/useWishImageQuery";
import type { Wish } from "@models/Wish";
import { useAuthStore } from "@stores/useAuthStore";
import {
  BottomBar,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  GlobalCreateMenu,
  RootScreen,
  SearchField,
  Skeleton,
  TabBar,
  TopBar,
  WishCard,
  resolveAsyncState,
  type GlobalCreateTarget,
} from "@shared/components/ui";
import type { Material } from "@theme/materials";
import { spacing, typography } from "@theme/scales";
import { useAppTheme } from "@theme/useAppTheme";

import { getInitials } from "../../home/homeUtils";
import { tabs, type MainTabId } from "../../home/mainTabs";
import {
  filterWishesByTab,
  getWishMetadata,
  getWishPriceLabel,
  type WishListTab,
} from "../wishUtils";

const wishTabs = [
  { id: "planned", label: "À prévoir" },
  { id: "acquired", label: "Acquis" },
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
  onBack: () => void;
}

export function WishesListScreen({
  material = "solid",
  activeMainTab = "home",
  onSelectTab,
  onOpenWish,
  onCreateWish,
  onCreate,
  onNotifications,
  onAccount,
  onBack,
}: WishesListScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const wishesQuery = useWishesQuery();
  const notificationsQuery = useNotificationsQuery();
  const [activeTab, setActiveTab] = useState<WishListTab>("planned");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const wishes = wishesQuery.data ?? [];
  const visibleWishes = useMemo(
    () => {
      const normalizedSearch = search.trim().toLocaleLowerCase('fr-FR');
      return filterWishesByTab(wishes, activeTab).filter((wish) => [wish.nom, wish.destinataire].some((value) => value?.toLocaleLowerCase('fr-FR').includes(normalizedSearch)));
    },
    [activeTab, search, wishes],
  );
  const state = resolveAsyncState({
    loading: wishesQuery.isLoading,
    error: wishesQuery.isError,
    hasData: wishes.length > 0,
  });
  const unread = (notificationsQuery.data ?? []).filter(
    (notification) => !notification.is_read,
  ).length;

  const emptyCopy =
    activeTab === "planned"
      ? ["Aucun souhait à prévoir", "Ajoutez une envie pour la retrouver ici."]
      : ["Aucun souhait acquis", "Les envies réalisées apparaîtront ici."];

  return (
    <>
      <RootScreen
        header={
          <TopBar
            title="Souhaits"
            context="detail"
            onBack={onBack}
            material={material}
            onNotifications={onNotifications}
            unreadNotifications={unread}
            onAccount={onAccount}
            avatarInitials={getInitials(user?.prenom)}
          />
        }
        bottomBar={
          <BottomBar
            items={tabs}
            activeId={activeMainTab}
            onSelect={onSelectTab}
            material={material}
            testID="main-tabs"
          />
        }
        floatingAction={
          <FloatingActionButton
            accessibilityLabel="Créer"
            testID="wishes-create"
            onPress={() => setCreateOpen(true)}
            material={material}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={wishesQuery.isRefetching}
            onRefresh={() => void wishesQuery.refetch()}
          />
        }
        contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl * 3 }}
        material={material}
        testID="wishes-list"
      >
        <SearchField value={search} onChangeText={setSearch} onClear={() => setSearch('')} placeholder="Rechercher un souhait" accessibilityLabel="Rechercher un souhait" />
        <TabBar
          items={wishTabs}
          activeId={activeTab}
          onSelect={setActiveTab}
          style={{ backgroundColor: "transparent" }}
          fullWidthIndicator
        />
        <View style={{ gap: spacing.md }}>
          {state === "loading" ? (
            <LoadingWishes />
          ) : state === "error" ? (
            <ErrorState
              title="Liste indisponible"
              message="Vos souhaits déjà enregistrés ne sont pas perdus. Vérifiez la connexion puis réessayez."
              onRetry={() => void wishesQuery.refetch()}
            />
          ) : visibleWishes.length === 0 ? (
            search.trim() ? <EmptyState type="search" title="Aucun résultat" message="Essayez un autre intitulé ou destinataire." actionLabel="Effacer la recherche" onAction={() => setSearch('')} /> : <EmptyState title={emptyCopy[0]} message={emptyCopy[1]} />
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              {[0, 1].map((column) => (
                <View
                  key={column}
                  style={{
                    flex: 1,
                    gap: spacing.md,
                    paddingTop: column === 1 ? spacing.lg : 0,
                  }}
                >
                  {visibleWishes
                    .filter((_, index) => index % 2 === column)
                    .map((wish) => (
                      <WishMasonryCard
                        key={wish.id}
                        wish={wish}
                        material={material}
                        onPress={() => onOpenWish(wish.id)}
                      />
                    ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </RootScreen>
      <GlobalCreateMenu
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSelect={onCreate}
        material={material}
        testID="wishes-create-menu"
      />
    </>
  );
}

function LoadingWishes() {
  return (
    <View style={{ gap: spacing.md }}>
      <Skeleton type="card" density="comfortable" />
      <Skeleton type="card" density="comfortable" />
      <Skeleton type="card" density="comfortable" />
    </View>
  );
}

function WishMasonryCard({
  wish,
  material,
  onPress,
}: {
  wish: Wish;
  material: Material;
  onPress: () => void;
}) {
  const imageQuery = useWishImageQuery(wish.id, wish.image);
  const [aspectRatio, setAspectRatio] = useState(1);
  useEffect(() => {
    if (!imageQuery.data) return;
    Image.getSize(
      imageQuery.data,
      (width, height) => {
        if (width > 0 && height > 0) setAspectRatio(width / height);
      },
      () => setAspectRatio(1),
    );
  }, [imageQuery.data]);
  return (
    <WishCard
      title={wish.nom}
      status={wish.acquis ? "completed" : "planned"}
      metadata={getWishMetadata(wish)}
      priceLabel={getWishPriceLabel(wish)}
      imageUrl={imageQuery.data}
      imageAspectRatio={aspectRatio}
      material={material}
      onPress={onPress}
      testID={`wish-card-${wish.id}`}
    />
  );
}
