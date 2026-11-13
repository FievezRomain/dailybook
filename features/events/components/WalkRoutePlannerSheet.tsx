import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Text, View } from 'react-native';
import { Banner, Button, Card, FormSheet, NumberStepper } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useWalkRoutePlanMutations } from '../../../hooks/queries/useEventsQuery';
import { parseApiError } from '../../../utils/errorParser';
import type { WalkRoutePlan, WalkRouteProposal, WalkRouteSort } from '../types';
import {
  DEFAULT_WALK_ROUTE_FILTERS,
  buildWalkRouteFilterPayload,
  validateWalkRouteFilters,
  walkRouteSortHasOrder,
  type WalkRouteFilterState,
} from '../walkRouteFilters';
import { WalkRouteMap } from './WalkRouteMap';

const ROUTE_TYPE_OPTIONS = [
  { value: 'loop' as const, label: 'Boucle' },
  { value: 'one_way' as const, label: 'Aller simple' },
];
const SORT_OPTIONS: { value: WalkRouteSort; label: string }[] = [
  { value: 'recommended', label: 'Recommandé' },
  { value: 'distance', label: 'Distance' },
  { value: 'duration', label: 'Durée' },
  { value: 'less_roads', label: 'Moins de routes' },
  { value: 'highlights', label: 'Lieux remarquables' },
];

