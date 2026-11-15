import { useCallback, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import * as Location from 'expo-location';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Banner, Button, Card, Chip, FormSheet, NumberStepper, Switch } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useWalkRouteLibraryQuery, useWalkRoutePlanMutations } from '../../../hooks/queries/useEventsQuery';
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

const ROUTE_TYPES = ['loop', 'one_way'] as const;
const PROPOSALS_PER_PAGE = 3;
const MAX_CUSTOM_ROUTE_CONTROL_POINTS = 100;
type RouteEditorMode = 'idle' | 'via' | 'avoid';
type PlannerMode = 'choice' | 'browse';

function maxDraftWaypoints(routeType: WalkRouteProposal['route_type']) {
  return MAX_CUSTOM_ROUTE_CONTROL_POINTS - (routeType === 'loop' ? 2 : 1);
}

function representativeRoutePoints(points: WalkRoutePoint[]) {
  if (points.length < 4) return points.slice(1, -1);
  return [0.25, 0.5, 0.75].map((ratio) => points[Math.min(points.length - 2, Math.round((points.length - 1) * ratio))]);
}

function distanceLabel(meters: number, language: string) {
  return `${(meters / 1_000).toLocaleString(language, { maximumFractionDigits: 1 })} km`;
}

function durationLabel(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours ? `${hours} h ${String(remaining).padStart(2, '0')}` : `${minutes} min`;
}

function preferenceLabel(route: Pick<WalkRouteProposal, 'avoid_roads' | 'avoid_water' | 'prefer_scenic'>, t: TFunction<'walkGps'>) {
  const preferences = [
    route.avoid_roads ? t('planner.preferences.paths') : undefined,
    route.avoid_water ? t('planner.preferences.bridges') : undefined,
    route.prefer_scenic ? t('planner.preferences.scenic') : undefined,
  ].filter(Boolean);
  return preferences.join(' · ');
}

function routeTypeLabel(routeType: WalkRouteProposal['route_type'], t: TFunction<'walkGps'>) {
  if (routeType === 'one_way') return t('common.routeTypes.oneWay');
  if (routeType === 'out_and_back') return t('common.routeTypes.outAndBack');
  return t('common.routeTypes.loop');
}

