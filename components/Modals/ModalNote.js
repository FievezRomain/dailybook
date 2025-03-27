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
import Toast from "react-native-toast-message";
import notesServiceInstance from "../../services/NoteService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import RichTextEditor from "../RichTextEditor";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import sanitizeHtml from 'sanitize-html';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";

const ModalNote = ({ isVisible, setVisible, actionType, note = {}, onModify = undefined }) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
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
            notesServiceInstance.update(data)
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
        } else {
            notesServiceInstance.create(data)
                .then((reponse) => {
                    resetValues();
                    closeModal();
                    onModify();
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

    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: "100%",
            justifyContent: "flex-end",
        },
        form: {
            width: "100%",
            paddingBottom: 40
        },
        toastContainer: {
            zIndex: 9999,
        },
        containerActionsButtons: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingBottom: 15,
            paddingTop: 5
        },
        bottomBar: {
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            height: 0.3,
            backgroundColor: colors.text,
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
            backgroundColor: colors.quaternary,
            color: "black",
        },
        inputContainer: {
            alignItems: "center",
            width: "100%",
        },
        textInput: {
            alignSelf: "flex-start",
            marginBottom: 5,
            color : colors.default_dark
        },
        textFontRegular: {
            fontFamily: fonts.default.fontFamily,
        },
        textFontBold: {
            fontFamily: fonts.bodyLarge.fontFamily,
        },
    });

    return (
        <ModalEditGeneric
            isVisible={isVisible}
            setVisible={setVisible}
            arrayHeight={["90%"]}
        >
            {/* Detect taps outside the input fields */}
            <TouchableWithoutFeedback onPress={dismissRichTextKeyboard} accessible={false}>
                <View style={styles.form}>
                    <View style={styles.containerActionsButtons}>
                        <TouchableOpacity onPress={closeModal} style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
                        </TouchableOpacity>
                        <View style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[styles.textFontBold, {fontSize: 16, color:colors.default_dark}]}>
                                {actionType === "modify" ? "Note" : "Note"}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{width:"33.33%", alignItems: "center"}}>
                            {loading ? (
                                <ActivityIndicator size={10} color={colors.default_dark} />
                            ) : (
                                <Text style={[{ color: colors.default_dark }, styles.textFontRegular]}>
                                    {actionType === "modify" ? "Modifier" : "Créer"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <KeyboardAwareScrollView style={{height: "100%"}}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>
                                    Titre : <Text style={{ color: "red" }}>*</Text>
                                </Text>
                                {errors.title && <Text style={[styles.errorInput, styles.textFontRegular]}>Titre obligatoire</Text>}
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : Titre"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("titre", text)}
                                    defaultValue={watch("titre")}
                                    {...register("titre", { required: true })}
                                />
                                <RichTextEditor
                                    ref={richText}  // Assign the ref to RichTextEditor
                                    defaultValue={watch("note") !== undefined ? watch("note") : undefined}
                                    onChange={(text) => setRichTextValue(text)}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </TouchableWithoutFeedback>
        </ModalEditGeneric>
    );
}

export default ModalNote;
