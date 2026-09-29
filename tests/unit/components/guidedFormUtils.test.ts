import { mergeWizardValues, normalizeWizardStep } from '../../../shared/components/ui/patterns/guidedFormUtils';

describe('guided form utilities', () => {
  it('keeps the real total and clamps the current step', () => {
    expect(normalizeWizardStep(3, 6)).toEqual({ current: 3, total: 6 });
    expect(normalizeWizardStep(9, 6)).toEqual({ current: 6, total: 6 });
    expect(normalizeWizardStep(0, 0)).toEqual({ current: 1, total: 1 });
  });
  it('patches values without losing fields from previous steps', () => {
    expect(mergeWizardValues({ name: 'Milo', species: 'Chien' }, { name: 'Nala' })).toEqual({ name: 'Nala', species: 'Chien' });
  });
});
