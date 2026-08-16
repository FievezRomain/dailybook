import { create } from 'zustand';

export interface ObjectiveWizardStep {
  id?: number;
  label: string;
  state: string;
  order: number;
}

export interface ObjectiveWizardFormData {
  title: string;
  datedebut: string;
  datefin: string;
  animaux: number[];
  sousetapes: ObjectiveWizardStep[];
}

const emptyForm = (): ObjectiveWizardFormData => ({
  title: '',
  datedebut: '',
  datefin: '',
  animaux: [],
  sousetapes: [],
});

interface ObjectiveWizardState {
  step: number;
  formData: ObjectiveWizardFormData;
  setStep: (step: number) => void;
  setField: <Key extends keyof ObjectiveWizardFormData>(key: Key, value: ObjectiveWizardFormData[Key]) => void;
  replaceFormData: (formData: ObjectiveWizardFormData) => void;
  reset: () => void;
}

export const useObjectiveWizardStore = create<ObjectiveWizardState>()((set) => ({
  step: 0,
  formData: emptyForm(),
  setStep: (step) => set({ step: Math.max(0, Math.min(2, step)) }),
  setField: (key, value) => set((state) => ({ formData: { ...state.formData, [key]: value } })),
  replaceFormData: (formData) => set({ step: 0, formData }),
  reset: () => set({ step: 0, formData: emptyForm() }),
}));