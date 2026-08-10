import { create } from 'zustand';

interface RegistrationDraftState {
  firstName: string;
  email: string;
  setIdentity: (identity: { firstName: string; email: string }) => void;
  reset: () => void;
}

export const useRegistrationDraft = create<RegistrationDraftState>((set) => ({
  firstName: '',
  email: '',
  setIdentity: (identity) => set(identity),
  reset: () => set({ firstName: '', email: '' }),
}));
