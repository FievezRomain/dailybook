import DateUtils from './DateUtils';
import FileStorageService from '../services/FileStorageService';

const dateUtils = new DateUtils();
const fileStorageService = new FileStorageService();

export const initValuesAnimal = (animal, setValue, setEspece, setImage, setDate, currentUser) => {
    setValue("id", animal.id);
    setValue("nom", animal.nom);
    setValue("espece", animal.espece);
    setEspece(animal.espece);
    setValue("datenaissance", animal.datenaissance ? dateUtils.dateFormatter(animal.datenaissance, "yyyy-mm-dd", "-") : undefined);
    setValue("datedeces", animal.datedeces ? dateUtils.dateFormatter(animal.datedeces, "yyyy-mm-dd", "-") : undefined);
    setValue("race", animal.race || undefined);
    setValue("taille", animal.taille?.toString());
    setValue("poids", animal.poids?.toString());
    setValue("sexe", animal.sexe || undefined);
    setValue("food", animal.food || undefined);
    setValue("quantity", animal.quantity?.toString());
    setValue("couleur", animal.couleur || undefined);
    setValue("nomPere", animal.nompere || undefined);
    setValue("nomMere", animal.nommere || undefined);
    setValue("image", animal.image);
    setValue("previousimage", animal.image);
    setDate(animal.datenaissance ? dateUtils.dateFormatter(animal.datenaissance, "yyyy-mm-dd", "-") : null);
    setImage(animal.image ? fileStorageService.getFileUrl(animal.image, currentUser.uid) : null);
};

export const resetValues = (setValue, setDate, setEspece) => {
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
    setValue("nomPere", undefined);
    setValue("nomMere", undefined);
    setValue("image", undefined);
    setDate(new Date().toISOString().slice(0, 10)); // Exemple : Aujourd'hui
    setEspece(undefined);
};
