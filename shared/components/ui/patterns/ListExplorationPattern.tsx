import { useCallback, useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { FlatList, RefreshControl, View, type FlatListProps, type ListRenderItem, type NativeScrollEvent, type NativeSyntheticEvent, type StyleProp, type ViewStyle } from 'react-native';
import { spacing } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { BrandLoader, EmptyState, ErrorState, Skeleton } from '../feedback';

export interface ListExplorationRestoration {
  initialScrollOffset: number;
  saveScrollOffset: (offset: number) => void;
}

export interface ListExplorationPatternProps<T> {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  loading: boolean;
  error?: boolean;
  refreshing?: boolean;
  fetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onRetry: () => void;
  onRefresh: () => void;
  onLoadMore?: () => void;
  filters?: ReactNode;
  emptyState?: ReactElement;
  errorState?: ReactElement;
  skeletonCount?: number;
  restoration?: ListExplorationRestoration;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ItemSeparatorComponent?: FlatListProps<T>['ItemSeparatorComponent'];
  testID?: string;
}

export function ListExplorationPattern<T>({ data, renderItem, keyExtractor, loading, error = false, refreshing = false, fetchingNextPage = false, hasNextPage = false, onRetry, onRefresh, onLoadMore, filters, emptyState, errorState, skeletonCount = 4, restoration, contentContainerStyle, ItemSeparatorComponent, testID }: ListExplorationPatternProps<T>) {
  const { colors } = useAppTheme();
  const listRef = useRef<FlatList<T>>(null);
  const initialScrollOffset = restoration?.initialScrollOffset ?? 0;
  const saveScrollOffset = restoration?.saveScrollOffset;
  const currentOffset = useRef(initialScrollOffset);
  const restored = useRef(false);
  const saveOffset = useCallback(() => saveScrollOffset?.(currentOffset.current), [saveScrollOffset]);
  useEffect(() => () => saveOffset(), [saveOffset]);
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => { currentOffset.current = event.nativeEvent.contentOffset.y; }, []);
  const restoreScroll = useCallback(() => { if (restored.current || !initialScrollOffset || !data.length) return; restored.current = true; listRef.current?.scrollToOffset({ offset: initialScrollOffset, animated: false }); }, [data.length, initialScrollOffset]);
  const loadMore = useCallback(() => { if (hasNextPage && !fetchingNextPage && !loading) onLoadMore?.(); }, [fetchingNextPage, hasNextPage, loading, onLoadMore]);

  if (loading && !data.length) return <View testID={testID} style={{ flex: 1, gap: spacing.md, padding: spacing.md }}>{filters}{Array.from({ length: skeletonCount }, (_, index) => <Skeleton key={index} type="list" density="compact" />)}</View>;
  if (error && !data.length) return <View testID={testID} style={{ flex: 1 }}>{filters}{errorState ?? <ErrorState onRetry={onRetry} />}</View>;

  return <View testID={testID} style={{ flex: 1, backgroundColor: colors.background }}>{filters}<FlatList ref={listRef} data={[...data]} renderItem={renderItem} keyExtractor={keyExtractor} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />} ListEmptyComponent={emptyState ?? <EmptyState type="generic" />} ListFooterComponent={fetchingNextPage ? <View style={{ padding: spacing.md, alignItems: 'center' }}><BrandLoader size="compact" accessibilityLabel="Chargement de la suite" /></View> : null} ItemSeparatorComponent={ItemSeparatorComponent} onEndReached={loadMore} onEndReachedThreshold={0.35} onScroll={handleScroll} scrollEventThrottle={32} onMomentumScrollEnd={saveOffset} onScrollEndDrag={saveOffset} onContentSizeChange={restoreScroll} contentContainerStyle={[{ flexGrow: 1, padding: spacing.md }, contentContainerStyle]} />{error && data.length ? <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}><ErrorState title="Mise à jour impossible" message="Les données déjà chargées restent disponibles." onRetry={onRetry} style={{ minHeight: 180 }} /></View> : null}</View>;
}
