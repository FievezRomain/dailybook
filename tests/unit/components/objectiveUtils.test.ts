import type { Objectif } from '../../../models/Objectif';
import { duplicateObjectivePayload, toggleObjectiveStepPayload } from '../../../features/objectifs/objectiveUtils';

const objective = { id: 7, title: 'Marcher', temporalityobjectif: 'month', datedebut: new Date('2026-08-01'), datefin: new Date('2026-08-31'), animaux: [2], sousetapes: [{ id: 9, etape: 'Faire 5 km', state: 'todo', order: 1 }] } as Objectif;
describe('objective payloads', () => {
  it('toggles one precise step without forwarding the removed temporality field', () => { const payload = toggleObjectiveStepPayload(objective, 9); expect(payload).toMatchObject({ id: 7, animaux: [2], sousetapes: [{ id: 9, state: 'done' }] }); expect(payload).not.toHaveProperty('temporalityobjectif'); });
  it('duplicates as a new reset objective without legacy temporality or subtask ids', () => { const payload = duplicateObjectivePayload(objective); expect(payload.title).toContain('copie'); expect(payload).not.toHaveProperty('temporalityobjectif'); expect(payload.sousetapes).toEqual([{ etape: 'Faire 5 km', state: 'todo', order: 1 }]); });
});
