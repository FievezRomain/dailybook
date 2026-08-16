import type { Objectif } from '../../models/Objectif';
import type { CreateObjectifPayload, UpdateObjectifPayload } from './types';

const doneStates = ['done', 'completed', 'termine', 'terminé', 'true'];
export const isObjectiveStepDone = (state: string) => doneStates.includes(String(state).toLowerCase());
const apiDate = (value: Date) => new Date(value).toISOString().slice(0, 10);

export function objectiveToPayload(objective: Objectif): UpdateObjectifPayload {
  return { id: objective.id, title: objective.title, datedebut: apiDate(objective.datedebut), datefin: apiDate(objective.datefin), animaux: [...objective.animaux], sousetapes: objective.sousetapes.map((step) => ({ id: step.id, etape: step.etape, state: step.state, order: step.order })) };
}

export function toggleObjectiveStepPayload(objective: Objectif, stepId: number): UpdateObjectifPayload {
  const payload = objectiveToPayload(objective);
  return { ...payload, sousetapes: payload.sousetapes?.map((step) => step.id === stepId ? { ...step, state: isObjectiveStepDone(step.state) ? 'todo' : 'done' } : step) };
}

export function duplicateObjectivePayload(objective: Objectif): CreateObjectifPayload {
  const { id: _id, ...payload } = objectiveToPayload(objective);
  return { ...payload, title: `${objective.title} — copie`, sousetapes: payload.sousetapes?.map(({ id: _stepId, ...step }) => ({ ...step, state: 'todo' })) };
}
