import { create } from 'zustand';
import type { RewardGrant } from '../models/Reward';

interface RewardState {
  balanceOverride?: number;
  grants: RewardGrant[];
  openRequestId: number;
  requestOpen: () => void;
  recordGrants: (grants: RewardGrant[]) => void;
  consumeGrant: (transactionId: number) => void;
  clearGrants: () => void;
}

export const useRewardStore = create<RewardState>((set) => ({
  grants: [],
  openRequestId: 0,
  requestOpen: () => set((state) => ({ openRequestId: state.openRequestId + 1 })),
  recordGrants: (grants) =>
    set((state) => ({
      grants: [...state.grants, ...grants],
      balanceOverride: grants.at(-1)?.balance ?? state.balanceOverride,
    })),
  consumeGrant: (transactionId) =>
    set((state) => ({
      grants: state.grants.filter(
        (grant) => grant.transaction_id !== transactionId,
      ),
    })),
  clearGrants: () => set({ grants: [] }),
}));
