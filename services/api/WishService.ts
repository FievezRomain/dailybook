import { createCrudService } from './factory';
import { CreateWishPayload, UpdateWishPayload } from '../../features/wishes/types';
import { Wish } from '../../models/Wish';

const _crud = createCrudService<Wish, CreateWishPayload, UpdateWishPayload>('/wishes');

export const getWishes = _crud.getAll;
export const createWish = _crud.create;
export const updateWish = _crud.update;
export const deleteWish = _crud.remove;
