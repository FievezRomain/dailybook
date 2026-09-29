import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { useContactMutations, useContactsQuery } from '@hooks/queries/useContactsQuery';
import { ActionSheet, Banner, BottomBar, Dialog, EmptyState, ErrorState, Icon, IconButton, RootScreen, Skeleton, TopBar, type OverlayActionItem, type VascoIconName } from '@shared/components/ui';
import { radii, spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import { tabs, type MainTabId } from '../../home/mainTabs';
import { getContactInitials } from '../contactUtils';

type ContactAction = 'edit' | 'delete';
const actions: readonly OverlayActionItem<ContactAction>[] = [
  { id: 'edit', label: 'Modifier le contact', description: 'Mettre à jour ses coordonnées', icon: 'edit' },
  { id: 'delete', label: 'Supprimer le contact', description: 'Cette action demande une confirmation', icon: 'delete', tone: 'destructive' },
];

interface ContactDetailScreenProps {
  contactId: number;
  activeTab?: MainTabId;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
  onSelectTab: (tab: MainTabId) => void;
}

export function ContactDetailScreen({ contactId, activeTab = 'more', onBack, onEdit, onDeleted, onSelectTab }: ContactDetailScreenProps) {
  const { colors } = useAppTheme();
  const contactsQuery = useContactsQuery();
  const mutations = useContactMutations();
  const contact = (contactsQuery.data ?? []).find((item) => item.id === contactId);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState<string>();

  if (contactsQuery.isLoading) return <RootScreen header={<TopBar title="Contacts" context="detail" onBack={onBack} />} bottomBar={null}><Skeleton type="card" density="comfortable" /></RootScreen>;
  if (contactsQuery.isError) return <RootScreen header={<TopBar title="Contacts" context="detail" onBack={onBack} />} bottomBar={null}><ErrorState message="Impossible de charger ce contact." onRetry={() => void contactsQuery.refetch()} /></RootScreen>;
  if (!contact) return <RootScreen header={<TopBar title="Contacts" context="detail" onBack={onBack} />} bottomBar={null}><EmptyState title="Contact introuvable" message="Il a peut-être été supprimé." actionLabel="Retour aux contacts" onAction={onBack} /></RootScreen>;

  const openContactAction = async (url: string) => {
    setActionError(undefined);
    try {
      if (!(await Linking.canOpenURL(url))) throw new Error('Unsupported contact action');
      await Linking.openURL(url);
    } catch {
      setActionError("Cette action n’est pas disponible sur cet appareil.");
    }
  };

  return <>
    <RootScreen
      header={<TopBar title="Contacts" context="detail" onBack={onBack} />}
      bottomBar={<BottomBar items={tabs} activeId={activeTab} onSelect={onSelectTab} testID="main-tabs" />}
      contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
      testID="contact-detail"
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{contact.nom}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{contact.profession || 'Rôle non renseigné'}</Text>
        </View>
        <IconButton icon="moreHorizontal" accessibilityLabel="Actions sur le contact" variant="ghost" onPress={() => setActionsOpen(true)} />
      </View>
      <View accessible accessibilityLabel={`Initiales ${getContactInitials(contact.nom)}`} style={{ alignSelf: 'center', width: 88, height: 88, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight }}>
        <Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl }}>{getContactInitials(contact.nom)}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <ContactActionTile label="Appeler" detail={contact.telephone || 'Indisponible'} icon="phone" disabled={!contact.telephone} onPress={() => void openContactAction(`tel:${contact.telephone}`)} />
        <ContactActionTile label="Message" detail="SMS" icon="message" disabled={!contact.telephone} onPress={() => void openContactAction(`sms:${contact.telephone}`)} />
        <ContactActionTile label="E-mail" detail={contact.email || 'Indisponible'} icon="email" disabled={!contact.email} onPress={() => void openContactAction(`mailto:${contact.email}`)} />
      </View>
      {actionError ? <Banner tone="error" title="Action impossible" message={actionError} onDismiss={() => setActionError(undefined)} /> : null}
      <View style={{ gap: spacing.md, padding: spacing.lg, borderRadius: radii.xl, backgroundColor: colors.surface }}>
        <InfoRow label="Rôle" value={contact.profession || 'Non renseigné'} />
        <InfoRow label="Téléphone" value={contact.telephone || 'Non renseigné'} />
        <InfoRow label="E-mail" value={contact.email || 'Non renseigné'} />
      </View>
    </RootScreen>
    <ActionSheet open={actionsOpen} title="Actions sur le contact" subtitle={`${contact.nom}${contact.profession ? ` · ${contact.profession}` : ''}`} items={actions} onClose={() => setActionsOpen(false)} onSelect={(action) => { setActionsOpen(false); if (action === 'edit') onEdit(); else setDeleteOpen(true); }} testID="contact-actions" />
    <Dialog open={deleteOpen} type="destructive" title="Supprimer ce contact ?" description={`${contact.nom} sera retiré de votre carnet. Cette action n’affecte aucun groupe ni historique.`} confirmLabel="Supprimer" loading={mutations.remove.isPending} onClose={() => setDeleteOpen(false)} onConfirm={async () => { try { await mutations.remove.mutateAsync(String(contact.id)); onDeleted(); } catch { setActionError("Le contact n’a pas pu être supprimé. Réessayez."); } }} testID="contact-delete-confirmation" />
  </>;
}

function ContactActionTile({ label, detail, icon, disabled, onPress }: { label: string; detail: string; icon: VascoIconName; disabled: boolean; onPress: () => void }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={`${label}, ${detail}`} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ flex: 1, minWidth: 0, minHeight: 76, alignItems: 'center', justifyContent: 'center', gap: 2, padding: spacing.xs, borderRadius: radii.lg, backgroundColor: colors.surface, opacity: disabled ? 0.48 : pressed ? 0.8 : 1 })}><Icon name={icon} size="md" color={colors.primaryDark} /><Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{label}</Text><Text numberOfLines={1} style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, maxWidth: '100%' }}>{detail}</Text></Pressable>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 20 }}>{label} · {value}</Text>;
}