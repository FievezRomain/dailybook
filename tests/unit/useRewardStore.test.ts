import { useRewardStore } from '../../stores/useRewardStore';

describe('useRewardStore', () => {
  beforeEach(() => {
    useRewardStore.setState({ balanceOverride: undefined, grants: [], openRequestId: 0 });
  });

  it('uses the server balance from the latest grant', () => {
    useRewardStore.getState().recordGrants([
      { transaction_id: 1, action: 'event_completed', amount: 10, balance: 42, rule_version: 1 },
    ]);
    expect(useRewardStore.getState().balanceOverride).toBe(42);
    expect(useRewardStore.getState().grants).toHaveLength(1);
  });

  it('creates a new navigation request on every press', () => {
    useRewardStore.getState().requestOpen();
    useRewardStore.getState().requestOpen();
    expect(useRewardStore.getState().openRequestId).toBe(2);
  });

  it('consumes animated grants one at a time without changing the balance', () => {
    useRewardStore.getState().recordGrants([
      { transaction_id: 1, action: 'event_completed', amount: 10, balance: 10, rule_version: 1 },
      { transaction_id: 2, action: 'care_follow_up', amount: 15, balance: 25, rule_version: 1 },
    ]);

    useRewardStore.getState().consumeGrant(1);

    expect(useRewardStore.getState().grants.map((grant) => grant.transaction_id)).toEqual([2]);
    expect(useRewardStore.getState().balanceOverride).toBe(25);
  });
});