function RouteHighlights({ highlights }: Pick<WalkRouteProposal, 'highlights'>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('walkGps');
  if (!highlights.length) return null;
  return <View style={{ gap: spacing.xs }}>
    <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{t('planner.highlightsTitle')}</Text>
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
  const { t, i18n } = useTranslation('walkGps');
  const preferences = preferenceLabel(plan, t);
  return <Card style={{ gap: spacing.md }}>
    <View style={{ gap: spacing.xs }}>
      <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{plan.name}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{t('planCard.prepared', { type: routeTypeLabel(plan.route_type, t), distance: distanceLabel(plan.distance_meters, i18n.language), duration: durationLabel(plan.duration_seconds) })}</Text>
      {preferences ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{preferences}</Text> : null}
      {plan.destination_label ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{t('common.destination', { destination: plan.destination_label })}</Text> : null}
      {plan.road_percentage != null ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('common.roadPercentage', { percentage: Math.round(plan.road_percentage) })}</Text> : null}
      {plan.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{t('common.source', { source: `${plan.attribution}${plan.license ? ` · ${plan.license}` : ''}` })}</Text> : null}
    </View>
    <WalkRouteMap points={plan.points} highlights={plan.highlights} planned />
    <RouteHighlights highlights={plan.highlights} />
    {locked
      ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planCard.locked')}</Text>
      : <>
        <Button label={t('planCard.change')} icon="compass" variant="secondary" fullWidth onPress={onChange} />
        <Button label={t('planCard.delete')} icon="delete" variant="ghost" fullWidth onPress={onDelete} />
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
  const { t, i18n } = useTranslation('walkGps');
  const routeTypeOptions = ROUTE_TYPES.map((value) => ({
    value,
    label: value === 'loop' ? t('common.routeTypes.loop') : t('common.routeTypes.oneWay'),
  }));
  const mutations = useWalkRoutePlanMutations(eventId);
  const [plannerMode, setPlannerMode] = useState<PlannerMode>('choice');
  const libraryQuery = useWalkRouteLibraryQuery(eventId, plannerMode === 'browse');
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
      throw new Error(t('planner.locationPermission'));
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const start = { latitude: location.coords.latitude, longitude: location.coords.longitude };
    locationRef.current = start;
    return start;
  }, [t]);

  const generate = useCallback(async () => {
    const validationError = validateWalkRouteFilters(filters);
    if (validationError) {
      setError(t(`planner.validation.${validationError}`));
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
        if (!routes.length) setError(t('planner.noExactRoute'));
      }
    } catch (generationError) {
      if (generationRef.current === generation) setError(parseApiError(generationError).message);
    }
  }, [avoidRoads, avoidWater, filters, locateStart, preferScenic, proposeRoutes, routeType, t]);

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
      openEditor({
        provider: 'vasco-custom',
        name: t('planner.customRouteName'),
        route_type: routeType,
        avoid_roads: avoidRoads,
        avoid_water: avoidWater,
        prefer_scenic: preferScenic,
        highlights: [],
        points: [start, { ...start }],
        distance_meters: 0,
        duration_seconds: 0,
        target_distance_meters: 1_000,
        official: false,
      });
    } catch (locationError) {
      setError(locationError instanceof Error ? locationError.message : t('planner.locationUnavailable'));
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
      setEditorFeedback(mode === 'via' ? t('planner.editor.viaAdded') : t('planner.editor.sectionAvoided'));
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
      setEditorFeedback(customized.attribution?.includes('respectant vos marqueurs')
        ? t('planner.editor.manualKept')
        : t('planner.editor.calculated'));
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
      setError(t('planner.saveError'));
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
  const showingChoice = !showingEditor && !showingResults && plannerMode === 'choice';
  const creatingDraft = Boolean(editorRoute && editorRoute.distance_meters === 0);
  const draftMapPoints = editorRoute && creatingDraft
    ? buildDraftRoutePoints(editorRoute.points[0], draftWaypoints, editorRoute.route_type)
    : editorRoute?.points ?? [];
  const proposalPageCount = Math.ceil(proposals.length / PROPOSALS_PER_PAGE);
  const proposalPageStart = proposalPage * PROPOSALS_PER_PAGE;
  const visibleProposals = proposals.slice(proposalPageStart, proposalPageStart + PROPOSALS_PER_PAGE);

  return <FormSheet
    title={showingEditor ? editorOriginal?.distance_meters ? t('planner.titles.edit') : t('planner.titles.create') : showingResults ? t('planner.titles.choose') : showingChoice ? t('planner.titles.prepare') : t('planner.titles.existing')}
    onBack={showingEditor ? closeEditor : showingResults ? returnToCriteria : showingChoice ? onClose : () => setPlannerMode('choice')}
    onClose={onClose}
    footerLabel={showingChoice ? undefined : creatingDraft ? t('planner.footer.calculate') : showingEditor ? t('planner.footer.use') : showingResults ? t('planner.footer.choose') : t('planner.footer.more')}
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
    {error ? <Banner tone="error" title={t('planner.calculationErrorTitle')} message={error} onDismiss={() => setError(undefined)} /> : null}
    {showingEditor && editorRoute?.manual_geometry_warning ? <Banner
      tone="warning"
      title={t('planner.manualRouteTitle')}
      message={editorRoute.manual_geometry_warning}
      blocking
      testID="walk-route-manual-geometry-warning"
    /> : null}
    {showingEditor && editorRoute ? <>
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{creatingDraft ? t('planner.editor.placeSteps') : t('planner.editor.whatToEdit')}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>
          {creatingDraft
            ? editorRoute.route_type === 'loop'
              ? t('planner.editor.loopHelp')
              : t('planner.editor.oneWayHelp')
            : editorMode === 'idle'
              ? t('planner.editor.idleHelp')
              : editorMode === 'via'
                ? t('planner.editor.viaHelp')
                : t('planner.editor.avoidHelp')}
        </Text>
      </View>
      {creatingDraft ? <View style={{ gap: spacing.sm }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{t('planner.editor.tripType')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {routeTypeOptions.map((option) => <Chip
            key={option.value}
            label={option.label}
            selected={editorRoute.route_type === option.value}
            variant="tonal"
            size="medium"
            disabled={option.value === 'loop' && draftWaypoints.length > maxDraftWaypoints('loop')}
            onPress={() => {
              setEditorRoute((route) => route ? { ...route, route_type: option.value } : route);
              setRouteType(option.value);
              setSelectedDraftPointIndex(undefined);
            }}
          />)}
        </View>
      </View> : null}
      {!creatingDraft ? <View style={{ gap: spacing.sm }}>
        <Button label={t('planner.editor.addPassage')} variant={editorMode === 'via' ? 'primary' : 'secondary'} fullWidth onPress={() => { setEditorMode((mode) => mode === 'via' ? 'idle' : 'via'); setEditorPoint(undefined); setEditorFeedback(undefined); }} />
        <Button label={t('planner.editor.avoidSection')} variant={editorMode === 'avoid' ? 'primary' : 'secondary'} fullWidth onPress={() => { setEditorMode((mode) => mode === 'avoid' ? 'idle' : 'avoid'); setEditorPoint(undefined); setEditorFeedback(undefined); }} />
      </View> : null}
      <WalkRouteMap
        points={creatingDraft ? draftMapPoints : editorRoute.points}
        highlights={creatingDraft ? [] : editorRoute.highlights}
        planned
        onPress={creatingDraft
          ? (point) => {
            const maximum = maxDraftWaypoints(editorRoute.route_type);
            if (draftWaypoints.length >= maximum) {
              setError(t('planner.editor.maximumSteps', { maximum }));
              return;
            }
            setDraftWaypoints((waypoints) => [...waypoints, point]);
            setSelectedDraftPointIndex(draftWaypoints.length);
            setError(undefined);
            setEditorFeedback(undefined);
          }
          : editorMode === 'idle' || mutations.customize.isPending
            ? undefined
            : (point) => void recalculateEditorRoute(point, editorMode)}
        editPoint={editorPoint}
        controlPoints={creatingDraft ? draftWaypoints : []}
        selectedControlPointIndex={selectedDraftPointIndex}
        onControlPointPress={creatingDraft ? setSelectedDraftPointIndex : undefined}
        controlPointEndLabel={creatingDraft && editorRoute.route_type === 'one_way' && draftWaypoints.length ? t('planner.editor.arrival') : undefined}
        showRouteLine={!creatingDraft}
        showEndMarker={!creatingDraft}
      />
      {creatingDraft ? <View style={{ gap: spacing.sm }}>
        <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>
          {draftWaypoints.length ? t('planner.editor.stepsAdded', { count: draftWaypoints.length }) : t('planner.editor.addOneStep')}
        </Text>
        {draftWaypoints.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {draftWaypoints.map((point, index) => <Chip
            key={`${point.latitude}-${point.longitude}-${index}`}
            label={editorRoute.route_type === 'one_way' && index === draftWaypoints.length - 1 ? t('planner.editor.arrival') : t('planner.editor.step', { number: index + 1 })}
            selected={selectedDraftPointIndex === index}
            variant="tonal"
            size="small"
            onPress={() => setSelectedDraftPointIndex(index)}
          />)}
        </View> : null}
        {selectedDraftPointIndex != null ? <Button
          label={editorRoute.route_type === 'one_way' && selectedDraftPointIndex === draftWaypoints.length - 1 ? t('planner.editor.deleteArrival') : t('planner.editor.deleteStep', { number: selectedDraftPointIndex + 1 })}
          icon="delete"
          variant="ghost"
          fullWidth
          onPress={() => {
            setDraftWaypoints((waypoints) => removeDraftWaypoint(waypoints, selectedDraftPointIndex));
            setSelectedDraftPointIndex(undefined);
            setError(undefined);
          }}
        /> : null}
      </View> : null}
      {editorRoute.distance_meters ? <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{distanceLabel(editorRoute.distance_meters, i18n.language)} · {durationLabel(editorRoute.duration_seconds)}{editorRoute.road_percentage == null ? '' : ` · ${t('common.roadPercentage', { percentage: Math.round(editorRoute.road_percentage) })}`}</Text>
        {editorRoute.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{t('common.source', { source: `${editorRoute.attribution}${editorRoute.license ? ` · ${editorRoute.license}` : ''}` })}</Text> : null}
      </View> : null}
      {editorMode === 'via' && editorRoute.highlights.length ? <View style={{ gap: spacing.sm }}>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('planner.editor.chooseHighlight')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {editorRoute.highlights.slice(0, 4).map((highlight) => <Chip key={`${highlight.name}-${highlight.latitude}-${highlight.longitude}`} label={highlight.name} selected={false} variant="tonal" size="small" disabled={mutations.customize.isPending} onPress={() => void recalculateEditorRoute({ latitude: highlight.latitude, longitude: highlight.longitude }, 'via')} />)}
        </View>
      </View> : null}
      {editorMode === 'avoid' ? <View style={{ gap: spacing.sm }}>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('planner.editor.chooseSection')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {representativeRoutePoints(editorRoute.points).map((point, index) => <Chip key={`${point.latitude}-${point.longitude}-${index}`} label={t('planner.editor.section', { number: index + 1 })} selected={false} variant="tonal" size="small" disabled={mutations.customize.isPending} onPress={() => void recalculateEditorRoute(point, 'avoid')} accessibilityLabel={t('planner.editor.avoidSectionAccessibility', { number: index + 1 })} />)}
        </View>
      </View> : null}
      {mutations.customize.isPending ? <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('planner.editor.recalculating')}</Text> : null}
      {editorFeedback ? <Text accessibilityLiveRegion="polite" style={{ color: colors.success, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{editorFeedback}</Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Button label={t('planner.editor.undo')} variant="ghost" size="small" disabled={!editorHistory.length} onPress={() => {
          const previous = editorHistory.at(-1);
          if (!previous) return;
          setEditorRoute(previous);
          setEditorHistory((history) => history.slice(0, -1));
          setEditorPoint(undefined);
          setEditorMode('idle');
          setEditorFeedback(t('planner.editor.undoDone'));
        }} />
        <Button label={t('planner.editor.reset')} variant="ghost" size="small" disabled={!editorOriginal || editorRoute === editorOriginal} onPress={() => {
          if (!editorOriginal) return;
          setEditorRoute(editorOriginal);
          setEditorHistory([]);
          setEditorPoint(undefined);
          setEditorMode('idle');
          setEditorFeedback(t('planner.editor.resetDone'));
        }} />
      </View>
    </> : showingResults ? <>
      <View style={{ gap: spacing.xs }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{t('planner.results.found', { count: proposals.length })}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.results.help')}</Text>
      </View>
      {visibleProposals.map((proposal, pageIndex) => {
        const index = proposalPageStart + pageIndex;
        const selected = selectedProposalIndex === index;
        return <Card
          key={`${proposal.provider}-${proposal.name}-${index}`}
          onPress={() => setSelectedProposalIndex(index)}
          accessibilityRole="radio"
          accessibilityLabel={`${proposal.name}, ${distanceLabel(proposal.distance_meters, i18n.language)}, ${durationLabel(proposal.duration_seconds)}${avoidRoads ? `, ${proposal.road_percentage == null ? t('common.roadPercentageUnknown') : t('common.roadPercentageSpoken', { percentage: Math.round(proposal.road_percentage) })}` : ''}`}
          accessibilityHint={t('planner.results.selectHint', { name: proposal.name })}
          style={{
            gap: spacing.md,
            borderColor: selected ? colors.primary : colors.border,
            borderWidth: selected ? componentTokens.field.stroke.focus : componentTokens.field.stroke.default,
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{proposal.name}</Text>
              {selected ? <Text style={{ color: colors.primary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>{t('planner.results.selected')}</Text> : null}
            </View>
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{distanceLabel(proposal.distance_meters, i18n.language)} · {t('common.approximately', { duration: durationLabel(proposal.duration_seconds) })}</Text>
            {preferenceLabel(proposal, t) ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{preferenceLabel(proposal, t)}</Text> : null}
            {avoidRoads ? <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{proposal.road_percentage == null ? t('common.roadPercentageUnknown') : t('common.roadPercentage', { percentage: Math.round(proposal.road_percentage) })}</Text> : null}
            {proposal.destination_label ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{t('common.destination', { destination: proposal.destination_label })}</Text> : null}
            {proposal.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{t('common.source', { source: `${proposal.attribution}${proposal.license ? ` · ${proposal.license}` : ''}` })}</Text> : null}
            {proposal.route_type === 'out_and_back' ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.results.fallback')}</Text> : null}
          </View>
          <WalkRouteMap points={proposal.points} highlights={proposal.highlights} planned />
          <RouteHighlights highlights={proposal.highlights} />
        </Card>;
      })}
      {proposalPageCount > 1 ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
        <Button
          label={t('planner.results.previous')}
          variant="secondary"
          size="small"
          disabled={proposalPage === 0}
          onPress={() => {
            const page = Math.max(0, proposalPage - 1);
            setProposalPage(page);
            setSelectedProposalIndex(page * PROPOSALS_PER_PAGE);
          }}
        />
        <Text accessibilityLabel={t('planner.results.page', { current: proposalPage + 1, total: proposalPageCount })} style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{proposalPage + 1} / {proposalPageCount}</Text>
        <Button
          label={t('planner.results.next')}
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
      <Button label={t('planner.results.editSelected')} icon="edit" variant="secondary" fullWidth disabled={!selectedProposal} onPress={() => {
        if (selectedProposal) openEditor(selectedProposal);
      }} />
    </> : showingChoice ? <>
    <View style={{ gap: spacing.xs }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{t('planner.choice.title')}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.choice.description')}</Text>
    </View>
    <Card style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{t('planner.choice.customTitle')}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.choice.customDescription')}</Text>
      </View>
      <Button label={t('planner.choice.customButton')} icon="edit" fullWidth onPress={() => void createCustomRoute()} />
    </Card>
    <Card style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{t('planner.choice.existingTitle')}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.choice.existingDescription')}</Text>
      </View>
      <Button label={t('planner.choice.existingButton')} icon="compass" fullWidth onPress={() => setPlannerMode('browse')} />
    </Card>
    </> : <>
    <View style={{ gap: spacing.xs }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{t('planner.library.title')}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.library.description')}</Text>
    </View>
    {libraryQuery.isPending ? <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('planner.library.loading')}</Text> : null}
    {libraryQuery.isError ? <Banner tone="error" title={t('planner.library.errorTitle')} message={t('planner.library.errorMessage')} /> : null}
    {!libraryQuery.isPending && !libraryQuery.isError && !libraryQuery.data?.length ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{t('planner.library.empty')}</Text> : null}
    {libraryQuery.data?.map((route, index) => <Card key={`${route.provider}-${route.name}-${index}`} style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{route.name}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{routeTypeLabel(route.route_type, t)} · {distanceLabel(route.distance_meters, i18n.language)} · {durationLabel(route.duration_seconds)}</Text>
        {route.road_percentage != null ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{t('common.roadPercentage', { percentage: Math.round(route.road_percentage) })}</Text> : null}
        {route.attribution ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{t('common.source', { source: route.attribution })}</Text> : null}
      </View>
      <View style={{ gap: spacing.sm }}>
        <Button label={t('planner.library.edit')} icon="edit" variant="secondary" fullWidth onPress={() => openEditor(route)} />
        <Button label={t('planner.library.use')} fullWidth disabled={mutations.save.isPending} loading={mutations.save.isPending} onPress={() => void choose(route)} />
      </View>
    </Card>)}
    <View style={{ gap: spacing.xs }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{t('planner.library.discoverTitle')}</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.library.discoverDescription')}</Text>
    </View>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{t('planner.library.filtersDescription')}</Text>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{t('planner.filters.routeType')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {routeTypeOptions.map((option) => <Chip
          key={option.value}
          label={option.label}
          selected={routeType === option.value}
          variant="tonal"
          size="medium"
          onPress={() => {
            if (routeType === option.value) return;
            setRouteType(option.value);
          }}
          accessibilityLabel={t('planner.filters.chooseType', { type: option.label })}
        />)}
      </View>
    </View>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{t('planner.filters.walkDuration')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Chip
          label={t('common.distance')}
          selected={filters.mode === 'distance'}
          variant="tonal"
          size="medium"
          onPress={() => setFilters((value) => ({ ...value, mode: 'distance' }))}
          accessibilityLabel={t('planner.filters.distanceAccessibility')}
        />
        <Chip
          label={t('common.duration')}
          selected={filters.mode === 'duration'}
          variant="tonal"
          size="medium"
          onPress={() => setFilters((value) => ({ ...value, mode: 'duration' }))}
          accessibilityLabel={t('planner.filters.durationAccessibility')}
        />
      </View>
      <View style={{ gap: spacing.sm }}>
        {filters.mode === 'distance' ? <>
          <NumberStepper
            label={t('planner.filters.minDistance')}
            value={filters.minDistanceMeters}
            min={1_000}
            max={30_000}
            step={500}
            formatValue={(value) => distanceLabel(value, i18n.language)}
            errorMessage={filters.minDistanceMeters > filters.maxDistanceMeters ? t('planner.filters.aboveMaximum') : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, minDistanceMeters: value }))}
          />
          <NumberStepper
            label={t('planner.filters.maxDistance')}
            value={filters.maxDistanceMeters}
            min={1_000}
            max={30_000}
            step={500}
            formatValue={(value) => distanceLabel(value, i18n.language)}
            errorMessage={filters.minDistanceMeters > filters.maxDistanceMeters ? t('planner.filters.belowMinimum') : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, maxDistanceMeters: value }))}
          />
        </> : <>
          <NumberStepper
            label={t('planner.filters.minDuration')}
            value={filters.minDurationSeconds}
            min={600}
            max={43_200}
            step={900}
            formatValue={durationLabel}
            errorMessage={filters.minDurationSeconds > filters.maxDurationSeconds ? t('planner.filters.aboveMaximum') : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, minDurationSeconds: value }))}
          />
          <NumberStepper
            label={t('planner.filters.maxDuration')}
            value={filters.maxDurationSeconds}
            min={600}
            max={43_200}
            step={900}
            formatValue={durationLabel}
            errorMessage={filters.minDurationSeconds > filters.maxDurationSeconds ? t('planner.filters.belowMinimum') : undefined}
            onChange={(value) => setFilters((current) => ({ ...current, maxDurationSeconds: value }))}
          />
        </>}
      </View>
    </View>
    <View style={{ gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>{t('planner.filters.priorities')}</Text>
      <PreferenceRow
        title={t('planner.filters.preferPaths')}
        description={t('planner.filters.preferPathsDescription')}
        value={avoidRoads}
        onChange={setAvoidRoads}
      />
      <PreferenceRow
        title={t('planner.filters.avoidBridges')}
        description={t('planner.filters.avoidBridgesDescription')}
        value={avoidWater}
        onChange={setAvoidWater}
      />
      <PreferenceRow
        title={t('planner.filters.scenic')}
        description={t('planner.filters.scenicDescription')}
        value={preferScenic}
        onChange={setPreferScenic}
      />
    </View>
    </>}
  </FormSheet>;
}
