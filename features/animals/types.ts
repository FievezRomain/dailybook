import { Animal } from '../../models/Animal';

export type ActionType = 'create' | 'modify';

export type CreateAnimalPayload = {
  nom: string;
  espece: string;
  datenaissance?: string;
  datearrivee?: string;
  datedepart?: string;
  datedeces?: string;
  race?: string;
  taille?: number;
  poids?: number;
  sexe?: string;
  food?: string;
  quantity?: number;
  unity?: string;
  couleur?: string;
  nompere?: string;
  nommere?: string;
  numeroidentification?: string;
  image?: string;
  informations?: string;
  provenance?: string;
};

export type UpdateAnimalPayload = CreateAnimalPayload & { id: number };

export type AnimalHistoryItem = 'poids' | 'taille' | 'food' | 'quantity';

export type AnimalBodyPicturePayload = FormData;

export type BodyPicturePayload = {
  idanimal: number;
  filename: string;
  date_enregistrement?: string;
};

export type AnimalHistoryPayload = {
  idAnimal: number;
  item: AnimalHistoryItem;
  value: string | number;
  unity?: string;
  datemodification?: string;
};

export type AnimalHistoryRecord = {
  id: number;
  idanimal: number;
  value: string | number;
  unity?: string;
  datemodification: string;
  item?: AnimalHistoryItem;
};

/** Props de ModalAnimal — remplace l'ancien `animal?: any` et `actionType: string`. */
export type ModalAnimalProps = {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: ActionType;
  animal?: Animal;
  onModify?: (data?: Animal) => void;
};
