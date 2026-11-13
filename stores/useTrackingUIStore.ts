import { create } from 'zustand';

import type { StatisticDetailType, StatisticsPeriod } from '../features/statistics/types';

export type TrackingTab = 'objectives' | 'statistics';
export type ObjectiveListFilter = 'active' | 'all';
export type StatisticsAnimalSelection = 'all' | number[];

interface TrackingUIState {
  activeTab: TrackingTab;
  selectedAnimalId?: number;
  statisticsAnimalSelection: StatisticsAnimalSelection;
  objectiveList: ObjectiveListFilter;
  statisticsPeriod: StatisticsPeriod;
  statisticsAnchor: string;
  selectedStatistic?: StatisticDetailType;
  historyExpanded: boolean;
  setActiveTab: (activeTab: TrackingTab) => void;
  setSelectedAnimalId: (selectedAnimalId?: number) => void;
  setStatisticsAnimalSelection: (
    next: StatisticsAnimalSelection | ((current: StatisticsAnimalSelection) => StatisticsAnimalSelection),
  ) => void;
  setObjectiveList: (objectiveList: ObjectiveListFilter) => void;
  setStatisticsPeriod: (statisticsPeriod: StatisticsPeriod) => void;
  setStatisticsAnchor: (statisticsAnchor: string) => void;
  setSelectedStatistic: (selectedStatistic?: StatisticDetailType) => void;
  setHistoryExpanded: (next: boolean | ((current: boolean) => boolean)) => void;
}

export const useTrackingUIStore = create<TrackingUIState>()((set) => ({
  activeTab: 'objectives',
  statisticsAnimalSelection: 'all',
  objectiveList: 'active',
  statisticsPeriod: 'month',
  statisticsAnchor: new Date().toISOString(),
  historyExpanded: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedAnimalId: (selectedAnimalId) => set({ selectedAnimalId }),
  setStatisticsAnimalSelection: (next) => set((state) => ({
    statisticsAnimalSelection: typeof next === 'function'
      ? next(state.statisticsAnimalSelection)
      : next,
  })),
  setObjectiveList: (objectiveList) => set({ objectiveList }),
  setStatisticsPeriod: (statisticsPeriod) => set({ statisticsPeriod }),
  setStatisticsAnchor: (statisticsAnchor) => set({ statisticsAnchor }),
  setSelectedStatistic: (selectedStatistic) => set({ selectedStatistic }),
  setHistoryExpanded: (next) => set((state) => ({
    historyExpanded: typeof next === 'function' ? next(state.historyExpanded) : next,
  })),
}));
