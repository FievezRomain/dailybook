/** Enregistrement historique d'un suivi animal (poids, taille, alimentation). */
export type AnimalHistoryRecord = {
  id: number;
  idanimal: number;
  value: number | string | null;
  unity: string | null;
  datemodification: string | null;
  item: 'poids' | 'taille' | 'food' | 'quantity';
};
