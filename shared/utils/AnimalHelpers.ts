import instanceDateUtils from './DateUtils';
import { getFileUrl } from '../../services/aws/FileStorageService';

interface Animal {
  id: string;
  nom?: string;
  espece?: string;
  datenaissance?: string;
  datedeces?: string;
  race?: string;
  taille?: number;
  poids?: number;
  sexe?: string;
  food?: string;
  quantity?: number;
  couleur?: string;
  nompere?: string;
  nommere?: string;
  image?: string;
}

type SetValue = (name: string, value: unknown) => void;
type SetState<T> = (value: T) => void;

export const initValuesAnimal = async (
  animal: Animal,
  setValue: SetValue,
  setEspece: SetState<string | undefined>,
  setImage: SetState<string | null>,
  setDate: SetState<string | null>,
): Promise<void> => {
  setValue("id", animal.id);
  setValue("nom", animal.nom);
  setValue("espece", animal.espece);
  setEspece(animal.espece);
  setValue("datenaissance", animal.datenaissance ? instanceDateUtils.dateFormatter(animal.datenaissance, "yyyy-mm-dd", "-") : undefined);
  setValue("datedeces", animal.datedeces ? instanceDateUtils.dateFormatter(animal.datedeces, "yyyy-mm-dd", "-") : undefined);
  setValue("race", animal.race ?? undefined);
  setValue("taille", animal.taille?.toString());
  setValue("poids", animal.poids?.toString());
  setValue("sexe", animal.sexe ?? undefined);
  setValue("food", animal.food ?? undefined);
  setValue("quantity", animal.quantity?.toString());
  setValue("couleur", animal.couleur ?? undefined);
  setValue("nompere", animal.nompere ?? undefined);
  setValue("nommere", animal.nommere ?? undefined);
  setValue("image", animal.image);
  setValue("previousimage", animal.image);
  setDate(animal.datenaissance ? instanceDateUtils.dateFormatter(animal.datenaissance, "yyyy-mm-dd", "-") ?? null : null);
  setImage(animal.image ? await getFileUrl(animal.image, 'animal', animal.id) : null);
};

export const resetValues = (
  setValue: SetValue,
  setDate: SetState<string | null>,
  setEspece: SetState<string | undefined>,
): void => {
  setValue("id", undefined);
  setValue("nom", undefined);
  setValue("espece", undefined);
  setValue("datenaissance", undefined);
  setValue("datedeces", undefined);
  setValue("race", undefined);
  setValue("taille", undefined);
  setValue("poids", undefined);
  setValue("sexe", undefined);
  setValue("food", undefined);
  setValue("quantity", undefined);
  setValue("couleur", undefined);
  setValue("nompere", undefined);
  setValue("nommere", undefined);
  setValue("image", undefined);
  setDate(new Date().toISOString().slice(0, 10));
  setEspece(undefined);
};
