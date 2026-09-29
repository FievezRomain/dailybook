import type { ReactElement, ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing } from '../../../../theme/scales';
import { Banner, BrandLoader, EmptyState, ErrorState, Skeleton } from '../feedback';
import type { AsyncState } from './asyncStatesUtils';

export interface AsyncStatesPatternProps {
  state: AsyncState;
  children: ReactNode;
  onRetry: () => void;
  refreshing?: boolean;
  refreshError?: boolean;
  loadingFallback?: ReactElement;
  emptyFallback?: ReactElement;
  errorFallback?: ReactElement;
  skeletonCount?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AsyncStatesPattern({ state, children, onRetry, refreshing = false, refreshError = false, loadingFallback, emptyFallback, errorFallback, skeletonCount = 2, style, testID }: AsyncStatesPatternProps) {
  if (state === 'loading') return <View accessibilityState={{ busy: true }} testID={testID} style={[{ gap: spacing.md }, style]}>{loadingFallback ?? Array.from({ length: skeletonCount }, (_, index) => <Skeleton key={index} type="card" density="comfortable" />)}</View>;
  if (state === 'empty') return <View testID={testID} style={style}>{emptyFallback ?? <EmptyState type="generic" />}</View>;
  if (state === 'error') return <View testID={testID} style={style}>{errorFallback ?? <ErrorState onRetry={onRetry} />}</View>;
  return <View testID={testID} style={[{ gap: spacing.sm }, style]}>{refreshError ? <Banner tone="error" title="Mise à jour impossible" message="Les dernières données disponibles restent affichées." onDismiss={undefined} blocking /> : null}{refreshing ? <View accessible accessibilityRole="progressbar" accessibilityLabel="Mise à jour du contenu" accessibilityState={{ busy: true }} style={{ alignItems: 'center', paddingVertical: spacing.xs }}><BrandLoader size="compact" accessibilityLabel="Mise à jour en cours" /></View> : null}{children}</View>;
}
