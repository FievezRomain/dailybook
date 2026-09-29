import { useObjectiveWizardStore } from '../../../stores/useObjectiveWizardStore';

describe('objective wizard store', () => {
  beforeEach(() => useObjectiveWizardStore.getState().reset());

  it('keeps the wizard within its three approved steps', () => {
    useObjectiveWizardStore.getState().setStep(8);
    expect(useObjectiveWizardStore.getState().step).toBe(2);
    useObjectiveWizardStore.getState().setStep(-1);
    expect(useObjectiveWizardStore.getState().step).toBe(0);
  });

  it('preserves the draft between steps and clears it on reset', () => {
    useObjectiveWizardStore.getState().setField('title', 'Marcher 20 km');
    useObjectiveWizardStore.getState().setField('animaux', [4]);
    useObjectiveWizardStore.getState().setStep(2);
    expect(useObjectiveWizardStore.getState().formData).toMatchObject({ title: 'Marcher 20 km', animaux: [4] });
    useObjectiveWizardStore.getState().reset();
    expect(useObjectiveWizardStore.getState()).toMatchObject({ step: 0, formData: { title: '', animaux: [], sousetapes: [] } });
  });
});