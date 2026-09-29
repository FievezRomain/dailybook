import { createCrudService } from './factory';
import { CreateObjectifPayload, UpdateObjectifPayload } from '../../features/objectifs/types';
import { Objectif } from '../../models/Objectif';
import httpClient from './httpClient';

const _crud = createCrudService<Objectif, CreateObjectifPayload, UpdateObjectifPayload>('/objectifs');

export const getObjectifs = _crud.getAll;
export const createObjectif = _crud.create;
/** Mise à jour complète de l'objectif et de ses sous-tâches */
export const updateObjectif = _crud.update;
export const deleteObjectif = _crud.remove;
export const updateSubtaskState = async (objectiveId: string, subtaskId: number, state: boolean): Promise<{ id: number; state: boolean }> =>
  (await httpClient.patch(`/objectifs/${objectiveId}/subtasks/${subtaskId}`, { state })).data;
