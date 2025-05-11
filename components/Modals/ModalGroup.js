import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";
import { useGroupForm } from "../../hooks/useGroupForm";
import ModalAnimals from "./ModalSelectAnimals";
import Button from "../Button";
import { AntDesign } from '@expo/vector-icons';

const ModalGroup = ({ isVisible, setVisible, actionType, group = {}, onModify = undefined }) => {
    const { colors, fonts } = useTheme();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

    const closeModal = () => {
        setVisible(false);
    };

    const { initializeGroup, resetGroupValues, submitGroup,
        animaux, selected, setSelected, modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible,
        members, addMember, updateMembers, removeMember,
        loading } = useGroupForm(
        setValue,
        onModify,
        closeModal
    );

    useEffect(() => {
        if (group) {
            initializeGroup(group);
        }
    }, [isVisible]);

    const submitRegister = async(data) =>{
        submitGroup(data, actionType);
    }

    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: "100%",
            justifyContent: "flex-end",
        },
        form: {
            width: "100%",
            paddingBottom: 40,
            flex: 1
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
        containerAnimaux: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 10
        },
        badgeAnimal: {
            padding: 10,
        },
        containerBadgeAnimal: {
            borderRadius: 5,
            backgroundColor: colors.quaternary,
            marginRight: 5,
            marginBottom: 5
        },
        inputMember: {
            height: 40,
            width: "95%",
            borderRadius: 5,
            paddingLeft: 15,
            backgroundColor: colors.quaternary,
            color: colors.default_dark,
            marginRight: 10
        },
        membersContainer: {
            display: "flex",
            flexDirection: "row",
            marginBottom: 15,
            width: "100%",
            alignItems: "center"
        },
});

    return (
        <ModalEditGeneric
            isVisible={isVisible}
            setVisible={setVisible}
            arrayHeight={["90%"]}
            scrollInside={false}
        >
            <ModalAnimals
                valueName={"animaux"}
                setValue={setValue}
                animaux={animaux}
                selected={selected}
                setSelected={setSelected}
                modalVisible={modalSelectAnimalsIsVisible}
                setModalVisible={setModalSelectAnimalsIsVisible}
            />
            <View style={styles.form}>
                <View style={styles.containerActionsButtons}>
                    <TouchableOpacity onPress={closeModal} style={{width:"33.33%", alignItems: "center"}}>
                        <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
                    </TouchableOpacity>
                    <View style={{width:"33.33%", alignItems: "center"}}>
                        <Text style={[styles.textFontBold, {fontSize: 16, color:colors.default_dark}]}>
                            Groupe
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
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    extraScrollHeight={10}
                    enableResetScrollToCoords={false}
                >
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.textInput, styles.textFontRegular]}>
                                Nom : <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            {errors.title && <Text style={[styles.errorInput, styles.textFontRegular]}>Nom obligatoire</Text>}
                            <TextInput
                                style={[styles.input, styles.textFontRegular]}
                                placeholder="Exemple : Groupe"
                                placeholderTextColor={colors.secondary}
                                onChangeText={(text) => setValue("name", text)}
                                defaultValue={watch("name")}
                                {...register("name", { required: true })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.textInput, styles.textFontRegular]}>Animaux :</Text>
                            <TouchableOpacity 
                                style={styles.textInput}
                                disabled={animaux.length > 0 ? false : true || actionType !== "create"}
                                onPress={()=>{ Keyboard.dismiss(); setModalSelectAnimalsIsVisible(true)}}
                            >
                                <View style={styles.containerAnimaux}>
                                    {selected.length == 0 && animaux.length > 0 &&
                                        <View style={[styles.containerBadgeAnimal, {width: "100%"}]}><Text style={[styles.badgeAnimal, styles.textFontRegular, {color: colors.secondary}]}>Sélectionner un ou plusieurs animaux</Text></View>
                                    }
                                    {selected.map((animal, index) => {
                                        return (
                                            <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{animal.nom}</Text></View>
                                        );
                                    })}
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.inputContainer]}>
                            <Text style={[styles.textInput, styles.textFontRegular]}>Membres : <Text style={{color: "red"}}>*</Text></Text>
                            {members.map((value, index) => (
                                <View style={styles.membersContainer} key={index}>
                                    <TextInput
                                        style={[styles.inputMember, styles.textFontRegular]}
                                        defaultValue={value}
                                        onChangeText={(text) => updateMembers(index, text)}
                                        placeholder="Entrez une adresse e-mail"
                                        placeholderTextColor={colors.secondary}
                                        editable={actionType !== "create"}
                                    />
                                    <TouchableOpacity onPress={() => removeMember(index)}>
                                        <AntDesign name="delete" size={20} color={colors.default_dark}/>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <Button
                                onPress={addMember}
                                type={"primary"}
                                size={"s"}
                                isLong={true}
                                disabled={actionType !== "create"}
                            >
                                <Text style={styles.textFontMedium}>Ajouter un membre</Text>
                            </Button>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </ModalEditGeneric>
    );
}

export default ModalGroup;
