import { Pressable, Text, View } from 'react-native';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface PremiumGateProps { title?: string; message?: string; actionLabel?: string; onComparePlans: () => void; testID?: string }
export function PremiumGate({ title = 'Fonctionnalité Premium', message = 'Cette fonctionnalité nécessite un abonnement Premium. Consultez les avantages avant de choisir.', actionLabel = 'Comparer les offres →', onComparePlans, testID }: PremiumGateProps) {
  const { colors } = useAppTheme();
  return <View accessibilityRole="summary" testID={testID} style={{ width: '100%', gap: spacing.sm, alignItems: 'flex-start', padding: spacing.md, borderWidth: 1, borderColor: colors.borderFocus, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}><View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.full, backgroundColor: colors.borderFocus }}><Text style={{ color: colors.textOnPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs }}>PREMIUM</Text></View><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: 18 }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{message}</Text><Pressable accessibilityRole="button" accessibilityLabel={actionLabel} accessibilityHint="Ouvre le comparatif Gratuit et Premium" onPress={onComparePlans} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.borderFocus, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.control }}>{actionLabel}</Text></Pressable></View>;
}
