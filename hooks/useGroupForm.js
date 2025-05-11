import { useState, useEffect } from "react";
import { initValuesGroup, resetValues } from "../utils/GroupHelpers";
import groupServiceInstance from "../services/GroupService";
import Toast from "react-native-toast-message";
import LoggerService from "../services/LoggerService";
import { useAnimaux } from "../providers/AnimauxProvider";

export const useGroupForm = (setValue, onModify, closeModal) => {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const { animaux, setAnimaux } = useAnimaux();
    const [members, setMembers] = useState([""]);
    const [ modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible ] = useState(false);

    useEffect(() => {
        setValue("members", members);
    }, [members]);

    const addMember = () => {
        setMembers((prev) => [
          ...prev,
          "",
        ]);
    };

    const updateMembers = (index, text) => {
        const updated = members.map((member, i) =>
          i === index ? text : member
        );
        setMembers(updated);
    };
    
    const removeMember = (index) => {
        const filtered = members.filter((_, i) => i !== index);
        setMembers(filtered);
    };

    const initializeGroup = (group) => {
        initValuesGroup(group, setValue);
    };

    const resetGroupValues = () => {
        resetValues(setValue);
    };

    const submitGroup = async (data, actionType) => {
        if (loading) return;
        setLoading(true);

        // Validation et traitement des données
        try {
             // Formatage et contrôle des données
             let controlResult = await formatAndControlGroupData(data, actionType);
             if( !controlResult ) return;

            // Création ou modification
            const response =
                actionType === "modify"
                    ? await groupServiceInstance.modify(data)
                    : await groupServiceInstance.create(data);
            if( actionType === "create" ){
                // Création des invitations des membres lors de la création
                await groupServiceInstance.inviteMembers(data);

                // Ajout des animaux au groupe lors de la création (et si des animaux sont sélectionnés)
                
            }

            // Fermeture de la modale
            resetGroupValues();
            closeModal();
            onModify(response);
        } catch (err) {
            Toast.show({ type: "error", position: "top", text1: err.message });
            LoggerService.log( "Erreur lors de la " + actionType + " d'un group : " + err.message );
        } finally {
            setLoading(false);
        }
    };

    const formatAndControlGroupData = async (data, actionType) => {
        if( actionType === "create" ){
            if( !Array.isArray(data.members) || (Array.isArray(data.members) && data.members.length < 1) || (Array.isArray(data.members) && data.members.length === 1 && data.members[0].trim() === "") ){
                Toast.show({ type: "error", position: "top", text1: "Vous devez ajouter au moins un membre" });
                setLoading(false);
                return null;
            }

            const invalidEmails = data.members.filter(
                (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );
    
            if (invalidEmails.length > 0) {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Email(s) invalide(s)",
                    text2: `Corrigez : ${invalidEmails.join(", ")}`
                });
                setLoading(false);
                return null;
            }
        }

        return data;
    }

    return { initializeGroup, resetGroupValues, submitGroup,
        animaux, selected, setSelected, modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible,
        members, addMember, updateMembers, removeMember,
        loading };
};
