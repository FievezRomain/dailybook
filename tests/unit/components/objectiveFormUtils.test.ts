import type { Objectif } from '../../../models/Objectif';
import { buildObjectivePayload, objectiveDetailsSchema, objectiveToWizardForm, stepsFromText } from '../../../features/objectifs/objectiveFormUtils';

const objective: Objectif = {
  id: 7,
  title: 'Marcher 20 km',
  datedebut: new Date('2026-08-02T00:00:00.000Z'),
  datefin: new Date('2026-08-31T00:00:00.000Z'),
  animaux: [2],
  temporalityobjectif: 'legacy-value',
  sousetapes: [{ id: 9, etape: 'Faire 5 km', state: 'done', order: 1 }],
};

describe('objective form contract', () => {
  it('hydrates all editable fields without carrying the removed temporality field', () => {
    expect(objectiveToWizardForm(objective)).toEqual({
      title: 'Marcher 20 km',
      datedebut: '2026-08-02',
      datefin: '2026-08-31',
      animaux: [2],
      sousetapes: [{ id: 9, label: 'Faire 5 km', state: 'done', order: 1 }],
    });
  });

  it('builds the backend payload from dates, animals and ordered steps only', () => {
    const form = objectiveToWizardForm(objective);
    const payload = buildObjectivePayload(form);
    expect(payload).not.toHaveProperty('temporalityobjectif');
    expect(payload).not.toHaveProperty('reminder');
    expect(payload.sousetapes).toEqual([{ id: 9, etape: 'Faire 5 km', state: 'done', order: 1 }]);
  });

  it('preserves existing step ids by position while normalizing entered lines', () => {
    const previous = objectiveToWizardForm(objective).sousetapes;
    expect(stepsFromText(' Faire 10 km \n\nFaire 20 km ', previous)).toEqual([
      { id: 9, label: 'Faire 10 km', state: 'done', order: 1 },
      { id: undefined, label: 'Faire 20 km', state: 'todo', order: 2 },
    ]);
  });

  it('rejects an end date before the start date', () => {
    const result = objectiveDetailsSchema.safeParse({ title: 'Test', datedebut: '2026-08-31', datefin: '2026-08-02' });
    expect(result.success).toBe(false);
  });
});