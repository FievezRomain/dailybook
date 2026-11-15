export type RewardAction =
  | 'daily_check_in'
  | 'animal_profile_completed'
  | 'event_created'
  | 'event_completed'
  | 'care_follow_up'
  | 'measurement_recorded'
  | 'body_picture_added'
  | 'objective_step_completed'
  | 'objective_completed';

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

export type RewardBoostPeriod = 'daily' | 'weekly' | 'monthly';

export interface RewardBoost {
  period: RewardBoostPeriod;
  action: RewardAction;
  base_amount: number;
  bonus_amount: number;
  premium_only: boolean;
  status: RewardOpportunityStatus;
  expires_at: string;
}

export interface RewardSummary {
  balance: number;
  lifetime_earned: number;
  level: RewardLevel;
  levels: Array<Pick<RewardLevel, 'key' | 'minimum'>>;
  opportunities: RewardOpportunity[];
  boosts: RewardBoost[];
  is_premium: boolean;
  premium_bonus_percent: number;
}

export interface RewardTransaction extends Omit<RewardGrant, 'balance'> {
  source_type: string;
  source_id: string;
  created_at: string;
}
