import type { Objectif } from '../../../models/Objectif';
import { duplicateObjectivePayload, isObjectiveExpired, isObjectiveInProgress, toggleObjectiveStepPayload } from '../../../features/objectifs/objectiveUtils';

const objective = { id: 7, title: 'Marcher', temporalityobjectif: 'month', datedebut: new Date('2026-08-01'), datefin: new Date('2026-08-31'), animaux: [2], sousetapes: [{ id: 9, etape: 'Faire 5 km', state: 'todo', order: 1 }] } as Objectif;
describe('objective payloads', () => {
  it('toggles one precise step without forwarding the removed temporality field', () => { const payload = toggleObjectiveStepPayload(objective, 9); expect(payload).toMatchObject({ id: 7, animaux: [2], sousetapes: [{ id: 9, state: 'done' }] }); expect(payload).not.toHaveProperty('temporalityobjectif'); });
  it('duplicates as a new reset objective without legacy temporality or subtask ids', () => { const payload = duplicateObjectivePayload(objective); expect(payload.title).toContain('copie'); expect(payload).not.toHaveProperty('temporalityobjectif'); expect(payload.sousetapes).toEqual([{ etape: 'Faire 5 km', state: 'todo', order: 1 }]); });
  it('keeps an objective active only while a step remains and the end date is not past', () => {
    const today = new Date(2026, 7, 21, 12);
    expect(isObjectiveInProgress(objective, today)).toBe(true);
    expect(isObjectiveExpired({ ...objective, datefin: new Date('2026-08-20') }, today)).toBe(true);
    expect(isObjectiveInProgress({ ...objective, sousetapes: [{ ...objective.sousetapes[0], state: 'done' }] }, today)).toBe(false);
  });
});
