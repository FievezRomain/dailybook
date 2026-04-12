import { useState } from "react";
import { initValuesAnimal, resetValues } from "../../../shared/utils/AnimalHelpers";
import { createAnimal, updateAnimal } from "../../../services/api/AnimalsService";
import Toast from "react-native-toast-message";
import { uploadFile } from "../../../services/aws/FileStorageService";
import LoggerService from "../../../services/logs/LoggerService";
import instanceDateUtils from "../../../shared/utils/DateUtils";

interface CurrentUser {
  uid: string;
  email: string;
}

type SetValue = (name: string, value: unknown) => void;
type SetState<T> = (value: T) => void;

export const useAnimalForm = (
  setValue: SetValue,
  currentUser: CurrentUser,
  onModify: (response: unknown) => void,
  closeModal: () => void,
) => {
  const [loading, setLoading] = useState(false);

  const initializeAnimal = async (
    animal: Record<string, unknown>,
    setEspece: SetState<string | undefined>,
    setImage: SetState<string | null>,
    setDate: SetState<string | null>,
  ) => {
    await initValuesAnimal(animal as unknown as Parameters<typeof initValuesAnimal>[0], setValue, setEspece, setImage, setDate);
  };

  const resetAnimalValues = (setDate: SetState<string | null>, setEspece: SetState<string | undefined>) => {
    resetValues(setValue, setDate, setEspece);
  };

  const submitAnimal = async (
    data: Record<string, unknown>,
    actionType: string,
    setDate: SetState<string | null>,
    espece: string | undefined,
    setEspece: SetState<string | undefined>,
    setError: (name: string, error: { type: string }) => void,
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const controlResult = await formatAndControlAnimalData(data, actionType, setError, espece);
      if (!controlResult) return;

      const response =
        actionType === "modify"
          ? await updateAnimal(data.id as string, data)
          : await createAnimal(data);

      resetAnimalValues(setDate, setEspece);
      closeModal();
      onModify(response);
    } catch (err: unknown) {
      Toast.show({ type: "error", position: "top", text1: (err as Error).message });
      LoggerService.log("Erreur lors de la " + actionType + " d'un animal : " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatAndControlAnimalData = async (
    data: Record<string, unknown>,
    actionType: string,
    setError: (name: string, error: { type: string }) => void,
    espece: string | undefined,
  ): Promise<Record<string, unknown> | null> => {
    if (!espece) {
      setError("espece", { type: "manual" });
      setLoading(false);
      return null;
    }

    data["email"] = currentUser.email;

    if (data["poids"] !== undefined) data["poids"] = (data["poids"] as string).replace(",", ".");
    if (data["taille"] !== undefined) data["taille"] = (data["taille"] as string).replace(",", ".");
    if (data["quantity"] !== undefined) data["quantity"] = (data["quantity"] as string).replace(",", ".");

    if (data["datenaissance"] !== null && data["datenaissance"] !== undefined && (data["datenaissance"] as string).length === 0) {
      data["datenaissance"] = undefined;
    }

    if (
      data["datenaissance"] !== null &&
      data["datenaissance"] !== undefined &&
      ((data["datenaissance"] as string).length !== 10 ||
        !instanceDateUtils.isDateValid(
          instanceDateUtils.dateFormatter(data["datenaissance"] as string, "dd/MM/yyyy", "/") ?? ""
        ))
    ) {
      Toast.show({ position: "top", type: "error", text1: "Problème de format de date" });
      setLoading(false);
      return null;
    }

    if (data["datenaissance"] !== null && data["datenaissance"] !== undefined) {
      data["datenaissance"] = instanceDateUtils.dateFormatter(data["datenaissance"] as string, "dd/MM/yyyy", "/");
    }

    if (
      data["datedeces"] !== null &&
      data["datedeces"] !== undefined &&
      ((data["datedeces"] as string).length !== 10 ||
        !instanceDateUtils.isDateValid(data["datedeces"] as string))
    ) {
      Toast.show({ position: "top", type: "error", text1: "Problème de format de date de décès" });
      setLoading(false);
      return null;
    }

    if (!checkNumericFormat(data, "taille") || !checkNumericFormat(data, "poids") || !checkNumericFormat(data, "quantity")) {
      setLoading(false);
      return null;
    }

    if (data.image !== undefined) {
      const imageUri = data.image as string;
      if (actionType !== "modify" || data["previousimage"] !== data["image"]) {
        if (imageUri != null) {
          const parts = imageUri.split("/");
          const filename = parts[parts.length - 1];
          await uploadFile(imageUri, filename, "image/jpeg", "animal", (data.id as string) || currentUser.uid);
          data.image = filename;
        }
      }
    }

    return data;
  };

  const checkNumericFormat = (data: Record<string, unknown>, attribute: string): boolean => {
    if (data[attribute] !== undefined) {
      const numericValue = parseFloat((data[attribute] as string).replace(',', '.').replace(" ", ""));
      if (isNaN(numericValue)) {
        Toast.show({
          position: "top",
          type: "error",
          text1: "Problème de format sur l'attribut " + attribute,
          text2: "Seul les chiffres, virgule et point sont acceptés",
        });
        return false;
      } else {
        data[attribute] = numericValue;
      }
    }
    return true;
  };

  return { initializeAnimal, resetAnimalValues, submitAnimal, loading };
};
