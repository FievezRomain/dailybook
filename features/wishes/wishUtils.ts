import type { Wish } from '@models/Wish';

import type { CreateWishPayload, UpdateWishPayload } from './types';

export type WishListTab = 'planned' | 'acquired' | 'archived';

export function filterWishesByTab(wishes: readonly Wish[], tab: WishListTab): Wish[] {
  if (tab === 'archived') return [];
  const acquired = tab === 'acquired';
  return wishes.filter((wish) => Boolean(wish.acquis) === acquired);
}

export function getWishPriceLabel(wish: Wish): string | undefined {
  const price = wish.prix == null ? '' : String(wish.prix).trim();
  if (!price) return undefined;
  return `${wish.acquis ? 'Prix réalisé' : 'Budget estimé'} · ${price}`;
}

export function getWishMetadata(wish: Wish): string {
  return wish.destinataire?.trim() || 'Pour moi';
}

export interface WishDraft {
  nom: string;
  url: string;
  prix: string;
  destinataire: string;
}

export function wishToDraft(wish?: Wish): WishDraft {
  return {
    nom: wish?.nom ?? '',
    url: wish?.url ?? '',
    prix: wish?.prix == null ? '' : String(wish.prix),
    destinataire: wish?.destinataire ?? '',
  };
}

export function buildWishPayload(draft: WishDraft): CreateWishPayload {
  return {
    nom: draft.nom.trim(),
    url: draft.url.trim() || undefined,
    prix: draft.prix.replaceAll(' ', '').replace(',', '.').trim() || undefined,
    destinataire: draft.destinataire.trim() || undefined,
  };
}

export function buildWishUpdatePayload(draft: WishDraft, wish: Wish, image = wish.image): UpdateWishPayload {
  return {
    id: wish.id,
    ...buildWishPayload(draft),
    acquis: wish.acquis,
    image,
  };
}

export function getWishLinkLabel(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}