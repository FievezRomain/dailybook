import { useState, useEffect } from "react";
import { initValuesGroup, resetValues } from "../../../shared/utils/GroupHelpers";
import {
  createGroup,
  updateGroup,
  inviteMembers,
  respondInvitation,
  proposeAnimal,
  respondAnimalShare,
  removeMember,
} from "../../../services/api/GroupService";
import Toast from "react-native-toast-message";
import LoggerService from "../../../services/logs/LoggerService";
import { useAnimalsQuery } from "../../../hooks/queries/useAnimalsQuery";

type SetValue = (name: string, value: unknown) => void;

export const useGroupForm = (
  setValue: SetValue,
  onModify: ((response: unknown) => void) | undefined,
  closeModal: () => Promise<void> | void,
) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<unknown[]>([]);
  const { data: animaux = [] } = useAnimalsQuery();
  const [members, setMembers] = useState<string[]>([""]);
  const [modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible] = useState(false);

  useEffect(() => {
    setValue("members", members);
  }, [members]);

  const addMember = () => {
    setMembers((prev) => [...prev, ""]);
  };

  const updateMembers = (index: number, text: string) => {
    const updated = members.map((member, i) => (i === index ? text : member));
    setMembers(updated);
  };

  const removeMemberField = (index: number) => {
    const filtered = members.filter((_, i) => i !== index);
    setMembers(filtered);
  };

  const initializeGroup = (group: Record<string, unknown>) => {
    initValuesGroup(group as Parameters<typeof initValuesGroup>[0], setValue);
  };

  const resetGroupValues = () => {
    resetValues(setValue, setSelected, setMembers);
  };

  const checkSelected = (animal: { id: string }) => {
    if (selected.length > 0) {
      return (selected as { id: string }[]).some((e) => e.id === animal.id);
    }
    return false;
  };

  const submitGroup = async (data: Record<string, unknown>, actionType: string) => {
    if (loading) return;
    setLoading(true);

    try {
      const controlResult = await formatAndControlGroupData(data, actionType);
      if (!controlResult) return;

      let response: unknown = null;

      if (actionType === "modify") {
        response = await updateGroup(data.id as string, data);
      }
      if (actionType === "create") {
        const created = await createGroup(data);
        data.id = (created as { id: string }).id;
        await inviteMembers(data.id as string, { members: data.members });
        if (selected.length > 0) {
          response = await proposeAnimal(data.id as string, {
            animalIds: (selected as { id: string }[]).map((a) => a.id),
          });
        } else {
          response = created;
        }
      }
      if (actionType === "addMember") {
        response = await inviteMembers(data.id as string, { members: data.members });
      }
      if (actionType === "respondMember") {
        response = await respondInvitation(data.id as string, data);
      }
      if (actionType === "addAnimal") {
        response = await proposeAnimal(data.id as string, data);
      }
      if (actionType === "respondAnimal") {
        response = await respondAnimalShare(data.id as string, data);
      }
      if (actionType === "deleteMember") {
        response = await removeMember(data.id as string, data);
      }

      resetGroupValues();
      await closeModal();
      onModify?.(response);
    } catch (err: unknown) {
      console.log(err);
      Toast.show({ type: "error", position: "top", text1: (err as Error).message });
      LoggerService.log("Erreur lors de la " + actionType + " d'un group : " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatAndControlGroupData = async (
    data: Record<string, unknown>,
    actionType: string,
  ): Promise<Record<string, unknown> | null> => {
    if (actionType === "create") {
      const membersArr = data.members as string[];
      if (
        !Array.isArray(membersArr) ||
        membersArr.length < 1 ||
        (membersArr.length === 1 && membersArr[0].trim() === "")
      ) {
        Toast.show({ type: "error", position: "top", text1: "Vous devez ajouter au moins un membre" });
        setLoading(false);
        return null;
      }

      const invalidEmails = membersArr.filter(
        (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      );
      if (invalidEmails.length > 0) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Email(s) invalide(s)",
          text2: `Corrigez : ${invalidEmails.join(", ")}`,
        });
        setLoading(false);
        return null;
      }
    }
    if (actionType === "addMember") {
      const membersArr = data.members as string[];
      if (
        !Array.isArray(membersArr) ||
        membersArr.length < 1 ||
        (membersArr.length === 1 && membersArr[0].trim() === "")
      ) {
        Toast.show({ type: "error", position: "top", text1: "Vous devez ajouter au moins un membre" });
        setLoading(false);
        return null;
      }

      const invalidEmails = membersArr.filter(
        (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      );
      if (invalidEmails.length > 0) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Email(s) invalide(s)",
          text2: `Corrigez : ${invalidEmails.join(", ")}`,
        });
        setLoading(false);
        return null;
      }
    }
    if (actionType === "addAnimal") {
      if (selected.length === 0) {
        Toast.show({ type: "error", position: "top", text1: "Vous devez ajouter au moins un animal" });
        setLoading(false);
        return null;
      }
    }
    return data;
  };

  return {
    initializeGroup,
    resetGroupValues,
    submitGroup,
    animaux,
    selected,
    setSelected,
    checkSelected,
    modalSelectAnimalsIsVisible,
    setModalSelectAnimalsIsVisible,
    members,
    addMember,
    updateMembers,
    removeMember: removeMemberField,
    loading,
  };
};
