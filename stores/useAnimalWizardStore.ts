import { create } from 'zustand';

export interface AnimalWizardFormData {
  nom?: string;
  espece?: string;
  race?: string;
  datenaissance?: string;
  sexe?: string;
  couleur?: string;
  poids?: string;
  taille?: string;
  nompere?: string;
  nommere?: string;
  image?: string;
  [key: string]: unknown;
}

interface AnimalWizardState {
  step: number;
  formData: AnimalWizardFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setField: (key: string, value: unknown) => void;
  setFormData: (data: Partial<AnimalWizardFormData>) => void;
  reset: () => void;
}

export const useAnimalWizardStore = create<AnimalWizardState>()((set) => ({
  step: 0,
  formData: {},

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

  setField: (key, value) =>
    set((s) => ({ formData: { ...s.formData, [key]: value } })),

  setFormData: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  reset: () => set({ step: 0, formData: {} }),
}));
