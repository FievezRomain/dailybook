import { create } from 'zustand';

export interface EventWizardFormData {
  eventType?: string;
  nom?: string;
  dateevent?: string;
  animaux?: number[];
  lieu?: string;
  heuredebutevent?: string;
  commentaire?: string;
  notif?: string;
  optionnotif?: string;
  shared_groups?: number[];
  documents?: unknown[];
  [key: string]: unknown;
}

interface EventWizardState {
  formData: EventWizardFormData;
  setField: (key: string, value: unknown) => void;
  setFormData: (data: Partial<EventWizardFormData>) => void;
  reset: () => void;
}

const INITIAL_STATE: EventWizardFormData = {};

export const useEventWizardStore = create<EventWizardState>()((set) => ({
  formData: INITIAL_STATE,

  setField: (key, value) =>
    set((s) => ({ formData: { ...s.formData, [key]: value } })),

  setFormData: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  reset: () => set({ formData: INITIAL_STATE }),
}));
