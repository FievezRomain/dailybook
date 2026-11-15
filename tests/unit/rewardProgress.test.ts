import { getRewardProgress } from '../../features/rewards/rewardProgress';

describe('getRewardProgress', () => {
  it('calculates progress inside the current grade range', () => {
    expect(getRewardProgress(1000, {
      key: 'attentive',
      minimum: 500,
      next_key: 'protector',
      next_minimum: 1500,
    })).toEqual({
      progress: 0.5,
      remaining: 500,
      nextLevelKey: 'protector',
    });
  });

  it('keeps the gauge full at the highest grade', () => {
    expect(getRewardProgress(4200, {
      key: 'guardian',
      minimum: 3500,
      next_key: null,
      next_minimum: null,
    })).toEqual({
      progress: 1,
      remaining: 0,
      nextLevelKey: null,
    });
  });

  it('clamps inconsistent server values safely', () => {
    expect(getRewardProgress(200, {
      key: 'attentive',
      minimum: 500,
      next_key: 'protector',
      next_minimum: 1500,
    }).progress).toBe(0);
  });
});