function distanceLabel(meters: number) {
  return `${(meters / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}

function durationLabel(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours ? `${hours} h ${String(remaining).padStart(2, '0')}` : `${minutes} min`;
}

function preferenceLabel(route: Pick<WalkRouteProposal, 'avoid_roads' | 'avoid_water' | 'prefer_scenic'>) {
  const preferences = [
    route.avoid_roads ? 'routes évitées' : undefined,
    route.avoid_water ? 'ponts évités' : undefined,
    route.prefer_scenic ? 'lieux remarquables privilégiés' : undefined,
  ].filter(Boolean);
  return preferences.join(' · ');
}

function routeTypeLabel(routeType: WalkRouteProposal['route_type']) {
  if (routeType === 'one_way') return 'Aller simple';
  if (routeType === 'out_and_back') return 'Aller-retour';
  return 'Boucle';
}

function RouteHighlights({ highlights }: Pick<WalkRouteProposal, 'highlights'>) {
  const { colors } = useAppTheme();
  if (!highlights.length) return null;
  return <View style={{ gap: spacing.xs }}>
    <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>À découvrir sur le parcours</Text>
    {highlights.map((highlight) => <Text
      key={`${highlight.name}-${highlight.latitude}-${highlight.longitude}`}
      style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}
    >• {highlight.name} · {highlight.category}</Text>)}
  </View>;
}

export function WalkRoutePlanCard({
  plan,
  onChange,
  onDelete,
  locked = false,
}: {
  plan: WalkRoutePlan;
  onChange: () => void;
  onDelete: () => void;
  locked?: boolean;
}) {
  const { colors } = useAppTheme();
  return <Card style={{ gap: spacing.md }}>
    <View style={{ gap: spacing.xs }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{plan.name}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{routeTypeLabel(plan.route_type)} préparé · {distanceLabel(plan.distance_meters)} · {durationLabel(plan.duration_seconds)}</Text>
      {preferenceLabel(plan) ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{preferenceLabel(plan)}</Text> : null}
      {plan.destination_label ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>Arrivée : {plan.destination_label}</Text> : null}
      {plan.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{plan.attribution}{plan.license ? ` · ${plan.license}` : ''}</Text> : null}
    </View>
    <WalkRouteMap points={plan.points} highlights={plan.highlights} planned />
    <RouteHighlights highlights={plan.highlights} />
    {locked
      ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Cet itinéraire ne peut plus être modifié car le suivi GPS a déjà démarré.</Text>
      : <>
        <Button label="Changer d’itinéraire" icon="compass" variant="secondary" fullWidth onPress={onChange} />
        <Button label="Supprimer l’itinéraire" icon="delete" variant="ghost" fullWidth onPress={onDelete} />
      </>}
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
  const proposeRoutes = mutations.propose.mutateAsync;
  const [filters, setFilters] = useState<WalkRouteFilterState>(() => {
    const target = currentPlan?.target_distance_meters;
    if (!target) return DEFAULT_WALK_ROUTE_FILTERS;
    return {
      ...DEFAULT_WALK_ROUTE_FILTERS,
      minDistanceMeters: Math.max(1_000, target - 1_000),
      maxDistanceMeters: Math.min(30_000, target + 1_000),
    };
  });
  const [routeType, setRouteType] = useState<'loop' | 'one_way'>(currentPlan?.route_type === 'one_way' ? 'one_way' : 'loop');
  const [avoidRoads, setAvoidRoads] = useState(currentPlan?.avoid_roads ?? false);
  const [avoidWater, setAvoidWater] = useState(currentPlan?.avoid_water ?? false);
  const [preferScenic, setPreferScenic] = useState(currentPlan?.prefer_scenic ?? false);
  const [proposals, setProposals] = useState<WalkRouteProposal[]>([]);
  const [error, setError] = useState<string>();
  const locationRef = useRef<{ latitude: number; longitude: number } | undefined>(undefined);
  const generationRef = useRef(0);
  const requestedRef = useRef(false);

  const generate = useCallback(async () => {
    const validationError = validateWalkRouteFilters(filters);
    if (validationError) {
      setError(validationError);
      return;
    }
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    setError(undefined);
    setProposals([]);
    try {
      let start = locationRef.current;
      if (!start) {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== Location.PermissionStatus.GRANTED) {
          setError('Autorisez la localisation pour proposer des itinéraires autour de votre position.');
          return;
        }
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        start = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        locationRef.current = start;
      }
      const routes = await proposeRoutes({
        start_latitude: start.latitude,
        start_longitude: start.longitude,
        ...buildWalkRouteFilterPayload(filters),
        route_type: routeType,
        avoid_roads: avoidRoads,
        avoid_water: avoidWater,
        prefer_scenic: preferScenic,
      });
      if (generationRef.current === generation) setProposals(routes);
    } catch (generationError) {
      if (generationRef.current === generation) setError(parseApiError(generationError).message);
    }
  }, [avoidRoads, avoidWater, filters, preferScenic, proposeRoutes, routeType]);

  useEffect(() => {
    if (!requestedRef.current || !locationRef.current) return;
    const timeout = setTimeout(() => void generate(), 500);
    return () => clearTimeout(timeout);
  }, [generate]);

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
    onFooterPress={() => {
      requestedRef.current = true;
      void generate();
    }}
    footerLoading={mutations.propose.isPending}
    dirty={proposals.length > 0}
    confirmBackWhenDirty
    testID="walk-route-planner"
  >
    <Card style={{ gap: spacing.sm }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Un itinéraire adapté à la marche</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Choisissez une boucle qui revient au départ ou un aller simple. Vasco utilise les chemins piétons IGN autour de votre position.</Text>
    </Card>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Type de parcours</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {ROUTE_TYPE_OPTIONS.map((option) => <Button
          key={option.value}
          label={option.label}
          variant={routeType === option.value ? 'primary' : 'secondary'}
          onPress={() => {
            if (routeType === option.value) return;
            setRouteType(option.value);
          }}
          accessibilityLabel={'Choisir le type ' + option.label}
        />)}
      </View>
    </View>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Filtrer les propositions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Button
          label="Par distance"
          icon={filters.mode === 'distance' ? 'circleCheck' : undefined}
          variant="secondary"
          onPress={() => setFilters((value) => ({ ...value, mode: 'distance' }))}
          accessibilityLabel="Filtrer les itinéraires par distance"
        />
        <Button
          label="Par durée"
          icon={filters.mode === 'duration' ? 'circleCheck' : undefined}
          variant="secondary"
          onPress={() => setFilters((value) => ({ ...value, mode: 'duration' }))}
          accessibilityLabel="Filtrer les itinéraires par durée"
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {filters.mode === 'distance' ? <>
          <NumberStepper
            label="Distance minimale"
            value={filters.minDistanceMeters}
            min={1_000}
            max={30_000}
            step={500}
            formatValue={distanceLabel}
            errorMessage={filters.minDistanceMeters > filters.maxDistanceMeters ? 'Supérieure au maximum' : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, minDistanceMeters: value }))}
          />
          <NumberStepper
            label="Distance maximale"
            value={filters.maxDistanceMeters}
            min={1_000}
            max={30_000}
            step={500}
            formatValue={distanceLabel}
            errorMessage={filters.minDistanceMeters > filters.maxDistanceMeters ? 'Inférieure au minimum' : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, maxDistanceMeters: value }))}
          />
        </> : <>
          <NumberStepper
            label="Durée minimale"
            value={filters.minDurationSeconds}
            min={600}
            max={43_200}
            step={900}
            formatValue={durationLabel}
            errorMessage={filters.minDurationSeconds > filters.maxDurationSeconds ? 'Supérieure au maximum' : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, minDurationSeconds: value }))}
          />
          <NumberStepper
            label="Durée maximale"
            value={filters.maxDurationSeconds}
            min={600}
            max={43_200}
            step={900}
            formatValue={durationLabel}
            errorMessage={filters.minDurationSeconds > filters.maxDurationSeconds ? 'Inférieure au minimum' : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, maxDurationSeconds: value }))}
          />
        </>}
      </View>
    </View>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Trier les itinéraires</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {SORT_OPTIONS.map((option) => <Button
          key={option.value}
          label={option.label}
          icon={filters.sortBy === option.value ? 'circleCheck' : undefined}
          variant="secondary"
          onPress={() => setFilters((value) => ({ ...value, sortBy: option.value }))}
          accessibilityLabel={`Trier par ${option.label}`}
        />)}
      </View>
      {walkRouteSortHasOrder(filters.sortBy) ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Button
          label="Croissant"
          icon={filters.sortOrder === 'asc' ? 'circleCheck' : undefined}
          variant="secondary"
          onPress={() => setFilters((value) => ({ ...value, sortOrder: 'asc' }))}
          accessibilityLabel="Ordre croissant"
        />
        <Button
          label="Décroissant"
          icon={filters.sortOrder === 'desc' ? 'circleCheck' : undefined}
          variant="secondary"
          onPress={() => setFilters((value) => ({ ...value, sortOrder: 'desc' }))}
          accessibilityLabel="Ordre décroissant"
        />
      </View> : null}
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, lineHeight: typography.lineHeights.tight }}>Après le premier calcul, toute modification relance automatiquement la recherche.</Text>
    </View>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Préférences du parcours</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Button
          label="Éviter les routes"
          icon={avoidRoads ? 'circleCheck' : undefined}
          variant={avoidRoads ? 'primary' : 'secondary'}
          onPress={() => {
            const next = !avoidRoads;
            setAvoidRoads(next);
          }}
          accessibilityLabel={`${avoidRoads ? 'Désactiver' : 'Activer'} le filtre éviter les routes`}
        />
        <Button
          label="Éviter les passages d’eau"
          icon={avoidWater ? 'circleCheck' : undefined}
          variant={avoidWater ? 'primary' : 'secondary'}
          onPress={() => {
            const next = !avoidWater;
            setAvoidWater(next);
          }}
          accessibilityLabel={`${avoidWater ? 'Désactiver' : 'Activer'} le filtre éviter les passages d’eau`}
        />
        <Button
          label="Paysages et lieux remarquables"
          icon={preferScenic ? 'circleCheck' : undefined}
          variant={preferScenic ? 'primary' : 'secondary'}
          onPress={() => {
            const next = !preferScenic;
            setPreferScenic(next);
          }}
          accessibilityLabel={`${preferScenic ? 'Désactiver' : 'Activer'} la préférence paysages et lieux remarquables`}
        />
      </View>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Les routes sont évitées autant que le réseau le permet. Les ponts identifiés sont exclus. Les parcours remarquables sont classés selon les lieux et points d’intérêt IGN proches.</Text>
    </View>
    {error ? <Banner tone="error" title="Calcul impossible" message={error} onDismiss={() => setError(undefined)} /> : null}
    {proposals.map((proposal) => <Card key={proposal.name} style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{proposal.name}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{distanceLabel(proposal.distance_meters)} · environ {durationLabel(proposal.duration_seconds)}</Text>
        {preferenceLabel(proposal) ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{preferenceLabel(proposal)}</Text> : null}
        {proposal.destination_label ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>Arrivée : {proposal.destination_label}</Text> : null}
        {proposal.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{proposal.attribution}{proposal.license ? ` · ${proposal.license}` : ''}</Text> : null}
        {proposal.route_type === 'out_and_back' ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Solution de secours : aucune vraie boucle proche de cette distance n’a été trouvée. Ce parcours revient sur une partie du chemin.</Text> : null}
      </View>
      <WalkRouteMap points={proposal.points} highlights={proposal.highlights} planned />
      <RouteHighlights highlights={proposal.highlights} />
      <Button label="Choisir cet itinéraire" icon="circleCheck" fullWidth loading={mutations.save.isPending} disabled={mutations.save.isPending} onPress={() => void choose(proposal)} />
    </Card>)}
  </FormSheet>;
}
