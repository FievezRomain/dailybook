import { useState } from 'react';
import { Image, Linking, Text, View } from 'react-native';

import { useNotificationsQuery } from '@hooks/queries/useNotificationsQuery';
import { useWishImageQuery } from '@hooks/queries/useWishImageQuery';
import { useWishMutations, useWishesQuery } from '@hooks/queries/useWishesQuery';
import {
  ActionSheet,
  Banner,
  BottomBar,
  Button,
  Dialog,
  EmptyState,
  ErrorState,
  Icon,
  IconButton,
  RootScreen,
  Skeleton,
  TopBar,
  type OverlayActionItem,
} from '@shared/components/ui';
import { radii, spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import { tabs, type MainTabId } from '../../home/mainTabs';
import { getWishMetadata, getWishPriceLabel } from '../wishUtils';

type WishAction = 'edit' | 'delete';
const actions: readonly OverlayActionItem<WishAction>[] = [
  { id: 'edit', label: 'Modifier', description: 'Mettre à jour les informations', icon: 'edit' },
  { id: 'delete', label: 'Supprimer', description: 'Une confirmation sera demandée', icon: 'delete', tone: 'destructive' },
];

interface WishDetailScreenProps {
  wishId: number;
  activeTab?: MainTabId;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
  onSelectTab: (tab: MainTabId) => void;
}

export function WishDetailScreen({ wishId, activeTab = 'home', onBack, onEdit, onDeleted, onSelectTab }: WishDetailScreenProps) {
  const { colors } = useAppTheme();
  const wishesQuery = useWishesQuery();
  const notificationsQuery = useNotificationsQuery();
  const mutations = useWishMutations();
  const wish = (wishesQuery.data ?? []).find((item) => item.id === wishId);
  const imageQuery = useWishImageQuery(wishId, wish?.image);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState<string>();
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.is_read).length;

  if (wishesQuery.isLoading) return <RootScreen header={<TopBar title="Souhait" context="detail" onBack={onBack} />} bottomBar={null}><Skeleton type="card" density="comfortable" /></RootScreen>;
  if (wishesQuery.isError) return <RootScreen header={<TopBar title="Souhait" context="detail" onBack={onBack} />} bottomBar={null}><ErrorState message="Impossible de charger ce souhait." onRetry={() => void wishesQuery.refetch()} /></RootScreen>;
  if (!wish) return <RootScreen header={<TopBar title="Souhait" context="detail" onBack={onBack} />} bottomBar={null}><EmptyState title="Souhait introuvable" message="Il a peut-être été supprimé." actionLabel="Retour aux souhaits" onAction={onBack} /></RootScreen>;

  const updateAcquired = async () => {
    setActionError(undefined);
    try {
      await mutations.update.mutateAsync({ id: String(wish.id), body: { id: wish.id, nom: wish.nom, destinataire: wish.destinataire, acquis: !wish.acquis, url: wish.url, prix: wish.prix ?? undefined, image: wish.image } });
    } catch {
      setActionError("Le statut n’a pas pu être modifié. Réessayez.");
    }
  };
  const openLink = async () => {
    if (!wish.url) return;
    setActionError(undefined);
    try {
      if (!(await Linking.canOpenURL(wish.url))) throw new Error('Unsupported URL');
      await Linking.openURL(wish.url);
    } catch {
      setActionError("Ce lien ne peut pas être ouvert.");
    }
  };

  return <>
    <RootScreen
      header={<TopBar title="Souhait" context="detail" onBack={onBack} unreadNotifications={unread} />}
      bottomBar={<BottomBar items={tabs} activeId={activeTab} onSelect={onSelectTab} testID="main-tabs" />}
      contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
      testID="wish-detail"
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{wish.nom}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{wish.acquis ? 'Acquis' : 'À prévoir'} · {getWishMetadata(wish)}</Text>
        </View>
        <IconButton icon="moreHorizontal" accessibilityLabel="Actions sur le souhait" variant="ghost" onPress={() => setActionsOpen(true)} />
      </View>
      <View style={{ width: '100%', height: 190, borderRadius: radii.xl, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}>
        {imageQuery.data ? <Image source={{ uri: imageQuery.data }} resizeMode="cover" accessibilityLabel={`Image de ${wish.nom}`} style={{ width: '100%', height: '100%' }} /> : <Icon name="wish" size="xxl" color={colors.primaryDark} />}
      </View>
      {imageQuery.isError ? <Banner tone="error" title="Image indisponible" message="Le souhait reste accessible sans son image." onDismiss={() => undefined} /> : null}
      {actionError ? <Banner tone="error" title="Action impossible" message={actionError} onDismiss={() => setActionError(undefined)} /> : null}
      {getWishPriceLabel(wish) ? <Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{String(wish.prix)}</Text> : null}
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>Destinataire · {getWishMetadata(wish)}</Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {wish.url ? <Button label="Ouvrir le lien" onPress={() => void openLink()} style={{ flex: 1 }} /> : null}
        <Button label={wish.acquis ? 'Marquer à prévoir' : 'Marquer acquis'} variant="secondary" loading={mutations.update.isPending} onPress={() => void updateAcquired()} style={{ flex: 1 }} />
      </View>
    </RootScreen>
    <ActionSheet open={actionsOpen} title="Actions sur le souhait" subtitle={wish.nom} items={actions} onClose={() => setActionsOpen(false)} onSelect={(action) => { setActionsOpen(false); if (action === 'edit') onEdit(); else setDeleteOpen(true); }} testID="wish-actions" />
    <Dialog open={deleteOpen} type="destructive" title="Supprimer ce souhait ?" description={`« ${wish.nom} » sera supprimé de votre liste. Cette action est définitive.`} confirmLabel="Supprimer" loading={mutations.remove.isPending} onClose={() => setDeleteOpen(false)} onConfirm={async () => { await mutations.remove.mutateAsync(String(wish.id)); onDeleted(); }} testID="wish-delete-confirmation" />
  </>;
}