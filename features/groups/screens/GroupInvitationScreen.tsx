import { useState } from 'react';
import { Text, View } from 'react-native';

import { useGroupMutations, useInvitationsQuery } from '../../../hooks/queries/useGroupsQuery';
import { Banner, Button, EmptyState, ErrorState, RootScreen, Skeleton, TopBar } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

interface GroupInvitationScreenProps {
  invitationId: number;
  onBack: () => void;
  onAccepted: () => void;
  onDeclined: () => void;
}

export function GroupInvitationScreen({ invitationId, onBack, onAccepted, onDeclined }: GroupInvitationScreenProps) {
  const { colors } = useAppTheme();
  const invitationsQuery = useInvitationsQuery();
  const mutations = useGroupMutations();
  const [error, setError] = useState<string>();
  const invitation = (invitationsQuery.data ?? []).find((item) => item.id === invitationId);
  const pending = mutations.respondInvitation.isPending;

  if (invitationsQuery.isLoading) return <RootScreen header={<TopBar title="Invitation" context="detail" onBack={onBack} />} bottomBar={null}><Skeleton type="card" density="comfortable" /></RootScreen>;
  if (invitationsQuery.isError) return <RootScreen header={<TopBar title="Invitation" context="detail" onBack={onBack} />} bottomBar={null}><ErrorState message="Impossible de charger cette invitation." onRetry={() => void invitationsQuery.refetch()} /></RootScreen>;
  if (!invitation) return <RootScreen header={<TopBar title="Invitation" context="detail" onBack={onBack} />} bottomBar={null}><EmptyState title="Invitation introuvable" message="Elle a peut-être déjà reçu une réponse." actionLabel="Retour aux groupes" onAction={onBack} /></RootScreen>;

  const respond = async (status: 'accepted' | 'declined') => {
    setError(undefined);
    try {
      await mutations.respondInvitation.mutateAsync({ invitationId: String(invitation.id), body: { status } });
      if (status === 'accepted') onAccepted(); else onDeclined();
    } catch {
      setError("Votre réponse n’a pas pu être enregistrée. Réessayez.");
    }
  };

  return <RootScreen header={<TopBar title="Invitation" context="detail" onBack={onBack} />} bottomBar={null} contentContainerStyle={{ gap: spacing.lg, paddingTop: spacing.xl }} testID="group-invitation">
    <View style={{ gap: spacing.sm }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl }}>{invitation.group_name || `Groupe ${invitation.group_id}`}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>{invitation.proposed_by_name ? `${invitation.proposed_by_name} vous invite à rejoindre ce groupe.` : 'Vous êtes invité à rejoindre ce groupe.'}</Text></View>
    <View style={{ padding: spacing.md, gap: spacing.sm, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Ce qui sera partagé</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.normal }}>Vous pourrez consulter et contribuer selon les droits accordés. Les animaux et leurs données restent sous le contrôle de leur propriétaire.</Text></View>
    {error ? <Banner tone="error" title="Réponse impossible" message={error} blocking /> : null}
    <View style={{ gap: spacing.sm }}><Button label="Rejoindre le groupe" fullWidth size="large" loading={pending} onPress={() => void respond('accepted')} testID="group-invitation-accept" /><Button label="Refuser l’invitation" fullWidth size="large" variant="secondary" disabled={pending} onPress={() => void respond('declined')} testID="group-invitation-decline" /></View>
  </RootScreen>;
}