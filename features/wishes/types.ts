export type CreateWishPayload = {
  nom: string;
  destinataire?: string;
  acquis?: boolean;
  url?: string;
  /** Le backend stocke le prix comme chaîne pour gérer unités et devises. */
  prix?: string;
  image?: string;
};

export type UpdateWishPayload = CreateWishPayload & { id: number };
