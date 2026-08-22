import { create } from 'zustand';

interface RegistrationDraftState {
  firstName: string;
  email: string;
  password: string;
  confirmation: string;
  setIdentity: (identity: { firstName: string; email: string }) => void;
  setSecurity: (security: { password: string; confirmation: string }) => void;
  reset: () => void;
}

export const useRegistrationDraft = create<RegistrationDraftState>((set) => ({
  firstName: '',
  email: '',
  password: '',
  confirmation: '',
  setIdentity: (identity) => set(identity),
  setSecurity: (security) => set(security),
  reset: () => set({ firstName: '', email: '', password: '', confirmation: '' }),
}));
