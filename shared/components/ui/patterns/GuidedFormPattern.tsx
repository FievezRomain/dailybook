import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, findNodeHandle, Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Button } from '../actions';
import { DetailScreen } from '../layout';
import { LinearProgress } from '../navigation';
import { normalizeWizardStep } from './guidedFormUtils';

export interface GuidedFormPatternProps {
  header: ReactNode | ((onBack: () => void) => ReactNode);
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void | boolean | Promise<void | boolean>;
  onPrevious: () => void;
  onExitRequest: (dirty: boolean) => void;
  dirty?: boolean;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  onPrimaryError?: (error: unknown) => void;
  keyboardVerticalOffset?: number;
  testID?: string;
}

export function GuidedFormPattern({ header, currentStep, totalSteps, stepTitle, stepDescription, children, primaryLabel, onPrimary, onPrevious, onExitRequest, dirty = false, primaryDisabled = false, primaryLoading = false, onPrimaryError, keyboardVerticalOffset = 0, testID }: GuidedFormPatternProps) {
  const { colors } = useAppTheme();
  const progress = normalizeWizardStep(currentStep, totalSteps);
  const titleRef = useRef<Text>(null);
  const submittingRef = useRef(false);
  const [localLoading, setLocalLoading] = useState(false);
  const loading = primaryLoading || localLoading;

  useEffect(() => { const handle = findNodeHandle(titleRef.current); if (handle) AccessibilityInfo.setAccessibilityFocus(handle); }, [progress.current]);
  const handleBack = () => { if (progress.current > 1) onPrevious(); else onExitRequest(dirty); };
  const handlePrimary = async () => { if (submittingRef.current || loading || primaryDisabled) return; submittingRef.current = true; try { const result = onPrimary(); if (result instanceof Promise) { setLocalLoading(true); await result; } } catch (error) { onPrimaryError?.(error); } finally { submittingRef.current = false; setLocalLoading(false); } };
  const footer = <View style={{ paddingBottom: spacing.sm }}><Button label={primaryLabel} onPress={() => void handlePrimary()} fullWidth size="large" disabled={primaryDisabled} loading={loading} /></View>;
  const renderedHeader = typeof header === 'function' ? header(handleBack) : header;

  return <DetailScreen header={renderedHeader} footer={footer} keyboardAware keyboardVerticalOffset={keyboardVerticalOffset} contentContainerStyle={{ gap: spacing.lg }} testID={testID}><LinearProgress current={progress.current} total={progress.total} label={`Étape ${progress.current} sur ${progress.total}`} /><View style={{ gap: spacing.sm }}><Text ref={titleRef} accessible accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xxl, lineHeight: typography.lineHeights.loose }}>{stepTitle}</Text>{stepDescription ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: typography.lineHeights.normal }}>{stepDescription}</Text> : null}</View><View style={{ flex: 1, gap: spacing.md }}>{children}</View></DetailScreen>;
}
