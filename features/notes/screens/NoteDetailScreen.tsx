import { useState } from 'react';
import { Share, Text, View } from 'react-native';
import { useNoteMutations, useNotesQuery } from '../../../hooks/queries/useNotesQuery';
import { ActionSheet, Banner, Card, DetailScreen, Dialog, EmptyState, ErrorState, IconButton, Skeleton, TopBar, type OverlayActionItem } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getNoteMetadata } from '../noteUtils';

type NoteAction = 'pin' | 'edit' | 'share' | 'delete';

interface NoteDetailScreenProps {
  noteId: number;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

export function NoteDetailScreen({ noteId, onBack, onEdit, onDeleted }: NoteDetailScreenProps) {
  const { colors } = useAppTheme();
  const notesQuery = useNotesQuery();
  const mutations = useNoteMutations();
  const note = (notesQuery.data ?? []).find((item) => item.id === noteId);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareError, setShareError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [pinError, setPinError] = useState(false);

  if (notesQuery.isLoading) return <DetailScreen header={<TopBar title="Note" context="detail" onBack={onBack} />}><Skeleton type="card" density="comfortable" /></DetailScreen>;
  if (notesQuery.isError) return <DetailScreen header={<TopBar title="Note" context="detail" onBack={onBack} />}><ErrorState message="Impossible de charger cette note." onRetry={() => void notesQuery.refetch()} /></DetailScreen>;
  if (!note) return <DetailScreen header={<TopBar title="Note" context="detail" onBack={onBack} />}><EmptyState title="Note introuvable" message="Elle a peut-être été supprimée." actionLabel="Retour aux notes" onAction={onBack} /></DetailScreen>;

  const actions: readonly OverlayActionItem<NoteAction>[] = [
    { id: 'pin', label: note.is_pinned ? 'Désépingler' : 'Épingler', description: note.is_pinned ? 'Retirer des notes prioritaires' : 'Garder en haut de la liste', icon: 'pin' },
    { id: 'edit', label: 'Modifier', description: 'Éditer le titre et le contenu', icon: 'edit' },
    { id: 'share', label: 'Partager', description: 'Envoyer avec les applications du téléphone', icon: 'share' },
    { id: 'delete', label: 'Supprimer', description: 'Une confirmation sera demandée', icon: 'delete', tone: 'destructive' },
  ];
  const metadata = getNoteMetadata(note);

  const selectAction = (action: NoteAction) => {
    setActionsOpen(false);
    if (action === 'pin') {
      setPinError(false);
      void mutations.update.mutateAsync({ id: String(note.id), body: { id: note.id, titre: note.titre, note: note.note, is_pinned: !note.is_pinned } }).catch(() => setPinError(true));
    }
    if (action === 'edit') onEdit();
    if (action === 'delete') setDeleteOpen(true);
    if (action === 'share') {
      setShareError(false);
      void Share.share({ title: note.titre, message: `${note.titre}\n\n${note.note}` }).catch(() => setShareError(true));
    }
  };

  return <>
    <DetailScreen header={<TopBar title="Note" context="detail" onBack={onBack} />} contentContainerStyle={{ gap: spacing.lg, paddingTop: spacing.lg }} testID="note-detail">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
        <Text accessibilityRole="header" style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32 }}>{note.titre}</Text>
        <IconButton icon="moreHorizontal" accessibilityLabel="Actions sur la note" variant="ghost" onPress={() => setActionsOpen(true)} />
      </View>
      {shareError ? <Banner tone="error" title="Partage impossible" message="Le menu de partage n’a pas pu être ouvert. Réessayez." onDismiss={() => setShareError(false)} /> : null}
      {deleteError ? <Banner tone="error" title="Suppression impossible" message="La note est conservée. Réessayez." onDismiss={() => setDeleteError(false)} /> : null}
      {pinError ? <Banner tone="error" title="Modification impossible" message="La note conserve son état actuel. Réessayez." onDismiss={() => setPinError(false)} /> : null}
      {metadata ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{metadata}</Text> : null}
      <Card accessibilityLabel={note.note} style={{ minHeight: 330, justifyContent: 'flex-start' }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{note.note}</Text>
      </Card>
    </DetailScreen>
    <ActionSheet open={actionsOpen} title="Actions sur la note" subtitle={note.titre} items={actions} onSelect={selectAction} onClose={() => setActionsOpen(false)} testID="note-actions" />
    <Dialog open={deleteOpen} type="destructive" title="Supprimer cette note ?" description="Cette note sera définitivement supprimée. Cette action est irréversible." confirmLabel="Supprimer" loading={mutations.remove.isPending} onClose={() => setDeleteOpen(false)} onError={() => setDeleteError(true)} onConfirm={async () => { await mutations.remove.mutateAsync(String(note.id)); onDeleted(); }} testID="note-delete-confirmation" />
  </>;
}