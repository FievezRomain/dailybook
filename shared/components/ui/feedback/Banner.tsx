import { Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { resolveFeedbackTone, type FeedbackTone } from './feedbackStyles';

export interface BannerProps { title: string; message: string; tone?: FeedbackTone; onDismiss?: () => void; blocking?: boolean; testID?: string }
export function Banner({ title, message, tone = 'info', onDismiss, blocking = false, testID }: BannerProps) {
  const { colors } = useAppTheme();
  const visual = resolveFeedbackTone(colors, tone);
  const dismissible = Boolean(onDismiss) && !blocking;
  return <View accessibilityRole="alert" testID={testID} style={{ width: '100%', maxWidth: componentTokens.feedback.width, minHeight: componentTokens.feedback.bannerHeight, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: visual.border, borderRadius: radii.md, backgroundColor: visual.background }}><Icon name={visual.icon} size="sm" color={visual.accent} /><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: 12, lineHeight: 18 }}>{message}</Text></View>{dismissible ? <Pressable accessibilityRole="button" accessibilityLabel="Fermer le message" onPress={onDismiss} hitSlop={12} style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size="sm" color={visual.accent} /></Pressable> : null}</View>;
}
