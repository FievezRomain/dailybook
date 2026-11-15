import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RewardBoost, RewardOpportunity } from '../../../models/Reward';
import { Button, Card, Icon, StatusBadge } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { rewardActionIcons, rewardBoostIcons } from '../rewardHubIcons';
import { RewardSectionIntroduction } from './RewardSectionIntroduction';

export function RewardMissionsView({
  boosts,
  opportunities,
  isPremium,
  premiumBonusPercent,
  onComparePlans,
}: {
  boosts: RewardBoost[];
  opportunities: RewardOpportunity[];
  isPremium: boolean;
  premiumBonusPercent: number;
  onComparePlans: () => void;
}) {
  const { t } = useTranslation('rewards');

  return (
    <View style={{ gap: spacing.lg }}>
      <RewardSectionIntroduction title={t('hub.missionsTitle')} message={t('hub.missionsSubtitle')} />
      <View style={{ gap: spacing.sm }}>
        {boosts.map((boost) => <MissionCard key={boost.period} boost={boost} />)}
      </View>
      <PremiumBonusCard
        isPremium={isPremium}
        percent={premiumBonusPercent}
        onComparePlans={onComparePlans}
      />
      <RewardSectionIntroduction title={t('hub.moreWaysTitle')} message={t('hub.opportunitiesSubtitle')} />
      <OpportunitiesCard opportunities={opportunities} />
    </View>
  );
}

function MissionCard({ boost }: { boost: RewardBoost }) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation('rewards');
  const total = boost.base_amount + boost.bonus_amount;
  const completed = boost.status === 'completed';
  const locked = boost.status === 'locked';
  const accent = completed ? colors.success : locked ? colors.warning : colors.vascorCoinDark;
  const expiration = new Intl.DateTimeFormat(
    i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'short' },
  ).format(new Date(boost.expires_at));

  return (
    <Card
      accessibilityLabel={t('hub.boostAccessibility', {
        period: t(`boosts.periods.${boost.period}`),
        action: t(`actions.${boost.action}`),
        base: boost.base_amount,
        bonus: boost.bonus_amount,
      })}
      style={completed ? { backgroundColor: colors.surfaceVariant } : undefined}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{
          width: componentTokens.vascor.missionIconSize,
          height: componentTokens.vascor.missionIconSize,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radii.full,
          backgroundColor: colors.backgroundPaper,
        }}>
          <Icon name={completed ? 'success' : rewardBoostIcons[boost.period]} size="md" color={accent} />
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={{ color: accent, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs, textTransform: 'uppercase' }}>
            {t(`boosts.periods.${boost.period}`)}
          </Text>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
            {t(`actions.${boost.action}`)}
          </Text>
        </View>
        <View style={{ minWidth: componentTokens.vascor.rewardPillMinWidth, alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.backgroundPaper }}>
          <Text style={{ color: colors.vascorCoinDark, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
            +{total}
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>
            {t('currency.short')}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
        <StatusBadge
          label={t(`boosts.status.${boost.status}`)}
          tone={completed ? 'success' : locked ? 'warning' : 'info'}
        />
        <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, textAlign: 'right' }}>
          {t('hub.missionExpires', { date: expiration })}
        </Text>
      </View>
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
        {t('hub.boostGain', { base: boost.base_amount, bonus: boost.bonus_amount })}
      </Text>
      {boost.premium_only ? (
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>
          {t('hub.premiumOnlyBoost')}
        </Text>
      ) : null}
    </Card>
  );
}

function PremiumBonusCard({
  isPremium,
  percent,
  onComparePlans,
}: {
  isPremium: boolean;
  percent: number;
  onComparePlans: () => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');
  const message = isPremium
    ? t('hub.premiumBonusActive', { percent })
    : t('hub.premiumBonusUpsell', { percent });

  return (
    <Card style={{ backgroundColor: colors.backgroundPaper }} accessibilityLabel={message}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ width: componentTokens.vascor.missionIconSize, height: componentTokens.vascor.missionIconSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
          <Icon name={isPremium ? 'success' : 'star'} size="md" color={isPremium ? colors.success : colors.vascorCoinDark} />
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
            {isPremium ? t('hub.premiumActiveTitle') : t('hub.premiumBonusTitle')}
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>
            {message}
          </Text>
        </View>
      </View>
      {!isPremium ? (
        <Button label={t('hub.comparePremium')} variant="secondary" onPress={onComparePlans} testID="rewards-compare-premium" />
      ) : null}
    </Card>
  );
}

function OpportunitiesCard({ opportunities }: { opportunities: RewardOpportunity[] }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');

  if (!opportunities.length) {
    return (
      <Card accessibilityLabel={t('hub.opportunitiesEmpty')} style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
        <Icon name="success" size="lg" color={colors.success} />
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, textAlign: 'center' }}>
          {t('hub.opportunitiesEmpty')}
        </Text>
      </Card>
    );
  }

  return (
    <Card accessibilityLabel={t('hub.opportunitiesTitle')}>
      {opportunities.map((opportunity, index) => (
        <View
          key={opportunity.action}
          accessible
          accessibilityLabel={`${t(`actions.${opportunity.action}`)}, ${t('hub.opportunityRemaining', { count: opportunity.remaining })}, +${opportunity.amount} ${t('currency.short')}`}
          style={{
            minHeight: componentTokens.content.listItemHeight,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            borderBottomWidth: index === opportunities.length - 1 ? 0 : 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ width: componentTokens.content.listLeadingSize, height: componentTokens.content.listLeadingSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}>
            <Icon name={rewardActionIcons[opportunity.action]} size="md" color={colors.primaryDark} />
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>
              {t(`actions.${opportunity.action}`)}
            </Text>
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
              {t('hub.opportunityRemaining', { count: opportunity.remaining })}
            </Text>
          </View>
          <Text style={{ color: colors.vascorCoinDark, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
            +{opportunity.amount}
          </Text>
        </View>
      ))}
    </Card>
  );
}
