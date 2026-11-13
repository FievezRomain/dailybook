import { useTrackingUIStore } from '../../../stores/useTrackingUIStore';

describe('useTrackingUIStore', () => {
  beforeEach(() => useTrackingUIStore.setState({
    activeTab: 'objectives',
    selectedAnimalId: undefined,
    statisticsAnimalSelection: 'all',
    objectiveList: 'active',
    statisticsPeriod: 'month',
    statisticsAnchor: new Date('2026-11-13T00:00:00.000Z').toISOString(),
    selectedStatistic: undefined,
    historyExpanded: false,
  }));

  it('keeps statistic filters and the opened detail when the screen remounts', () => {
    const store = useTrackingUIStore.getState();
    store.setActiveTab('statistics');
    store.setStatisticsAnimalSelection([4, 7]);
    store.setStatisticsPeriod('year');
    store.setSelectedStatistic('depenses');

    expect(useTrackingUIStore.getState()).toMatchObject({
      activeTab: 'statistics',
      statisticsAnimalSelection: [4, 7],
      statisticsPeriod: 'year',
      selectedStatistic: 'depenses',
    });
  });
});
