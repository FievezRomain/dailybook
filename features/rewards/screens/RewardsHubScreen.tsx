import { useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCompleteWeeklyReview, useRewardHistoryQuery, useRewardSummaryQuery } from '../../../hooks/queries/useRewardsQuery';
import type { RewardAction } from '../../../models/Reward';
import { BottomBar, Button, Card, EmptyState, ErrorState, RootScreen, Skeleton, StatusBadge, TopBar } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { useRewardStore } from '../../../stores/useRewardStore';

interface Props {
  activeTab: MainTabId;
  onSelectTab: (tab: MainTabId) => void;
  onBack: () => void;
}

export function RewardsHubScreen({ activeTab, onSelectTab, onBack }: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('rewards');
  const [section, setSection] = useState<'history' | 'store'>('history');
  const [gradesOpen, setGradesOpen] = useState(false);
  const summary = useRewardSummaryQuery();
  const history = useRewardHistoryQuery(section === 'history');
  const weeklyReview = useCompleteWeeklyReview();
  const balanceOverride = useRewardStore((state) => state.balanceOverride);
  const displayedBalance = balanceOverride ?? summary.data?.balance ?? 0;
  const availableOpportunities = (summary.data?.opportunities ?? []).filter(
    (opportunity) => opportunity.status === 'available' && opportunity.remaining > 0,
  );
  useEffect(() => {
    void summary.refetch();
    void history.refetch();
  }, []);
  const refreshing = summary.isRefetching || history.isRefetching;
  const refresh = () => {
    void summary.refetch();
    if (section === 'history') void history.refetch();
  };

  return (
    <RootScreen
      header={<TopBar title={t('hub.title')} context="detail" onBack={onBack} />}
      bottomBar={<BottomBar items={tabs} activeId={activeTab} onSelect={onSelectTab} testID="main-tabs" />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      contentContainerStyle={{ gap: spacing.md }}
      testID="rewards-hub"
    >
      <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>
        {t('hub.subtitle')}
      </Text>
      {summary.isLoading ? <Skeleton type="card" /> : summary.isError ? (
        <ErrorState message="Impossible de charger votre solde." onRetry={() => void summary.refetch()} />
      ) : (
        <Card accessibilityLabel={t('currency.balanceAccessibility', { count: displayedBalance })}>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>
            {t('hub.balance')}
          </Text>
          <Text style={{ color: colors.primary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxxl }}>
            {displayedBalance} {t('currency.short')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <StatusBadge label={t(`levels.${summary.data?.level.key ?? 'companion'}`)} tone="success" />
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
              {t('hub.lifetime', { count: summary.data?.lifetime_earned ?? 0 })}
            </Text>
          </View>
          <Button
            label={gradesOpen ? t('hub.gradesHideAction') : t('hub.gradesAction')}
            variant="secondary"
            size="small"
            onPress={() => setGradesOpen((open) => !open)}
          />
        </Card>
      )}
      {gradesOpen ? (
        <Card accessibilityLabel={t('hub.gradesTitle')}>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>
            {t('hub.gradesTitle')}
          </Text>
          {(summary.data?.levels ?? []).map((level) => (
            <View key={level.key} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 }}>
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>
                  {t(`levels.${level.key}`)}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
                  {t('hub.gradeThreshold', { count: level.minimum })}
                </Text>
              </View>
              {summary.data?.level.key === level.key ? <StatusBadge label={t('hub.currentGrade')} tone="success" /> : null}
            </View>
          ))}
        </Card>
      ) : null}
      {!summary.isLoading && !summary.isError ? (
        <Card accessibilityLabel={t('hub.opportunitiesTitle')}>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>
            {t('hub.opportunitiesTitle')}
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>
            {t('hub.opportunitiesSubtitle')}
          </Text>
          {availableOpportunities.length ? availableOpportunities.map((opportunity) => (
            <View
              key={opportunity.action}
              accessible
              accessibilityLabel={`${t(`actions.${opportunity.action}`)}, ${t('hub.opportunityRemaining', { count: opportunity.remaining })}, +${opportunity.amount} ${t('currency.short')}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 }}
            >
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>
                  {t(`actions.${opportunity.action}`)}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
                  {t('hub.opportunityRemaining', { count: opportunity.remaining })}
                </Text>
              </View>
              <Text style={{ color: colors.success, fontFamily: typography.fonts.bold, fontSize: typography.sizes.sm }}>
                +{opportunity.amount} {t('currency.short')}
              </Text>
            </View>
          )) : (
            <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>
              {t('hub.opportunitiesEmpty')}
            </Text>
          )}
        </Card>
      ) : null}
      <Card>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md }}>
          {t('hub.reviewTitle')}
        </Text>
        <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm }}>
          {t('hub.reviewMessage')}
        </Text>
        <Button
          label={summary.data?.weekly_review.completed ? t('hub.reviewCompleted') : t('hub.reviewAction')}
          disabled={!summary.data?.weekly_review.eligible || summary.data?.weekly_review.completed}
          loading={weeklyReview.isPending}
          onPress={() => weeklyReview.mutate()}
        />
      </Card>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Button label={t('hub.history')} variant={section === 'history' ? 'primary' : 'secondary'} onPress={() => setSection('history')} style={{ flex: 1 }} />
        <Button label={t('hub.store')} variant={section === 'store' ? 'primary' : 'secondary'} onPress={() => setSection('store')} style={{ flex: 1 }} />
      </View>
      {section === 'store' ? (
        <EmptyState title={t('hub.storeEmptyTitle')} message={t('hub.storeEmptyMessage')} />
      ) : history.isLoading ? (
        <View style={{ gap: spacing.sm }}><Skeleton /><Skeleton /><Skeleton /></View>
      ) : history.isError ? (
        <ErrorState message="Impossible de charger l’historique." onRetry={() => void history.refetch()} />
      ) : history.data?.length ? (
        <View style={{ gap: spacing.sm }}>
          {history.data.map((item) => (
            <Card key={item.transaction_id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>
                    {t(`actions.${item.action as RewardAction}`)}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={{ color: item.amount > 0 ? colors.success : colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.md }}>
                  {item.amount > 0 ? '+' : ''}{item.amount}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      ) : <EmptyState title={t('hub.history')} message={t('hub.historyEmpty')} />}
    </RootScreen>
  );
}
