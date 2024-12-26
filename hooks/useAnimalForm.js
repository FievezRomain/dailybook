import { useState } from "react";
import { initValuesAnimal, resetValues } from "../utils/AnimalHelpers";
import animalsServiceInstance from "../services/AnimalsService";
import Toast from "react-native-toast-message";
import DateUtils from "../utils/DateUtils";
import FileStorageService from "../services/FileStorageService";
import LoggerService from "../services/LoggerService";

export const useAnimalForm = (setValue, currentUser, onModify, closeModal) => {
    const [loading, setLoading] = useState(false);
    const dateUtils = new DateUtils();
    const fileStorageService = new FileStorageService();

    const initializeAnimal = (animal, setEspece, setImage, setDate) => {
        initValuesAnimal(animal, setValue, setEspece, setImage, setDate, currentUser);
    };

    const resetAnimalValues = (setDate, setEspece) => {
        resetValues(setValue, setDate, setEspece);
    };

    const submitAnimal = async (data, actionType, setDate, espece, setEspece, setError) => {
        if (loading) return;
        setLoading(true);

        // Validation et traitement des données
        try {

            // Formatage et contrôle des données
            var controlResult = formatAndControlAnimalData(data, actionType, setError, espece);
            if(!controlResult) return;

            // Création ou modification
            const response =
                actionType === "modify"
                    ? await animalsServiceInstance.modify(data)
                    : await animalsServiceInstance.create(data);
            resetAnimalValues(setDate, setEspece);
            closeModal();
            onModify(response);
        } catch (err) {
            Toast.show({ type: "error", position: "top", text1: err.message });
            LoggerService.log( "Erreur lors de la " + actionType + " d'un animal : " + err.message );
        } finally {
            setLoading(false);
        }
    };

    const formatAndControlAnimalData = async (data, actionType, setError, espece) => {
        // Vérification du champ espèce
        if (!espece) {
            setError("espece", { type: "manual" });
            setLoading(false);
            return null;
        }

        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["email"] =  currentUser.email;

        // Modification des , en . pour les champs numériques taille, poids et quantity à cause de la possibilité de mettre les 2 sur android
        data["poids"] !== undefined ? data["poids"] = data["poids"].replace(",", ".") : undefined;
        data["taille"] !== undefined ? data["taille"] = data["taille"].replace(",", ".") : undefined;
        data["quantity"] !== undefined ? data["quantity"] = data["quantity"].replace(",", ".") : undefined;
        
        // Modification du format de la date pour le bon stockage en base
        if( data["datenaissance"] !== null && data["datenaissance"] !== undefined && data["datenaissance"].length === 0 ){
            data["datenaissance"] = undefined;
        }

        if( ( data["datenaissance"] !== null && data["datenaissance"] !== undefined ) && ( data["datenaissance"].length !== 10 || !dateUtils.isDateValid( dateUtils.dateFormatter( data["datenaissance"], "dd/MM/yyyy", "/") ) ) ){
            Toast.show({
                position: "top",
                type: "error",
                text1: "Problème de format de date"
            });
            setLoading(false);
            return null;
        }

        if( data["datenaissance"] !== null && data["datenaissance"] !== undefined ){
            data["datenaissance"] = dateUtils.dateFormatter( data["datenaissance"], "dd/MM/yyyy", "/");
        }

        // Vérification de la valeur des entiers/décimal
        if( !checkNumericFormat(data, "taille") || !checkNumericFormat(data, "poids") || !checkNumericFormat(data, "quantity") ){
            setLoading(false);
            return null;
        }

        // Ajout d'un 0 sur la première partie de la date de naissance si on a 9 caractères dans la date de naissance
        /* if( data["datenaissance"] !== null && data["datenaissance"] !== undefined && data["datenaissance"].length === 9){
            data["datenaissance"] = "0" + data["datenaissance"];
            setDate(data["datenaissance"]);
        } */

        // Si une image est saisie
        if (data.image != undefined){
            // Si on est sur une création ou que l'image de base est modifiée, on enregistre sur le S3 et on renseigne uniquement le filename dans data pour la BDD
            if(actionType !== "modify" || data["previousimage"] !== data["image"]){
                if(image != null){
                    var filename = data.image.split("/");
                    filename = filename[filename.length-1];

                    await fileStorageService.uploadFile(image, filename, "image/jpeg", currentUser.uid);

                    data.image = filename;
                } 
            }
        }
        return data;
    };

    const checkNumericFormat = (data, attribute) => {
        if( data[attribute] != undefined && data[attribute] != undefined )
        {
            const numericValue = parseFloat(data[attribute].replace(',', '.').replace(" ", ""));
            if (isNaN(numericValue)) {
                Toast.show({
                    position: "top",
                    type: "error",
                    text1: "Problème de format sur l'attribut " + attribute,
                    text2: "Seul les chiffres, virgule et point sont acceptés"
                });
                return false;
            } else{
                data[attribute] = numericValue;
            }
        }
        return true;
    }

    return { initializeAnimal, resetAnimalValues, submitAnimal, loading };
};
