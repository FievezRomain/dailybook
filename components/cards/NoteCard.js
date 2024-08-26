import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import variables from '../styles/Variables';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ModalSubMenuNoteActions from '../Modals/ModalSubMenuNoteActions';
import ModalNote from "../Modals/ModalNote";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import NoteService from '../../services/NoteService';
import LoggerService from '../../services/LoggerService';

const NoteCard = ({note, handleNoteChange, handleNoteDelete}) =>{

    const [focus, setFocus] = useState(false);
    const [modalSubMenuNoteVisible, setModalSubMenuNoteVisible] = useState(false);
    const [modalNote, setModaleNote] = useState(false);
    const noteService = new NoteService();

    const getDisplayedText = (note) => {
        if( focus ){
            return note.note;
        }

        if( note.note.length > 33 ){
            return note.note.substring(0, 33) + "...";
        } else {
            return note.note;
        }
    }

    const handleDelete = () => {
        let data = {};
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["id"] = note.id;
        noteService.delete(data)
            .then((reponse) =>{

                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'une note réussie"
                });

                handleNoteDelete(note);

            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la suppression d'une note : " + err.message );
            });
    }

    const onPressOptions = () => {
        setModalSubMenuNoteVisible(true)
    }

    const handleModify = () => {
        setModaleNote(true);
    }

    const onModify = (noteModified) => {
        Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'une note réussie"
        });

        handleNoteChange(noteModified);
    }

    return(
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
            <TouchableOpacity style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 10, shadowColor: variables.bai, shadowOpacity: 0.3,shadowOffset: {width: 0,height: 1}, padding: 5}} onPress={() => setFocus(!focus)}>
                <View style={{flexDirection: "row", backgroundColor: variables.pinterest, padding: 10, justifyContent: "space-between", borderTopEndRadius: 5, borderTopStartRadius: 5}}>
                    <Text style={styles.textFontBold}>{note.titre}</Text>
                    <View style={{flexDirection: "row"}}>
                        {focus ? <Ionicons name='chevron-up-circle' size={20} color={variables.alezan} /> : <Ionicons name='chevron-down-circle' size={20} color={variables.aubere} />}
                        <TouchableOpacity onPress={() => onPressOptions()}>
                            <Entypo name='dots-three-horizontal' size={20} color={ focus ? variables.alezan : variables.aubere} style={{marginLeft: 10}} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection: "row", backgroundColor: variables.blanc, padding: 5, borderBottomEndRadius: 5, borderBottomStartRadius: 5}}>
                    <Text style={styles.textFontRegular}>{getDisplayedText(note)}</Text>
                </View>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    textFontRegular:{
        fontFamily: variables.fontRegular
    },
    textFontMedium:{
        fontFamily: variables.fontMedium
    },
    textFontBold:{
        fontFamily: variables.fontBold
    }
})

export default NoteCard;