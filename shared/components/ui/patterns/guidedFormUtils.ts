export function normalizeWizardStep(currentStep: number, totalSteps: number) {
  const total = Math.max(1, Math.floor(totalSteps));
  return { current: Math.min(total, Math.max(1, Math.floor(currentStep))), total };
}
export function mergeWizardValues<T extends Record<string, unknown>>(current: T, patch: Partial<T>): T {
  return { ...current, ...patch };
}
