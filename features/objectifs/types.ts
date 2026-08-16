export type SubTaskPayload = {
  id?: number;
  etape: string;
  state: string;
  order: number;
};

export type CreateObjectifPayload = {
  title: string;
  datedebut: string;
  datefin: string;
  animaux: number[];
  sousetapes?: SubTaskPayload[];
};

export type UpdateObjectifPayload = CreateObjectifPayload & { id: number };
