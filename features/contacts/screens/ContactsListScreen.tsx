import { useMemo, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';

import { useContactsQuery } from '@hooks/queries/useContactsQuery';
import { useNotificationsQuery } from '@hooks/queries/useNotificationsQuery';
import { useAuthStore } from '@stores/useAuthStore';
import { BottomBar, ContactCard, EmptyState, ErrorState, FloatingActionButton, GlobalCreateMenu, RootScreen, SearchField, Skeleton, TopBar, resolveAsyncState, type GlobalCreateTarget } from '@shared/components/ui';
import type { Material } from '@theme/materials';
import { spacing, typography } from '@theme/scales';
import { useAppTheme } from '@theme/useAppTheme';

import { getInitials } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { getContactDetails, normalizeContactSearch } from '../contactUtils';

interface ContactsListScreenProps {
  material?: Material;
  onSelectTab: (tab: MainTabId) => void;
  onOpenContact: (contactId: number) => void;
  onCreateContact: () => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
  onBack: () => void;
}

export function ContactsListScreen({ material = 'solid', onSelectTab, onOpenContact, onCreateContact, onCreate, onNotifications, onAccount, onBack }: ContactsListScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const contactsQuery = useContactsQuery();
  const notificationsQuery = useNotificationsQuery();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const contacts = contactsQuery.data ?? [];
  const normalizedSearch = normalizeContactSearch(search);
  const visibleContacts = useMemo(() => contacts
    .filter((contact) => normalizeContactSearch(`${contact.nom} ${contact.profession ?? ''} ${contact.telephone ?? ''} ${contact.email ?? ''}`).includes(normalizedSearch))
    .sort((left, right) => left.nom.localeCompare(right.nom, 'fr')),
  [contacts, normalizedSearch]);
  const groupedContacts = useMemo(() => Object.entries(visibleContacts.reduce<Record<string, typeof visibleContacts>>((groups, contact) => { const key = contact.nom.trim()[0]?.toLocaleUpperCase() || '#'; (groups[key] ??= []).push(contact); return groups; }, {})), [visibleContacts]);
  const state = resolveAsyncState({ loading: contactsQuery.isLoading, error: contactsQuery.isError, hasData: contacts.length > 0 });
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.is_read).length;

  return <>
    <RootScreen
      header={<TopBar title="Contacts" context="detail" onBack={onBack} material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />}
      bottomBar={<BottomBar items={tabs} activeId="more" onSelect={onSelectTab} material={material} testID="main-tabs" />}
      floatingAction={<FloatingActionButton accessibilityLabel="Créer" testID="contacts-create" onPress={() => setCreateOpen(true)} material={material} />}
      refreshControl={<RefreshControl refreshing={contactsQuery.isRefetching} onRefresh={() => void contactsQuery.refetch()} />}
      contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
      material={material}
      testID="contacts-list"
    >
      <SearchField value={search} onChangeText={setSearch} placeholder="Rechercher un contact" accessibilityLabel="Rechercher un contact" testID="contacts-search" />
      {state === 'loading' ? <View style={{ gap: spacing.md }}><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></View>
        : state === 'error' ? <ErrorState title="Liste indisponible" message="Impossible de charger vos contacts. Vérifiez la connexion puis réessayez." onRetry={() => void contactsQuery.refetch()} />
          : visibleContacts.length === 0 ? <EmptyState type={normalizedSearch ? 'search' : 'generic'} title={normalizedSearch ? 'Aucun résultat' : 'Aucun contact'} message={normalizedSearch ? 'Essayez un autre nom, rôle ou moyen de contact.' : 'Ajoutez les personnes utiles pour les retrouver ici.'} actionLabel={normalizedSearch ? 'Effacer la recherche' : undefined} onAction={normalizedSearch ? () => setSearch('') : undefined} />
            : <View style={{ gap: spacing.lg }}>{groupedContacts.map(([letter, items]) => <View key={letter} style={{ gap: spacing.sm }}><Text accessibilityRole="header" style={{ color: colors.primaryDark, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>{letter}</Text>{items?.map((contact) => <ContactCard key={contact.id} name={contact.nom} details={getContactDetails(contact)} phoneLabel={contact.telephone || contact.email || 'Coordonnées à compléter'} onPress={() => onOpenContact(contact.id)} testID={`contact-card-${contact.id}`} />)}</View>)}</View>}
    </RootScreen>
    <GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={onCreate} material={material} testID="contacts-create-menu" />
    </>;
}
