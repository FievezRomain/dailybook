export type CreateWishPayload = {
  nom: string;
  destinataire?: string;
  acquis?: boolean;
  url?: string;
  prix?: number;
  image?: string;
};

export type UpdateWishPayload = CreateWishPayload & { id: number };
