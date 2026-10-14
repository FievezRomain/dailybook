import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card, VascorMark } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { RewardSectionIntroduction } from './RewardSectionIntroduction';

export function RewardStoreView({ balance }: { balance: number }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');

  return (
    <View style={{ gap: spacing.md }}>
      <RewardSectionIntroduction title={t('hub.store')} message={t('hub.storeSubtitle')} />
      <Card accessibilityLabel={t('hub.storeEmptyTitle')} style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl }}>
        <VascorMark progress={1} size="large" />
        <Text style={{ color: colors.vascorCoinDark, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl, textAlign: 'center' }}>
          {t('hub.storeBalance', { count: balance })}
        </Text>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.lg, textAlign: 'center' }}>
          {t('hub.storeEmptyTitle')}
        </Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.normal, textAlign: 'center' }}>
          {t('hub.storeEmptyMessage')}
        </Text>
      </Card>
    </View>
  );
}
