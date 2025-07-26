import { useState, useEffect } from "react";
import { initValuesGroup, resetValues } from "../utils/GroupHelpers";
import groupServiceInstance from "../services/api/GroupService";
import Toast from "react-native-toast-message";
import LoggerService from "../services/logs/LoggerService";
import { useAnimaux } from "../contexts/AnimauxProvider";

export const useGroupForm = (setValue, onModify, closeModal) => {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const { animaux } = useAnimaux();
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
        resetValues(setValue, setSelected, setMembers);
    };

    const checkSelected = (animal) => {
        if(selected.length > 0){
            const found = selected.some(e => e.id == animal.id);
            return found;
        }
    }

    const submitGroup = async (data, actionType) => {
        if (loading) return;
        setLoading(true);

        // Validation et traitement des données
        try {
             // Formatage et contrôle des données
             let controlResult = await formatAndControlGroupData(data, actionType);
             if( !controlResult ) return;

            // Création ou modification
            let response = null;
            if( actionType === "modify" ){
                response = await groupServiceInstance.modify(data);
            }
            if( actionType === "create" ){
                // Création du groupe
                let responseApi = await groupServiceInstance.create(data);
                data.id = responseApi.rows[0].id;

                // Création des invitations des membres lors de la création
                await groupServiceInstance.inviteMembers(data);

                // Ajout des animaux au groupe lors de la création (et si des animaux sont sélectionnés)
                response = await groupServiceInstance.inviteAnimals(data);
            }
            if( actionType === "addMember" ){
                // Création des invitations des membres
                response = await groupServiceInstance.inviteMembers(data);
            } 
            if( actionType === "respondMember" ){
                // Répondre à une invitation de membre
                response = await groupServiceInstance.respondInvitation(data);
            } 
            if( actionType === "addAnimal" ){
                // Création des invitations des animaux
                response = await groupServiceInstance.inviteAnimals(data);
            }
            if( actionType === "respondAnimal" ){
                // Répondre à une invitation d'un animal dans le group
                response = await groupServiceInstance.respondAnimal(data);
            }
            if( actionType === "deleteMember" ){
                // Supprimer un membre du groupe
                response = await groupServiceInstance.deleteMember(data);
            }

            // Fermeture de la modale
            resetGroupValues();
            await closeModal();
            onModify(response);
        } catch (err) {
            console.log(err)
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
        if( actionType === "addMember" ){
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
        if( actionType === "addAnimal" ){
            if( selected.length === 0 ){
                Toast.show({ type: "error", position: "top", text1: "Vous devez ajouter au moins un animal" });
                setLoading(false);
                return null;
            }
        }

        return data;
    }

    return { initializeGroup, resetGroupValues, submitGroup,
        animaux, selected, setSelected, checkSelected, modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible,
        members, addMember, updateMembers, removeMember,
        loading };
};
