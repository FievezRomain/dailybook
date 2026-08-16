import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useGroupAnimalsQuery, useGroupMutations, useGroupsQuery, usePendingAnimalSharesQuery } from '../../../hooks/queries/useGroupsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import { ActionSheet, Banner, Button, Card, Dialog, EmptyState, ErrorState, IconButton, RootScreen, Skeleton, StatusBadge, TabBar, TopBar, type OverlayActionItem } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getAcceptedAnimals, getAcceptedMembers, getGroupInitials, getPendingAnimals, getPendingMembers, isGroupManager } from '../groupUtils';

type GroupTab = 'animals' | 'members';
type GroupAction = 'edit' | 'delete';
const groupTabs = [{ id: 'animals', label: 'Animaux' }, { id: 'members', label: 'Membres' }] as const;
const groupActions: readonly OverlayActionItem<GroupAction>[] = [
  { id: 'edit', label: 'Modifier le groupe', description: 'Informations, membres et animaux', icon: 'edit' },
  { id: 'delete', label: 'Supprimer le groupe', description: 'Interrompt tous les partages', icon: 'delete', tone: 'destructive' },
];

interface GroupDetailScreenProps {
  groupId: number;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
  onAddMember: () => void;
  onAddAnimal: () => void;
}

export function GroupDetailScreen({ groupId, onBack, onEdit, onDeleted, onAddMember, onAddAnimal }: GroupDetailScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const groupsQuery = useGroupsQuery();
  const group = (groupsQuery.data ?? []).find((item) => item.id === groupId);
  const manager = group ? isGroupManager(group, user?.email) : false;
  const animalsQuery = useGroupAnimalsQuery(String(groupId));
  const pendingSharesQuery = usePendingAnimalSharesQuery(String(groupId), manager);
  const mutations = useGroupMutations();
  const [tab, setTab] = useState<GroupTab>('animals');
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState<string>();
  const [animalTarget, setAnimalTarget] = useState<{ id: number; name: string }>();
  const [error, setError] = useState<string>();

  if (groupsQuery.isLoading) return <RootScreen header={<TopBar title="Groupes" context="detail" onBack={onBack} />} bottomBar={null}><Skeleton type="card" density="comfortable" /></RootScreen>;
  if (groupsQuery.isError) return <RootScreen header={<TopBar title="Groupes" context="detail" onBack={onBack} />} bottomBar={null}><ErrorState message="Impossible de charger ce groupe." onRetry={() => void groupsQuery.refetch()} /></RootScreen>;
  if (!group) return <RootScreen header={<TopBar title="Groupes" context="detail" onBack={onBack} />} bottomBar={null}><EmptyState title="Groupe introuvable" message="Il a peut-être été supprimé." actionLabel="Retour aux groupes" onAction={onBack} /></RootScreen>;

  const members = getAcceptedMembers(group);
  const invitedMembers = getPendingMembers(group);
  const fallbackAnimals = getAcceptedAnimals(group);
  const animals = animalsQuery.data?.length ? animalsQuery.data : fallbackAnimals;
  const pendingAnimals = getPendingAnimals(group);
  const pendingShares = pendingSharesQuery.data ?? [];
  const mutate = async (operation: () => Promise<unknown>, success: () => void) => {
    setError(undefined);
    try { await operation(); success(); } catch { setError("L’action n’a pas pu être enregistrée. Réessayez."); }
  };

  return <>
    <RootScreen header={<TopBar title={group.name} context="detail" onBack={onBack} />} bottomBar={null} contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }} testID="group-detail">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}><View style={{ flex: 1, gap: spacing.xs }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 35 }}>{group.name}</Text><Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{manager ? 'Gestionnaire' : 'Membre'}</Text></View>{manager ? <IconButton icon="moreHorizontal" accessibilityLabel="Actions sur le groupe" variant="ghost" onPress={() => setActionsOpen(true)} /> : null}</View>
      {group.informations ? <View style={{ padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.normal }}>{group.informations}</Text></View> : null}
      <TabBar items={[{ id: 'animals', label: `Animaux (${animals.length})` }, { id: 'members', label: `Membres (${members.length})` }]} activeId={tab} onSelect={setTab} fullWidthIndicator style={{ backgroundColor: 'transparent' }} />
      {error ? <Banner tone="error" title="Action impossible" message={error} onDismiss={() => setError(undefined)} /> : null}
      {tab === 'animals' ? <View style={{ gap: spacing.lg }}>
        <Button label="Ajouter un animal" icon="add" variant="secondary" fullWidth onPress={onAddAnimal} />
        {animalsQuery.isLoading ? <Skeleton type="card" density="comfortable" /> : animalsQuery.isError ? <ErrorState title="Animaux indisponibles" message="Le groupe reste accessible. Réessayez de charger ses animaux." onRetry={() => void animalsQuery.refetch()} /> : animals.length === 0 ? <EmptyState title="Aucun animal partagé" message="Proposez un animal pour commencer le partage." /> : <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{animals.map((animal) => <AnimalCircle key={animal.id} name={animal.nom} selected={false} onPress={manager ? () => setAnimalTarget({ id: animal.id, name: animal.nom }) : undefined} />)}</View>}
        {pendingAnimals.length || pendingShares.length ? <View style={{ gap: spacing.sm }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Propositions en attente</Text>{manager && pendingShares.length ? pendingShares.map((share) => <Card key={share.id} style={{ gap: spacing.sm }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><View style={{ flex: 1 }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold }}>{share.animal_name || `Animal ${share.animal_id}`}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{share.proposed_by_name ? `Proposé par ${share.proposed_by_name}` : 'En attente de votre accord'}</Text></View><StatusBadge label="En attente" tone="warning" /></View><View style={{ flexDirection: 'row', gap: spacing.sm }}><Button label="Accepter" size="small" onPress={() => void mutate(() => mutations.respondAnimalShare.mutateAsync({ shareId: String(share.id), body: { status: 'accepted', animaux: [share.animal_id] } }), () => void pendingSharesQuery.refetch())} /><Button label="Refuser" size="small" variant="secondary" onPress={() => void mutate(() => mutations.respondAnimalShare.mutateAsync({ shareId: String(share.id), body: { status: 'declined', animaux: [share.animal_id] } }), () => void pendingSharesQuery.refetch())} /></View></Card>) : pendingAnimals.map((animal) => <Card key={animal.id}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold }}>{animal.nom}</Text><StatusBadge label="En attente d’acceptation" tone="warning" /></Card>)}</View> : null}
      </View> : <View style={{ gap: spacing.md }}>
        {manager ? <Button label="Inviter un membre" icon="add" variant="secondary" fullWidth onPress={onAddMember} /> : null}
        {members.map((member) => <MemberRow key={member.email} email={member.email} name={member.prenom || member.email} role={member.role === 'manager' ? 'Gestionnaire' : 'Membre'} onPress={manager && member.role !== 'manager' ? () => setMemberEmail(member.email) : undefined} />)}
        {invitedMembers.map((member) => <MemberRow key={member.email} email={member.email} name={member.email} role="Invité" pending />)}
      </View>}
    </RootScreen>
    <ActionSheet open={actionsOpen} title="Actions sur le groupe" subtitle={group.name} items={groupActions} onClose={() => setActionsOpen(false)} onSelect={(action) => { setActionsOpen(false); if (action === 'edit') onEdit(); else setDeleteGroupOpen(true); }} />
    <Dialog open={deleteGroupOpen} type="destructive" title="Supprimer ce groupe ?" description={`Les partages de ${group.name} seront interrompus. Aucun animal ni événement d’origine ne sera supprimé.`} confirmLabel="Supprimer le groupe" loading={mutations.remove.isPending} onClose={() => setDeleteGroupOpen(false)} onConfirm={() => void mutate(() => mutations.remove.mutateAsync(String(group.id)), onDeleted)} />
    <Dialog open={Boolean(memberEmail)} type="destructive" title="Retirer ce membre ?" description={`${memberEmail || 'Ce membre'} perdra l’accès partagé. Ses données d’origine seront conservées.`} confirmLabel="Retirer du groupe" loading={mutations.removeMember.isPending} onClose={() => setMemberEmail(undefined)} onConfirm={() => { if (memberEmail) void mutate(() => mutations.removeMember.mutateAsync({ groupId: String(group.id), body: { email: memberEmail } }), () => setMemberEmail(undefined)); }} />
    <Dialog open={Boolean(animalTarget)} type="destructive" title="Retirer cet animal ?" description={`${animalTarget?.name || 'Cet animal'} ne sera plus partagé avec le groupe. Son carnet et ses données d’origine seront conservés.`} confirmLabel="Retirer du groupe" loading={mutations.removeAnimal.isPending} onClose={() => setAnimalTarget(undefined)} onConfirm={() => animalTarget && void mutate(() => mutations.removeAnimal.mutateAsync({ groupId: String(group.id), animalId: String(animalTarget.id) }), () => setAnimalTarget(undefined))} />
  </>;
}

function AnimalCircle({ name, onPress }: { name: string; selected: boolean; onPress?: () => void }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole={onPress ? 'button' : 'text'} accessibilityLabel={onPress ? `${name}, actions` : name} onPress={onPress} disabled={!onPress} style={({ pressed }) => ({ width: 76, alignItems: 'center', gap: spacing.sm, opacity: pressed ? 0.8 : 1 })}><View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.surfaceVariant }}><Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold }}>{getGroupInitials(name)}</Text></View><Text numberOfLines={1} style={{ width: 76, textAlign: 'center', color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{name}</Text></Pressable>;
}

function MemberRow({ name, email, role, pending = false, onPress }: { name: string; email: string; role: string; pending?: boolean; onPress?: () => void }) {
  const { colors } = useAppTheme();
  return <Card onPress={onPress} accessibilityLabel={`${name}, ${email}, ${role}`} style={{ minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><View style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, backgroundColor: colors.primaryLight }}><Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>{getGroupInitials(name)}</Text></View><View style={{ flex: 1, minWidth: 0 }}><Text numberOfLines={1} style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold }}>{name}</Text><Text numberOfLines={1} style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{email}</Text></View><StatusBadge label={role} tone={pending ? 'warning' : 'info'} /></Card>;
}
