import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RewardBoostPeriod, RewardTransaction } from '../../../models/Reward';
import { Card, EmptyState, ErrorState, Icon, Skeleton } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { rewardActionIcons } from '../rewardHubIcons';
import { RewardSectionIntroduction } from './RewardSectionIntroduction';

export function RewardActivityView({
  transactions,
  loading,
  error,
  onRetry,
}: {
  transactions: RewardTransaction[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation('rewards');
  const locale = i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US';

  return (
    <View style={{ gap: spacing.md }}>
      <RewardSectionIntroduction title={t('hub.activityTitle')} message={t('hub.activitySubtitle')} />
      {loading ? (
        <View style={{ gap: spacing.sm }}><Skeleton /><Skeleton /><Skeleton /></View>
      ) : error ? (
        <ErrorState message={t('hub.historyError')} onRetry={onRetry} />
      ) : transactions.length ? (
        <Card accessibilityLabel={t('hub.history')}>
          {transactions.map((item, index) => {
            const title = item.source_type.startsWith('reward_boost:')
              ? t('hub.boostHistory', {
                period: t(`boosts.periods.${item.source_type.split(':')[1] as RewardBoostPeriod}`),
                action: t(`actions.${item.action}`),
              })
              : t(`actions.${item.action}`);

            return (
              <View
                key={item.transaction_id}
                accessible
                accessibilityLabel={`${title}, ${item.amount > 0 ? '+' : ''}${item.amount} ${t('currency.short')}`}
                style={{
                  minHeight: componentTokens.content.listItemHeight,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  borderBottomWidth: index === transactions.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ width: componentTokens.content.listLeadingSize, height: componentTokens.content.listLeadingSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}>
                  <Icon name={rewardActionIcons[item.action]} size="md" color={colors.primaryDark} />
                </View>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>
                    {title}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
                    {new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(item.created_at))}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
                  <Text style={{ color: item.amount > 0 ? colors.success : colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>
                    {t('currency.short')}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>
      ) : (
        <EmptyState icon="trophy" title={t('hub.history')} message={t('hub.historyEmpty')} />
      )}
    </View>
  );
}
