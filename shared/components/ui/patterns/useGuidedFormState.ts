import { useCallback, useState } from 'react';
import { mergeWizardValues, normalizeWizardStep } from './guidedFormUtils';

export function useGuidedFormState<TValues extends Record<string, unknown>>(initialValues: TValues, totalSteps: number) {
  const [values, setValues] = useState<TValues>(initialValues);
  const [currentStep, setCurrentStep] = useState(1);
  const [dirty, setDirty] = useState(false);
  const progress = normalizeWizardStep(currentStep, totalSteps);

  const patchValues = useCallback((patch: Partial<TValues>) => { setValues((current) => mergeWizardValues(current, patch)); setDirty(true); }, []);
  const setField = useCallback(<TKey extends keyof TValues>(key: TKey, value: TValues[TKey]) => { setValues((current) => ({ ...current, [key]: value })); setDirty(true); }, []);
  const next = useCallback(() => setCurrentStep((step) => normalizeWizardStep(step + 1, totalSteps).current), [totalSteps]);
  const previous = useCallback(() => setCurrentStep((step) => Math.max(1, step - 1)), []);
  const goTo = useCallback((step: number) => setCurrentStep(normalizeWizardStep(step, totalSteps).current), [totalSteps]);
  const markSaved = useCallback(() => setDirty(false), []);
  const reset = useCallback(() => { setValues(initialValues); setCurrentStep(1); setDirty(false); }, [initialValues]);

  return { values, patchValues, setField, currentStep: progress.current, totalSteps: progress.total, next, previous, goTo, dirty, markSaved, reset } as const;
}
