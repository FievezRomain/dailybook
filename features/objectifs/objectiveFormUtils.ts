import { z } from 'zod';
import type { Objectif } from '../../models/Objectif';
import type { ObjectiveWizardFormData, ObjectiveWizardStep } from '../../stores/useObjectiveWizardStore';
import type { CreateObjectifPayload, UpdateObjectifPayload } from './types';

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export const objectiveDetailsSchema = z.object({
  title: z.string().trim().min(1, 'Indiquez un titre.'),
  datedebut: z.string().regex(isoDate, 'Choisissez une date de début.'),
  datefin: z.string().regex(isoDate, 'Choisissez une date de fin.'),
}).refine((value) => value.datefin >= value.datedebut, {
  path: ['datefin'],
  message: 'La date de fin doit suivre la date de début.',
});

const toIsoDate = (value: Date) => new Date(value).toISOString().slice(0, 10);

export function objectiveToWizardForm(objective: Objectif): ObjectiveWizardFormData {
  return {
    title: objective.title,
    datedebut: toIsoDate(objective.datedebut),
    datefin: toIsoDate(objective.datefin),
    animaux: [...objective.animaux],
    sousetapes: objective.sousetapes.map((step) => ({
      id: step.id,
      label: step.etape,
      state: step.state === true ? 'done' : step.state === false ? 'todo' : step.state,
      order: step.order,
    })),
  };
}

export function objectiveToDuplicateWizardForm(objective: Objectif): ObjectiveWizardFormData {
  const form = objectiveToWizardForm(objective);
  return { ...form, sousetapes: form.sousetapes.map(({ label, order }) => ({ label, order, state: 'todo' })) };
}

export function stepsFromText(value: string, previous: readonly ObjectiveWizardStep[]): ObjectiveWizardStep[] {
  return value.split('\n').map((label) => label.trim()).filter(Boolean).map((label, index) => ({
    id: previous[index]?.id,
    label,
    state: previous[index]?.state ?? 'todo',
    order: index + 1,
  }));
}

export const objectiveWizardFingerprint = (form: ObjectiveWizardFormData) => JSON.stringify(form);

export function buildObjectivePayload(form: ObjectiveWizardFormData): CreateObjectifPayload {
  return {
    title: form.title.trim(),
    datedebut: form.datedebut,
    datefin: form.datefin,
    animaux: [...form.animaux],
    sousetapes: form.sousetapes.map((step, index) => ({
      etape: step.label,
      state: step.state,
      order: index + 1,
    })),
  };
}

export function buildObjectiveUpdatePayload(form: ObjectiveWizardFormData, id: number): UpdateObjectifPayload {
  return { ...buildObjectivePayload(form), id, sousetapes: form.sousetapes.map((step, index) => ({ id: step.id, etape: step.label, state: step.state, order: index + 1 })) };
}
