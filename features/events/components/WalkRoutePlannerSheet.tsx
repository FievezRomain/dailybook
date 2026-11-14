import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Text, View } from 'react-native';
import { Banner, Button, Card, Chip, FormSheet, NumberStepper, Switch } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useWalkRoutePlanMutations } from '../../../hooks/queries/useEventsQuery';
import { parseApiError } from '../../../utils/errorParser';
import type { WalkRoutePlan, WalkRoutePoint, WalkRouteProposal } from '../types';
import {
  DEFAULT_WALK_ROUTE_FILTERS,
  buildWalkRouteFilterPayload,
  validateWalkRouteFilters,
  type WalkRouteFilterState,
} from '../walkRouteFilters';
import { buildDraftRoutePoints, removeDraftWaypoint } from '../walkRouteEditor';
import { WalkRouteMap } from './WalkRouteMap';

const ROUTE_TYPE_OPTIONS = [
  { value: 'loop' as const, label: 'Boucle' },
  { value: 'one_way' as const, label: 'Aller simple' },
];
const PROPOSALS_PER_PAGE = 3;
type RouteEditorMode = 'idle' | 'via' | 'avoid';

function representativeRoutePoints(points: WalkRoutePoint[]) {
  if (points.length < 4) return points.slice(1, -1);
  return [0.25, 0.5, 0.75].map((ratio) => points[Math.min(points.length - 2, Math.round((points.length - 1) * ratio))]);
}

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
    route.avoid_roads ? 'chemins privilégiés' : undefined,
    route.avoid_water ? 'ponts évités' : undefined,
    route.prefer_scenic ? 'points remarquables recherchés' : undefined,
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
    <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>À remarquer sur le parcours</Text>
    {highlights.map((highlight) => <Text
      key={`${highlight.name}-${highlight.latitude}-${highlight.longitude}`}
      style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}
    >• {highlight.name} · {highlight.category}</Text>)}
  </View>;
}

function PreferenceRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { colors } = useAppTheme();
  return <View style={{
    minHeight: componentTokens.optionCard.height,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: componentTokens.field.stroke.default,
    borderColor: colors.border,
    backgroundColor: colors.surfaceVariant,
  }}>
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{title}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, lineHeight: typography.lineHeights.tight }}>{description}</Text>
    </View>
    <Switch value={value} onValueChange={onChange} accessibilityLabel={title} />
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
      {plan.road_percentage != null ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{Math.round(plan.road_percentage)} % de voies automobiles</Text> : null}
      {plan.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Source : {plan.attribution}{plan.license ? ` · ${plan.license}` : ''}</Text> : null}
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
  const [preferScenic, setPreferScenic] = useState(currentPlan?.prefer_scenic ?? true);
  const [proposals, setProposals] = useState<WalkRouteProposal[]>([]);
  const [selectedProposalIndex, setSelectedProposalIndex] = useState(0);
  const [proposalPage, setProposalPage] = useState(0);
  const [editorRoute, setEditorRoute] = useState<WalkRouteProposal>();
  const [editorOriginal, setEditorOriginal] = useState<WalkRouteProposal>();
  const [editorHistory, setEditorHistory] = useState<WalkRouteProposal[]>([]);
  const [editorMode, setEditorMode] = useState<RouteEditorMode>('idle');
  const [editorPoint, setEditorPoint] = useState<WalkRoutePoint>();
  const [draftWaypoints, setDraftWaypoints] = useState<WalkRoutePoint[]>([]);
  const [selectedDraftPointIndex, setSelectedDraftPointIndex] = useState<number>();
  const [editorFeedback, setEditorFeedback] = useState<string>();
  const [error, setError] = useState<string>();
  const locationRef = useRef<{ latitude: number; longitude: number } | undefined>(undefined);
  const generationRef = useRef(0);

  const locateStart = useCallback(async () => {
    const cached = locationRef.current;
    if (cached) return cached;
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== Location.PermissionStatus.GRANTED) {
      throw new Error('Autorisez la localisation pour préparer un itinéraire autour de votre position.');
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const start = { latitude: location.coords.latitude, longitude: location.coords.longitude };
    locationRef.current = start;
    return start;
  }, []);

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
      const start = await locateStart();
      const routes = await proposeRoutes({
        start_latitude: start.latitude,
        start_longitude: start.longitude,
        ...buildWalkRouteFilterPayload(filters),
        route_type: routeType,
        avoid_roads: avoidRoads,
        avoid_water: avoidWater,
        prefer_scenic: preferScenic,
      });
      if (generationRef.current === generation) {
        setProposals(routes);
        setSelectedProposalIndex(0);
        setProposalPage(0);
        if (!routes.length) setError('Aucun itinéraire ne correspond exactement à ces critères. Élargissez la distance ou la durée.');
      }
    } catch (generationError) {
      if (generationRef.current === generation) setError(parseApiError(generationError).message);
    }
  }, [avoidRoads, avoidWater, filters, locateStart, preferScenic, proposeRoutes, routeType]);

  const openEditor = (proposal: WalkRouteProposal) => {
    setEditorRoute(proposal);
    setEditorOriginal(proposal);
    setEditorHistory([]);
    setEditorMode('idle');
    setEditorPoint(undefined);
    setDraftWaypoints([]);
    setSelectedDraftPointIndex(undefined);
    setEditorFeedback(undefined);
    setError(undefined);
  };

  const createCustomRoute = async () => {
    setError(undefined);
    try {
      const start = await locateStart();
      const target = buildWalkRouteFilterPayload(filters).target_distance_meters;
      openEditor({
        provider: 'vasco-custom',
        name: 'Mon tracé',
        route_type: routeType,
        avoid_roads: avoidRoads,
        avoid_water: avoidWater,
        prefer_scenic: preferScenic,
        highlights: [],
        points: [start, { ...start }],
        distance_meters: 0,
        duration_seconds: 0,
        target_distance_meters: target,
        attribution: 'Vasco · tracé personnalisé recalculé avec IGN — Géoplateforme',
        official: false,
      });
    } catch (locationError) {
      setError(locationError instanceof Error ? locationError.message : 'La position actuelle est indisponible.');
    }
  };

  const recalculateEditorRoute = async (point: WalkRoutePoint, mode: Exclude<RouteEditorMode, 'idle'>) => {
    if (!editorRoute || editorRoute.distance_meters === 0 || mutations.customize.isPending) return;
    setError(undefined);
    setEditorFeedback(undefined);
    setEditorPoint(point);
    try {
      const customized = await mutations.customize.mutateAsync({
        points: editorRoute.points,
        ...(mode === 'via' ? { via_point: point } : { avoid_point: point }),
        route_type: editorRoute.route_type,
        avoid_roads: editorRoute.avoid_roads,
        avoid_water: editorRoute.avoid_water,
        prefer_scenic: editorRoute.prefer_scenic,
        target_distance_meters: editorRoute.target_distance_meters,
        attribution: editorRoute.attribution,
        license: editorRoute.license,
        source_url: editorRoute.source_url,
      });
      setEditorHistory((history) => [...history, editorRoute]);
      setEditorRoute(customized);
      setEditorPoint(undefined);
      setEditorMode('idle');
      setEditorFeedback(mode === 'via' ? 'Le passage a été ajouté au parcours.' : 'La portion a été remplacée par un détour.');
    } catch (customizationError) {
      setError(parseApiError(customizationError).message);
    }
  };

  const calculateDraftRoute = async () => {
    if (!editorRoute || editorRoute.distance_meters > 0 || !draftWaypoints.length) return;
    setError(undefined);
    setEditorFeedback(undefined);
    const start = editorRoute.points[0];
    const controlPoints = buildDraftRoutePoints(start, draftWaypoints, editorRoute.route_type);
    try {
      const customized = await mutations.customize.mutateAsync({
        points: [],
        control_points: controlPoints,
        route_type: editorRoute.route_type,
        avoid_roads: editorRoute.avoid_roads,
        avoid_water: editorRoute.avoid_water,
        prefer_scenic: editorRoute.prefer_scenic,
        target_distance_meters: editorRoute.target_distance_meters,
        attribution: editorRoute.attribution,
        license: editorRoute.license,
        source_url: editorRoute.source_url,
      });
      setEditorRoute(customized);
      setEditorOriginal(customized);
      setEditorHistory([]);
      setDraftWaypoints([]);
      setSelectedDraftPointIndex(undefined);
      setEditorMode('idle');
      setEditorFeedback('Le parcours piéton a été calculé à partir de vos étapes.');
    } catch (customizationError) {
      setError(parseApiError(customizationError).message);
    }
  };

  const closeEditor = () => {
    setEditorRoute(undefined);
    setEditorOriginal(undefined);
    setEditorHistory([]);
    setEditorPoint(undefined);
    setDraftWaypoints([]);
    setSelectedDraftPointIndex(undefined);
    setEditorFeedback(undefined);
    setError(undefined);
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

  const returnToCriteria = () => {
    generationRef.current += 1;
    setProposals([]);
    setSelectedProposalIndex(0);
    setProposalPage(0);
    setError(undefined);
  };

  const selectedProposal = proposals[selectedProposalIndex];
  const showingResults = proposals.length > 0;
  const showingEditor = Boolean(editorRoute);
  const creatingDraft = Boolean(editorRoute && editorRoute.distance_meters === 0);
  const draftMapPoints = editorRoute && creatingDraft
    ? buildDraftRoutePoints(editorRoute.points[0], draftWaypoints, editorRoute.route_type)
    : editorRoute?.points ?? [];
  const proposalPageCount = Math.ceil(proposals.length / PROPOSALS_PER_PAGE);
  const proposalPageStart = proposalPage * PROPOSALS_PER_PAGE;
  const visibleProposals = proposals.slice(proposalPageStart, proposalPageStart + PROPOSALS_PER_PAGE);

  return <FormSheet
    title={showingEditor ? editorOriginal?.distance_meters ? 'Modifier le tracé' : 'Créer mon tracé' : showingResults ? 'Choisir un itinéraire' : currentPlan ? 'Changer d’itinéraire' : 'Préparer la balade'}
    onBack={showingEditor ? closeEditor : showingResults ? returnToCriteria : onClose}
    onClose={onClose}
    footerLabel={creatingDraft ? 'Calculer mon itinéraire' : showingEditor ? 'Utiliser ce tracé' : showingResults ? 'Choisir cet itinéraire' : 'Voir les itinéraires'}
    onFooterPress={() => {
      if (creatingDraft) void calculateDraftRoute();
      else if (editorRoute) void choose(editorRoute);
      else if (selectedProposal) void choose(selectedProposal);
      else void generate();
    }}
    footerDisabled={creatingDraft ? !draftWaypoints.length || mutations.customize.isPending : showingEditor ? !editorRoute?.distance_meters || mutations.customize.isPending : showingResults && !selectedProposal}
    footerLoading={showingEditor ? mutations.customize.isPending || mutations.save.isPending : showingResults ? mutations.save.isPending : mutations.propose.isPending}
    dirty={showingEditor}
    confirmBackWhenDirty={showingEditor}
    testID="walk-route-planner"
  >
    {error ? <Banner tone="error" title="Calcul impossible" message={error} onDismiss={() => setError(undefined)} /> : null}
    {showingEditor && editorRoute ? <>
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{creatingDraft ? 'Placez vos étapes' : 'Que voulez-vous modifier ?'}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>
          {creatingDraft
            ? 'Touchez la carte pour ajouter autant d’étapes que nécessaire. Aucun calcul externe n’est lancé avant le bouton final.'
            : editorMode === 'idle'
              ? 'Choisissez une action, puis touchez la carte. Le parcours sera recalculé automatiquement.'
              : editorMode === 'via'
                ? 'Touchez l’endroit par lequel vous souhaitez passer.'
                : 'Touchez la portion que vous souhaitez contourner.'}
        </Text>
      </View>
      {!creatingDraft ? <View style={{ gap: spacing.sm }}>
        <Button label="Ajouter un passage" variant={editorMode === 'via' ? 'primary' : 'secondary'} fullWidth onPress={() => { setEditorMode((mode) => mode === 'via' ? 'idle' : 'via'); setEditorPoint(undefined); setEditorFeedback(undefined); }} />
        <Button label="Éviter une portion" variant={editorMode === 'avoid' ? 'primary' : 'secondary'} fullWidth onPress={() => { setEditorMode((mode) => mode === 'avoid' ? 'idle' : 'avoid'); setEditorPoint(undefined); setEditorFeedback(undefined); }} />
      </View> : null}
      <WalkRouteMap
        points={creatingDraft ? draftMapPoints : editorRoute.points}
        highlights={creatingDraft ? [] : editorRoute.highlights}
        planned
        onPress={creatingDraft
          ? (point) => {
            setDraftWaypoints((waypoints) => [...waypoints, point]);
            setSelectedDraftPointIndex(draftWaypoints.length);
            setEditorFeedback(undefined);
          }
          : editorMode === 'idle' || mutations.customize.isPending
            ? undefined
            : (point) => void recalculateEditorRoute(point, editorMode)}
        editPoint={editorPoint}
        controlPoints={creatingDraft ? draftWaypoints : []}
        selectedControlPointIndex={selectedDraftPointIndex}
        onControlPointPress={creatingDraft ? setSelectedDraftPointIndex : undefined}
      />
      {creatingDraft ? <View style={{ gap: spacing.sm }}>
        <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>
          {draftWaypoints.length ? `${draftWaypoints.length} étape${draftWaypoints.length > 1 ? 's' : ''} ajoutée${draftWaypoints.length > 1 ? 's' : ''}` : 'Ajoutez au moins une étape sur la carte.'}
        </Text>
        {draftWaypoints.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {draftWaypoints.map((point, index) => <Chip
            key={`${point.latitude}-${point.longitude}-${index}`}
            label={`Étape ${index + 1}`}
            selected={selectedDraftPointIndex === index}
            variant="tonal"
            size="small"
            onPress={() => setSelectedDraftPointIndex(index)}
          />)}
        </View> : null}
        {selectedDraftPointIndex != null ? <Button
          label={`Supprimer l’étape ${selectedDraftPointIndex + 1}`}
          icon="delete"
          variant="ghost"
          fullWidth
          onPress={() => {
            setDraftWaypoints((waypoints) => removeDraftWaypoint(waypoints, selectedDraftPointIndex));
            setSelectedDraftPointIndex(undefined);
          }}
        /> : null}
      </View> : null}
      {editorRoute.distance_meters ? <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{distanceLabel(editorRoute.distance_meters)} · {durationLabel(editorRoute.duration_seconds)}{editorRoute.road_percentage == null ? '' : ` · ${Math.round(editorRoute.road_percentage)} % de voies automobiles`}</Text>
        {editorRoute.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Source : {editorRoute.attribution}{editorRoute.license ? ` · ${editorRoute.license}` : ''}</Text> : null}
      </View> : null}
      {editorMode === 'via' && editorRoute.highlights.length ? <View style={{ gap: spacing.sm }}>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>Ou choisissez un lieu remarquable</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {editorRoute.highlights.slice(0, 4).map((highlight) => <Chip key={`${highlight.name}-${highlight.latitude}-${highlight.longitude}`} label={highlight.name} selected={false} variant="tonal" size="small" disabled={mutations.customize.isPending} onPress={() => void recalculateEditorRoute({ latitude: highlight.latitude, longitude: highlight.longitude }, 'via')} />)}
        </View>
      </View> : null}
      {editorMode === 'avoid' ? <View style={{ gap: spacing.sm }}>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>Ou choisissez une portion sans utiliser la carte</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {representativeRoutePoints(editorRoute.points).map((point, index) => <Chip key={`${point.latitude}-${point.longitude}-${index}`} label={`Portion ${index + 1}`} selected={false} variant="tonal" size="small" disabled={mutations.customize.isPending} onPress={() => void recalculateEditorRoute(point, 'avoid')} accessibilityLabel={`Éviter la portion ${index + 1} du parcours`} />)}
        </View>
      </View> : null}
      {mutations.customize.isPending ? <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>Recalcul du parcours en cours…</Text> : null}
      {editorFeedback ? <Text accessibilityLiveRegion="polite" style={{ color: colors.success, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{editorFeedback}</Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Button label="Annuler la dernière modification" variant="ghost" size="small" disabled={!editorHistory.length} onPress={() => {
          const previous = editorHistory.at(-1);
          if (!previous) return;
          setEditorRoute(previous);
          setEditorHistory((history) => history.slice(0, -1));
          setEditorPoint(undefined);
          setEditorMode('idle');
          setEditorFeedback('La dernière modification a été annulée.');
        }} />
        <Button label="Revenir au tracé initial" variant="ghost" size="small" disabled={!editorOriginal || editorRoute === editorOriginal} onPress={() => {
          if (!editorOriginal) return;
          setEditorRoute(editorOriginal);
          setEditorHistory([]);
          setEditorPoint(undefined);
          setEditorMode('idle');
          setEditorFeedback('Le tracé initial a été restauré.');
        }} />
      </View>
    </> : showingResults ? <>
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{proposals.length} parcours trouvés</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Touchez une carte pour la sélectionner. Le retour permet de modifier vos critères.</Text>
      </View>
      {visibleProposals.map((proposal, pageIndex) => {
        const index = proposalPageStart + pageIndex;
        const selected = selectedProposalIndex === index;
        return <Card
          key={`${proposal.provider}-${proposal.name}-${index}`}
          onPress={() => setSelectedProposalIndex(index)}
          accessibilityRole="radio"
          accessibilityLabel={`${proposal.name}, ${distanceLabel(proposal.distance_meters)}, ${durationLabel(proposal.duration_seconds)}${avoidRoads ? proposal.road_percentage == null ? ', part de voies automobiles non estimée' : `, ${Math.round(proposal.road_percentage)} pour cent de voies automobiles` : ''}`}
          accessibilityHint="Sélectionne cet itinéraire"
          style={{
            gap: spacing.md,
            borderColor: selected ? colors.primary : colors.border,
            borderWidth: selected ? componentTokens.field.stroke.focus : componentTokens.field.stroke.default,
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{proposal.name}</Text>
              {selected ? <Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>Sélectionné</Text> : null}
            </View>
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{distanceLabel(proposal.distance_meters)} · environ {durationLabel(proposal.duration_seconds)}</Text>
            {preferenceLabel(proposal) ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{preferenceLabel(proposal)}</Text> : null}
            {avoidRoads ? <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{proposal.road_percentage == null ? 'Part de voies automobiles non estimée' : `${Math.round(proposal.road_percentage)} % de voies automobiles`}</Text> : null}
            {proposal.destination_label ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>Arrivée : {proposal.destination_label}</Text> : null}
            {proposal.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Source : {proposal.attribution}{proposal.license ? ` · ${proposal.license}` : ''}</Text> : null}
            {proposal.route_type === 'out_and_back' ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Solution de secours : aucune vraie boucle proche de cette distance n’a été trouvée. Ce parcours revient sur une partie du chemin.</Text> : null}
          </View>
          <WalkRouteMap points={proposal.points} highlights={proposal.highlights} planned />
          <RouteHighlights highlights={proposal.highlights} />
        </Card>;
      })}
      {proposalPageCount > 1 ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
        <Button
          label="Précédents"
          variant="secondary"
          size="small"
          disabled={proposalPage === 0}
          onPress={() => {
            const page = Math.max(0, proposalPage - 1);
            setProposalPage(page);
            setSelectedProposalIndex(page * PROPOSALS_PER_PAGE);
          }}
        />
        <Text accessibilityLabel={`Page ${proposalPage + 1} sur ${proposalPageCount}`} style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{proposalPage + 1} / {proposalPageCount}</Text>
        <Button
          label="Suivants"
          variant="secondary"
          size="small"
          disabled={proposalPage >= proposalPageCount - 1}
          onPress={() => {
            const page = Math.min(proposalPageCount - 1, proposalPage + 1);
            setProposalPage(page);
            setSelectedProposalIndex(page * PROPOSALS_PER_PAGE);
          }}
        />
      </View> : null}
      <Button label="Modifier le tracé sélectionné" icon="edit" variant="secondary" fullWidth disabled={!selectedProposal} onPress={() => {
        if (selectedProposal) openEditor(selectedProposal);
      }} />
    </> : <>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Définissez la balade souhaitée. Vasco privilégiera les chemins et les parcours intéressants autour de votre position.</Text>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Type de parcours</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {ROUTE_TYPE_OPTIONS.map((option) => <Chip
          key={option.value}
          label={option.label}
          selected={routeType === option.value}
          variant="tonal"
          size="medium"
          onPress={() => {
            if (routeType === option.value) return;
            setRouteType(option.value);
          }}
          accessibilityLabel={'Choisir le type ' + option.label}
        />)}
      </View>
    </View>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Durée de la balade</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Chip
          label="Distance"
          selected={filters.mode === 'distance'}
          variant="tonal"
          size="medium"
          onPress={() => setFilters((value) => ({ ...value, mode: 'distance' }))}
          accessibilityLabel="Filtrer les itinéraires par distance"
        />
        <Chip
          label="Durée"
          selected={filters.mode === 'duration'}
          variant="tonal"
          size="medium"
          onPress={() => setFilters((value) => ({ ...value, mode: 'duration' }))}
          accessibilityLabel="Filtrer les itinéraires par durée"
        />
      </View>
      <View style={{ gap: spacing.sm }}>
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
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>Ce qui compte pour vous</Text>
      <PreferenceRow
        title="Privilégier les chemins"
        description="Évite les voies ouvertes aux voitures et favorise halages, sentiers et voies vertes."
        value={avoidRoads}
        onChange={setAvoidRoads}
      />
      <PreferenceRow
        title="Éviter les ponts"
        description="Écarte les tronçons identifiés comme ponts lorsque le réseau le permet."
        value={avoidWater}
        onChange={setAvoidWater}
      />
      <PreferenceRow
        title="Voir les points remarquables"
        description="Recherche des moulins, écluses, beaux bâtiments, points de vue et sites naturels."
        value={preferScenic}
        onChange={setPreferScenic}
      />
    </View>
    <Button label="Créer mon propre tracé" icon="edit" variant="secondary" fullWidth onPress={() => void createCustomRoute()} />
    </>}
  </FormSheet>;
}
