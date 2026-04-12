import { useState, useEffect } from "react";
import { initValuesGroup, resetValues } from "../../../shared/utils/GroupHelpers";
import { useGroupMutations } from "../../../hooks/queries/useGroupsQuery";
import Toast from "react-native-toast-message";
import LoggerService from "../../../services/logs/LoggerService";
import { useAnimalsQuery } from "../../../hooks/queries/useAnimalsQuery";

type SetValue = (name: string, value: unknown) => void;

export const useGroupForm = (
  setValue: SetValue,
  onModify: ((response: unknown) => void) | undefined,
  closeModal: () => Promise<void> | void,
) => {
  const mutations = useGroupMutations();
  const [selected, setSelected] = useState<unknown[]>([]);
  const { data: animaux = [] } = useAnimalsQuery();
  const [members, setMembers] = useState<string[]>([""]);
  const [modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible] = useState(false);

  const loading =
    mutations.create.isPending || mutations.update.isPending ||
    mutations.inviteMembers.isPending || mutations.respondInvitation.isPending ||
    mutations.proposeAnimal.isPending || mutations.respondAnimalShare.isPending ||
    mutations.removeMember.isPending;

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

  const checkSelected = (animal: { id: number }) => {
    if (selected.length > 0) {
      return (selected as { id: number }[]).some((e) => e.id === animal.id);
    }
    return false;
  };

  const submitGroup = async (data: Record<string, unknown>, actionType: string) => {
    if (loading) return;

    try {
      const controlResult = await formatAndControlGroupData(data, actionType);
      if (!controlResult) return;

      let response: unknown = null;

      if (actionType === "modify") {
        response = await mutations.update.mutateAsync({
          id: String(data.id as number),
          body: { name: data.name as string, informations: data.informations as string | undefined, id: data.id as number },
        });
      }
      if (actionType === "create") {
        const created = await mutations.create.mutateAsync({
          name: data.name as string,
          informations: data.informations as string | undefined,
        });
        await mutations.inviteMembers.mutateAsync({
          groupId: String(created.id),
          body: { members: (data.members as string[]).filter((m) => m.trim() !== '') },
        });
        if (selected.length > 0) {
          response = await mutations.proposeAnimal.mutateAsync({
            groupId: String(created.id),
            body: { animals: (selected as { id: number }[]).map((a) => a.id) },
          });
        } else {
          response = created;
        }
      }
      if (actionType === "addMember") {
        response = await mutations.inviteMembers.mutateAsync({
          groupId: String(data.id as number),
          body: { members: data.members as string[] },
        });
      }
      if (actionType === "respondMember") {
        response = await mutations.respondInvitation.mutateAsync({
          invitationId: String(data.id as number),
          body: { status: data.status as 'accepted' | 'declined', email: data.email as string | undefined },
        });
      }
      if (actionType === "addAnimal") {
        response = await mutations.proposeAnimal.mutateAsync({
          groupId: String(data.id as number),
          body: { animals: (selected as { id: number }[]).map((a) => a.id) },
        });
      }
      if (actionType === "respondAnimal") {
        response = await mutations.respondAnimalShare.mutateAsync({
          shareId: String(data.id as number),
          body: { status: data.status as 'accepted' | 'declined', animaux: data.animaux as number[] | undefined },
        });
      }
      if (actionType === "deleteMember") {
        response = await mutations.removeMember.mutateAsync({
          groupId: String(data.id as number),
          body: { user_id: data.user_id as number },
        });
      }

      resetGroupValues();
      await closeModal();
      onModify?.(response);
    } catch (err: unknown) {
      console.log(err);
      Toast.show({ type: "error", position: "top", text1: (err as Error).message });
      LoggerService.log("Erreur lors de la " + actionType + " d'un group : " + (err as Error).message);
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
        return null;
      }
    }
    if (actionType === "addAnimal") {
      if (selected.length === 0) {
        Toast.show({ type: "error", position: "top", text1: "Vous devez ajouter au moins un animal" });
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
