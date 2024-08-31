import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { useForm } from "react-hook-form";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Variables from "../styles/Variables";
import NoteService from "../../services/NoteService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import RichTextEditor from "../RichTextEditor";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import sanitizeHtml from 'sanitize-html';

const ModalNote = ({ isVisible, setVisible, actionType, note = {}, onModify = undefined }) => {
    const { currentUser } = useAuth();
    const noteService = new NoteService();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const richText = useRef();  // Reference to RichTextEditor
    const [richTextValue, setRichTextValue] = useState(undefined);

    useEffect(() => {
        if (isVisible) {
            initValuesEvent();
        }
    }, [isVisible]);

    const closeModal = () => {
        setVisible(false);
    };

    const initValuesEvent = () => {
        setValue("id", note.id);
        setValue("titre", note.titre);
        setValue("note", note.note);
        setRichTextValue(note.note !== null ? note.note : undefined);
    };

    const resetValues = () => {
        setValue("id", undefined);
        setValue("titre", undefined);
        setValue("note", undefined);
        setRichTextValue(undefined);
    };

    const submitRegister = async (data) => {
        if (loading) {
            return;
        }
        setLoading(true);
        
        data["email"] = currentUser.email;

        // Nettoyer le HTML avant de continuer
        data["note"] = await sanitizeHtml(richTextValue);
        
        if (actionType === "modify") {
            noteService.update(data)
                .then((reponse) => {
                    Toast.show({
                        type: "success",
                        position: "top",
                        text1: "Modification d'une note réussie"
                    });
                    resetValues();
                    closeModal();
                    onModify(reponse);
                    setLoading(false);
                })
                .catch((err) => {
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    setLoading(false);
                });
        } else {
            noteService.create(data)
                .then((reponse) => {
                    resetValues();
                    closeModal();
                    onModify(reponse);
                    setLoading(false);
                })
                .catch((err) => {
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    setLoading(false);
                });
        }
    };

    // Function to handle dismissing the keyboard inside the RichTextEditor
    const dismissRichTextKeyboard = () => {
        if (richText.current) {
            richText.current.dismissKeyboard(); // Custom method to dismiss the RichTextEditor keyboard
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}
        >
            {/* Detect taps outside the input fields */}
            <TouchableWithoutFeedback onPress={dismissRichTextKeyboard} accessible={false}>
                <View style={styles.modalContainer}>
                    <View style={styles.form}>
                        <View style={styles.toastContainer}>
                            <Toast />
                        </View>
                        <View style={styles.containerActionsButtons}>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={[{ color: Variables.aubere }, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                            <Text style={styles.textFontBold}>
                                {actionType === "modify" ? "Modifier une note" : "Créer une note"}
                            </Text>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                {loading ? (
                                    <ActivityIndicator size={10} color={Variables.bai} />
                                ) : (
                                    <Text style={[{ color: Variables.alezan }, styles.textFontRegular]}>
                                        {actionType === "modify" ? "Modifier" : "Créer"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAwareScrollView>
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>
                                        Titre : <Text style={{ color: "red" }}>*</Text>
                                    </Text>
                                    {errors.title && <Text style={[styles.errorInput, styles.textFontRegular]}>Titre obligatoire</Text>}
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Note1"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("titre", text)}
                                        defaultValue={watch("titre")}
                                        {...register("titre", { required: true })}
                                    />
                                    <RichTextEditor
                                        ref={richText}  // Assign the ref to RichTextEditor
                                        defaultValue={watch("note") !== undefined ? watch("note") : "Votre texte ici"}
                                        onChange={(text) => setRichTextValue(text)}
                                    />
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: "100%",
        justifyContent: "flex-end",
    },
    form: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        height: "90%",
        paddingBottom: 10,
        paddingTop: 10,
    },
    toastContainer: {
        zIndex: 9999,
    },
    containerActionsButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    bottomBar: {
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        height: 0.3,
        backgroundColor: Variables.souris,
    },
    formContainer: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        height: 40,
        width: "100%",
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: Variables.rouan,
        color: "black",
    },
    inputContainer: {
        alignItems: "center",
        width: "100%",
    },
    textInput: {
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    textFontRegular: {
        fontFamily: Variables.fontRegular,
    },
    textFontBold: {
        fontFamily: Variables.fontBold,
    },
});

export default ModalNote;
