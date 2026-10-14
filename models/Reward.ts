export type RewardAction =
  | 'daily_check_in'
  | 'animal_profile_completed'
  | 'event_completed'
  | 'care_follow_up'
  | 'measurement_recorded'
  | 'objective_step_completed'
  | 'objective_completed'
  | 'weekly_review_completed';

export interface RewardGrant {
  transaction_id: number;
  action: RewardAction;
  amount: number;
  balance: number;
  rule_version: number;
}

export interface RewardLevel {
  key: 'companion' | 'attentive' | 'protector' | 'guardian';
  minimum: number;
  next_key: RewardLevel['key'] | null;
  next_minimum: number | null;
}

export type RewardOpportunityStatus = 'available' | 'completed' | 'locked';

export interface RewardOpportunity {
  action: RewardAction;
  amount: number;
  remaining: number;
  status: RewardOpportunityStatus;
}

export interface RewardSummary {
  balance: number;
  lifetime_earned: number;
  level: RewardLevel;
  levels: Array<Pick<RewardLevel, 'key' | 'minimum'>>;
  opportunities: RewardOpportunity[];
  weekly_review: {
    eligible: boolean;
    completed: boolean;
  };
}

export interface RewardTransaction extends Omit<RewardGrant, 'balance'> {
  source_type: string;
  source_id: string;
  created_at: string;
}
