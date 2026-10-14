import { createCrudService } from './factory';
import { CreateWishPayload, UpdateWishPayload } from '../../features/wishes/types';
import { Wish } from '../../models/Wish';
import { FileService, fileDownloadKey } from './FileService';

const _crud = createCrudService<Wish, CreateWishPayload, UpdateWishPayload>('/wishes');

export async function getWishes(): Promise<Wish[]> {
  const wishes = await _crud.getAll();
  const urls = await FileService.getDownloadUrls(wishes.flatMap((wish) => wish.image
    ? [{ filename: wish.image, ressourceType: 'wish' as const, ressourceId: wish.id }]
    : []));
  return wishes.map((wish) => wish.image
    ? { ...wish, imageUrl: urls.get(fileDownloadKey({ filename: wish.image, ressourceType: 'wish', ressourceId: wish.id })) ?? wish.imageUrl }
    : wish);
}
export const createWish = _crud.create;
export const updateWish = _crud.update;
export const deleteWish = _crud.remove;
