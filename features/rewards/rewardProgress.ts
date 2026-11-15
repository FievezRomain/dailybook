import type { RewardLevel } from '../../models/Reward';

export interface RewardProgress {
  progress: number;
  remaining: number;
  nextLevelKey: RewardLevel['key'] | null;
}

export function getRewardProgress(
  lifetimeEarned: number,
  level: RewardLevel,
): RewardProgress {
  if (level.next_minimum === null || level.next_key === null) {
    return { progress: 1, remaining: 0, nextLevelKey: null };
  }

  const levelRange = Math.max(1, level.next_minimum - level.minimum);
  const earnedInLevel = lifetimeEarned - level.minimum;

  return {
    progress: Math.min(1, Math.max(0, earnedInLevel / levelRange)),
    remaining: Math.max(0, level.next_minimum - lifetimeEarned),
    nextLevelKey: level.next_key,
  };
}
