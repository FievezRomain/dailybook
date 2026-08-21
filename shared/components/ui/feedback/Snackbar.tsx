import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { resolveFeedbackTone, type FeedbackTone } from './feedbackStyles';

export interface SnackbarProps { visible: boolean; message: string; tone?: FeedbackTone; actionLabel?: string; onAction?: () => void; onHidden?: () => void; duration?: number; testID?: string }

export function Snackbar({ visible, message, tone = 'info', actionLabel = 'Réessayer', onAction, onHidden, duration = 4000, testID }: SnackbarProps) {
  const { colors } = useAppTheme();
  const reduceMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [rendered, setRendered] = useState(visible);
  const visual = resolveFeedbackTone(colors, tone);

  useEffect(() => {
    if (visible) setRendered(true);
    const animation = Animated.timing(progress, { toValue: visible ? 1 : 0, duration: reduceMotion ? 0 : 220, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => { if (finished && !visible) { setRendered(false); onHidden?.(); } });
    return () => animation.stop();
  }, [onHidden, progress, reduceMotion, visible]);

  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timeout = setTimeout(() => onHidden?.(), duration);
    return () => clearTimeout(timeout);
  }, [duration, onHidden, visible]);

  if (!rendered) return null;
  return <Animated.View accessibilityRole="alert" accessibilityLiveRegion="polite" testID={testID} style={{ width: '100%', maxWidth: componentTokens.feedback.width, minHeight: componentTokens.feedback.snackbarHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: visual.border, borderRadius: radii.md, backgroundColor: visual.background, opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}><Icon name={visual.icon} size="sm" color={visual.accent} /><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>{message}</Text>{onAction ? <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: visual.accent, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{actionLabel}</Text></Pressable> : null}</Animated.View>;
}
