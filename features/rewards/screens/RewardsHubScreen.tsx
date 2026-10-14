import { useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useRewardHistoryQuery, useRewardSummaryQuery } from '../../../hooks/queries/useRewardsQuery';
import { BottomBar, ErrorState, RootScreen, Skeleton, TabBar, TopBar } from '../../../shared/components/ui';
import { useRewardStore } from '../../../stores/useRewardStore';
import { spacing } from '../../../theme/scales';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { RewardActivityView } from '../components/RewardActivityView';
import { RewardGradesView } from '../components/RewardGradesView';
import { RewardHero } from '../components/RewardHero';
import { RewardMissionsView } from '../components/RewardMissionsView';
import { RewardStoreView } from '../components/RewardStoreView';
import { getRewardProgress } from '../rewardProgress';

type HubSection = 'missions' | 'grades' | 'activity' | 'store';

interface Props {
  activeTab: MainTabId;
  onSelectTab: (tab: MainTabId) => void;
  onBack: () => void;
  onComparePlans: () => void;
}

export function RewardsHubScreen({ activeTab, onSelectTab, onBack, onComparePlans }: Props) {
  const { t } = useTranslation('rewards');
  const [section, setSection] = useState<HubSection>('missions');
  const summary = useRewardSummaryQuery();
  const history = useRewardHistoryQuery(section === 'activity');
  const balanceOverride = useRewardStore((state) => state.balanceOverride);
  const displayedBalance = balanceOverride ?? summary.data?.balance ?? 0;
  const levelProgress = summary.data
    ? getRewardProgress(summary.data.lifetime_earned, summary.data.level)
    : null;
  const availableOpportunities = (summary.data?.opportunities ?? []).filter(
    (opportunity) => opportunity.status === 'available' && opportunity.remaining > 0,
  );
  const sectionItems = [
    { id: 'missions', label: t('hub.navigation.missions') },
    { id: 'grades', label: t('hub.navigation.grades') },
    { id: 'activity', label: t('hub.navigation.activity') },
    { id: 'store', label: t('hub.navigation.store') },
  ] as const;

  useEffect(() => {
    void summary.refetch();
  }, []);

  const refreshing = summary.isRefetching || (section === 'activity' && history.isRefetching);
  const refresh = () => {
    void summary.refetch();
    if (section === 'activity') void history.refetch();
  };

  return (
    <RootScreen
      header={<TopBar title={t('hub.title')} context="detail" onBack={onBack} />}
      bottomBar={<BottomBar items={tabs} activeId={activeTab} onSelect={onSelectTab} testID="main-tabs" />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      contentContainerStyle={{ gap: spacing.lg }}
      testID="rewards-hub"
    >
      {summary.isLoading ? (
        <View style={{ gap: spacing.md }}>
          <Skeleton type="card" density="comfortable" />
          <Skeleton />
          <Skeleton type="card" />
        </View>
      ) : summary.isError || !summary.data || !levelProgress ? (
        <ErrorState message={t('hub.summaryError')} onRetry={() => void summary.refetch()} />
      ) : (
        <>
          <RewardHero
            summary={summary.data}
            displayedBalance={displayedBalance}
            progress={levelProgress}
          />
          <TabBar
            items={sectionItems}
            activeId={section}
            onSelect={setSection}
            fullWidthIndicator
          />
          {section === 'missions' ? (
            <RewardMissionsView
              boosts={summary.data.boosts}
              opportunities={availableOpportunities}
              isPremium={summary.data.is_premium}
              premiumBonusPercent={summary.data.premium_bonus_percent}
              onComparePlans={onComparePlans}
            />
          ) : section === 'grades' ? (
            <RewardGradesView summary={summary.data} />
          ) : section === 'activity' ? (
            <RewardActivityView
              transactions={history.data ?? []}
              loading={history.isLoading}
              error={history.isError}
              onRetry={() => void history.refetch()}
            />
          ) : (
            <RewardStoreView balance={displayedBalance} />
          )}
        </>
      )}
    </RootScreen>
  );
}
