import { createCrudService } from './factory';
import { CreateObjectifPayload, UpdateObjectifPayload } from '../../features/objectifs/types';
import { Objectif } from '../../models/Objectif';

const _crud = createCrudService<Objectif, CreateObjectifPayload, UpdateObjectifPayload>('/objectifs');

export const getObjectifs = _crud.getAll;
export const createObjectif = _crud.create;
/** Mise à jour complète de l'objectif et de ses sous-tâches */
export const updateObjectif = _crud.update;
export const deleteObjectif = _crud.remove;
