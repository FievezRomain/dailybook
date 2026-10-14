import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as RewardService from '../../services/api/RewardService';

export const REWARD_SUMMARY_KEY = ['rewards', 'summary'] as const;
export const REWARD_HISTORY_KEY = ['rewards', 'history'] as const;

export function useRewardSummaryQuery(enabled = true) {
  return useQuery({ queryKey: REWARD_SUMMARY_KEY, queryFn: RewardService.getSummary, enabled });
}

export function useRewardHistoryQuery(enabled = true) {
  return useQuery({ queryKey: REWARD_HISTORY_KEY, queryFn: RewardService.getHistory, enabled });
}

export function useDailyRewardCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RewardService.dailyCheckIn,
    onSuccess: (summary) => {
      queryClient.setQueryData(REWARD_SUMMARY_KEY, summary);
      void queryClient.invalidateQueries({ queryKey: REWARD_HISTORY_KEY });
    },
  });
}

export function useCompleteWeeklyReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RewardService.completeWeeklyReview,
    onSuccess: (summary) => {
      queryClient.setQueryData(REWARD_SUMMARY_KEY, summary);
      void queryClient.invalidateQueries({ queryKey: REWARD_HISTORY_KEY });
    },
  });
}
