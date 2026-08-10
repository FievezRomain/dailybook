import { Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { PremiumGate } from '../feedback';
import { DetailScreen } from '../layout';
import { TopBar } from '../navigation';
import { getPremiumFeatureContent, type PremiumFeature } from './premiumUtils';

export interface PremiumRequiredPatternProps {
  feature: PremiumFeature;
  onBack: () => void;
  onComparePlans: () => void;
  testID?: string;
}

export function PremiumRequiredPattern({ feature, onBack, onComparePlans, testID }: PremiumRequiredPatternProps) {
  const { colors } = useAppTheme();
  const content = getPremiumFeatureContent(feature);
  return (
    <DetailScreen header={<TopBar title="Premium" context="detail" onBack={onBack} />} testID={testID} contentContainerStyle={{ gap: spacing.lg, paddingTop: spacing.xxl }}>
      <View style={{ gap: spacing.sm }}>
        <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: 28, lineHeight: 34 }}>{content.title}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>{content.description}</Text>
      </View>
      <PremiumGate onComparePlans={onComparePlans} />
    </DetailScreen>
  );
}
