import { useMemo, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery';
import { useNotesQuery } from '../../../hooks/queries/useNotesQuery';
import { BottomBar, EmptyState, ErrorState, FloatingActionButton, GlobalCreateMenu, RootScreen, SearchField, Skeleton, TopBar, resolveAsyncState, type GlobalCreateTarget } from '../../../shared/components/ui';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { Material } from '../../../theme/materials';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getInitials } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { NoteCard } from '../components/NoteCard';
import { filterNotes } from '../noteUtils';

interface NotesListScreenProps {
  material?: Material;
  onSelectTab: (tab: MainTabId) => void;
  onOpenNote: (noteId: number) => void;
  onCreateNote: () => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function NotesListScreen({ material = 'solid', onSelectTab, onOpenNote, onCreateNote, onCreate, onNotifications, onAccount }: NotesListScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const notesQuery = useNotesQuery();
  const notificationsQuery = useNotificationsQuery();
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const notes = notesQuery.data ?? [];
  const visibleNotes = useMemo(() => filterNotes(notes, query), [notes, query]);
  const state = resolveAsyncState({ loading: notesQuery.isLoading, error: notesQuery.isError, hasData: notes.length > 0 });
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.is_read).length;

  return <>
    <RootScreen
      header={<TopBar title="Notes" material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />}
      bottomBar={<BottomBar items={tabs} activeId="more" onSelect={onSelectTab} material={material} testID="main-tabs" />}
      floatingAction={<FloatingActionButton accessibilityLabel="Créer" testID="notes-create" onPress={() => setCreateOpen(true)} material={material} />}
      refreshControl={<RefreshControl refreshing={notesQuery.isRefetching} onRefresh={() => void notesQuery.refetch()} />}
      contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}
      material={material}
      testID="notes-list"
    >
      <SearchField label="Rechercher dans les notes" placeholder="Rechercher dans les notes" value={query} onChangeText={setQuery} onClear={() => setQuery('')} />
      <View style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text accessibilityRole="header" style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl }}>Vos notes</Text>
          <Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{notes.length} {notes.length > 1 ? 'notes' : 'note'}</Text>
        </View>
        {state === 'loading' ? <LoadingNotes /> : state === 'error' ? <ErrorState message="Impossible de charger vos notes." onRetry={() => void notesQuery.refetch()} /> : notes.length === 0 ? <EmptyState title="Aucune note pour le moment" message="Écrivez une note pour garder une idée ou une information importante." /> : visibleNotes.length === 0 ? <EmptyState title="Aucun résultat" message="Essayez avec d’autres mots." actionLabel="Effacer la recherche" onAction={() => setQuery('')} /> : visibleNotes.map((note) => <NoteCard key={note.id} note={note} material={material} onPress={() => onOpenNote(note.id)} />)}
      </View>
    </RootScreen>
    <GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={onCreate} material={material} testID="notes-create-menu" />
  </>;
}

function LoadingNotes() {
  return <View style={{ gap: spacing.md }}><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></View>;
}
