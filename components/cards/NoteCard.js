import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import variables from '../styles/Variables';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ModalSubMenuNoteActions from '../Modals/ModalSubMenuNoteActions';
import ModalNote from "../Modals/ModalNote";
import Toast from "react-native-toast-message";
import NoteService from '../../services/NoteService';
import LoggerService from '../../services/LoggerService';
import HTMLView from 'react-native-htmlview';

const NoteCard = ({ note, handleNoteChange, handleNoteDelete }) => {
    const [focus, setFocus] = useState(false);
    const [modalSubMenuNoteVisible, setModalSubMenuNoteVisible] = useState(false);
    const [modalNote, setModaleNote] = useState(false);
    const noteService = new NoteService();

    const handleDelete = () => {
        let data = {};
        data["id"] = note.id;
        noteService.delete(data)
            .then((reponse) => {
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'une note réussie"
                });
                handleNoteDelete(note);
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log("Erreur lors de la suppression d'une note : " + err.message);
            });
    };

    const onPressOptions = () => {
        setModalSubMenuNoteVisible(true);
    };

    const handleModify = () => {
        setModaleNote(true);
    };

    const onModify = (noteModified) => {
        Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'une note réussie"
        });

        handleNoteChange(noteModified);
    };

    const getPreviewHTML = (htmlContent, length) => {
        const plainText = htmlContent.replace(/<[^>]+>/g, ''); // Supprimer toutes les balises HTML pour avoir du texte brut
        const trimmedText = plainText.substring(0, length); // Extraire les premiers caractères du texte brut
        return trimmedText.length >= length ? `${trimmedText}...` : trimmedText;
    };

    return (
        <>
            <ModalSubMenuNoteActions
                note={note}
                setModalVisible={setModalSubMenuNoteVisible}
                modalVisible={modalSubMenuNoteVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
            />
            <ModalNote
                actionType={"modify"}
                isVisible={modalNote}
                setVisible={setModaleNote}
                note={note}
                onModify={onModify}
            />
            <TouchableOpacity style={styles.card} onPress={() => setFocus(!focus)}>
                <View style={styles.header}>
                    <Text style={styles.textFontBold}>{note.titre}</Text>
                    <View style={styles.icons}>
                        {focus ? (
                            <Ionicons name='chevron-up-circle' size={20} color={variables.aubere} />
                        ) : (
                            <Ionicons name='chevron-down-circle' size={20} color={variables.bai} />
                        )}
                        <TouchableOpacity onPress={onPressOptions}>
                            <Entypo name='dots-three-horizontal' size={20} color={focus ? variables.aubere : variables.bai} style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    {focus ? (
                        // Affiche le contenu HTML complet lorsque focus est activé
                        <HTMLView
                            value={note.note} // HTML complet
                            stylesheet={htmlStyles}
                        />
                    ) : (
                        // Affiche un aperçu limité à 33 caractères, mais avec HTML interprété
                        <HTMLView
                            value={getPreviewHTML(note.note, 33)}
                            stylesheet={htmlStyles}
                        />
                    )}
                </View>
            </TouchableOpacity>
        </>
    );
};

const htmlStyles = StyleSheet.create({
    p: {
        fontSize: 14,
        color: '#333',
    },
    a: {
        fontWeight: 'bold',
        color: '#00f',
    },
});

const styles = StyleSheet.create({
    card: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: 10,
        shadowColor: "black",
        shadowOpacity: 0.1,
        elevation: 1,
        shadowOffset: { width: 0, height: 1 },
        padding: 5
    },
    header: {
        flexDirection: "row",
        backgroundColor: variables.rouan,
        padding: 10,
        justifyContent: "space-between",
        borderTopEndRadius: 5,
        borderTopStartRadius: 5
    },
    icons: {
        flexDirection: "row"
    },
    content: {
        flexDirection: "row",
        backgroundColor: variables.blanc,
        padding: 5,
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5
    },
    textFontBold: {
        fontFamily: variables.fontBold
    }
});

export default NoteCard;
