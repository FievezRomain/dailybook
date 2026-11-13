import { useState } from 'react';
import * as Location from 'expo-location';
import { Text, View } from 'react-native';
import { Banner, Button, Card, FormSheet } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useWalkRoutePlanMutations } from '../../../hooks/queries/useEventsQuery';
import type { WalkRoutePlan, WalkRouteProposal } from '../types';
import { WalkRouteMap } from './WalkRouteMap';

const DISTANCE_OPTIONS = [2_000, 4_000, 6_000, 10_000] as const;

function distanceLabel(meters: number) {
  return `${(meters / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}

function durationLabel(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours ? `${hours} h ${String(remaining).padStart(2, '0')}` : `${minutes} min`;
}

export function WalkRoutePlanCard({
  plan,
  onChange,
  onDelete,
}: {
  plan: WalkRoutePlan;
  onChange: () => void;
  onDelete: () => void;
}) {
  const { colors } = useAppTheme();
  return <Card style={{ gap: spacing.md }}>
    <View style={{ gap: spacing.xs }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{plan.name}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>Itinéraire préparé · {distanceLabel(plan.distance_meters)} · {durationLabel(plan.duration_seconds)}</Text>
    </View>
    <WalkRouteMap points={plan.points} planned />
    <Button label="Changer d’itinéraire" icon="compass" variant="secondary" fullWidth onPress={onChange} />
    <Button label="Supprimer l’itinéraire" icon="delete" variant="ghost" fullWidth onPress={onDelete} />
  </Card>;
}

export function WalkRoutePlannerSheet({
  eventId,
  currentPlan,
  onClose,
}: {
  eventId: number;
  currentPlan?: WalkRoutePlan;
  onClose: () => void;
}) {
  const { colors } = useAppTheme();
  const mutations = useWalkRoutePlanMutations(eventId);
  const [targetDistance, setTargetDistance] = useState(currentPlan?.target_distance_meters ?? 4_000);
  const [proposals, setProposals] = useState<WalkRouteProposal[]>([]);
  const [error, setError] = useState<string>();

  const generate = async () => {
    setError(undefined);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setError('Autorisez la localisation pour proposer des boucles autour de votre position.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const routes = await mutations.propose.mutateAsync({
        start_latitude: location.coords.latitude,
        start_longitude: location.coords.longitude,
        target_distance_meters: targetDistance,
      });
      setProposals(routes);
    } catch {
      setError('Aucun itinéraire n’a pu être calculé ici. Vérifiez la connexion ou essayez une autre distance.');
    }
  };

  const choose = async (proposal: WalkRouteProposal) => {
    setError(undefined);
    try {
      await mutations.save.mutateAsync(proposal);
      onClose();
    } catch {
      setError('L’itinéraire n’a pas pu être enregistré. Réessayez.');
    }
  };

  return <FormSheet
    title={currentPlan ? 'Changer d’itinéraire' : 'Préparer la balade'}
    onBack={onClose}
    onClose={onClose}
    footerLabel={proposals.length ? 'Recalculer les itinéraires' : 'Proposer des itinéraires'}
    onFooterPress={() => void generate()}
    footerLoading={mutations.propose.isPending}
    dirty={proposals.length > 0}
    confirmBackWhenDirty
    testID="walk-route-planner"
  >
    <Card style={{ gap: spacing.sm }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Des boucles adaptées à la marche</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Vasco utilise les chemins piétons IGN autour de votre position. Vérifiez toujours l’accessibilité locale et les éventuelles restrictions.</Text>
    </Card>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Distance souhaitée</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {DISTANCE_OPTIONS.map((distance) => <Button
          key={distance}
          label={distanceLabel(distance)}
          variant={targetDistance === distance ? 'primary' : 'secondary'}
          onPress={() => { setTargetDistance(distance); setProposals([]); }}
          accessibilityLabel={`Choisir une balade de ${distanceLabel(distance)}`}
        />)}
      </View>
    </View>
    {error ? <Banner tone="error" title="Calcul impossible" message={error} onDismiss={() => setError(undefined)} /> : null}
    {proposals.map((proposal) => <Card key={proposal.name} style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{proposal.name}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{distanceLabel(proposal.distance_meters)} · environ {durationLabel(proposal.duration_seconds)}</Text>
      </View>
      <WalkRouteMap points={proposal.points} planned />
      <Button label="Choisir cet itinéraire" icon="circleCheck" fullWidth loading={mutations.save.isPending} disabled={mutations.save.isPending} onPress={() => void choose(proposal)} />
    </Card>)}
  </FormSheet>;
}
