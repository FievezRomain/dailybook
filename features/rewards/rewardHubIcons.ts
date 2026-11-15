import type { RewardAction, RewardBoostPeriod } from '../../models/Reward';
import type { VascoIconName } from '../../shared/components/ui';

export const rewardActionIcons = {
  daily_check_in: 'home',
  animal_profile_completed: 'animals',
  event_created: 'event',
  event_completed: 'circleCheck',
  care_follow_up: 'medical',
  measurement_recorded: 'chartColumn',
  body_picture_added: 'image',
  objective_step_completed: 'goal',
  objective_completed: 'trophy',
} as const satisfies Record<RewardAction, VascoIconName>;

export const rewardBoostIcons = {
  daily: 'star',
  weekly: 'trophy',
  monthly: 'calendar',
} as const satisfies Record<RewardBoostPeriod, VascoIconName>;
