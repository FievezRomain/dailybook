import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, useTheme } from "react-native-paper";
import { useAuth } from "../../contexts/AuthenticatedUserProvider";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useGroupForm } from "../../hooks/useGroupForm";
import { useState } from "react";
import ModalValidation from "../modals/common/ModalValidation";
import { useNavigation } from "@react-navigation/native";

const MemberCard = ({ member, memberState, userRole, group }) => {
    const { colors } = useTheme();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [ modalValidationVisible, setModalValidationVisible ] = useState(false);
    const navigation = useNavigation();

    const onModify = () => {
        Toast.show({
            type: "success",
            position: "top",
            text1: "Modification du groupe"
        });
    }

    const { submitGroup, animaux, loading } = useGroupForm(
        setValue,
        onModify,
        () => {} 
    );

    const refuseMember = async (data) => {
        data.status = 'declined';
        data.id = group.id;
        data.email = member.email;
        submitGroup(data, "respondMember");
    }

    const deleteMember = async (data) => {
        data.id = group.id;
        data.email = member.email;

        setModalValidationVisible(false);

        if( member.email === currentUser.email ){
            navigation.navigate("Autre");
        }

        submitGroup(data, "deleteMember");
    }

    const getActionsPart = () => {
        if( loading ){
            return <ActivityIndicator animating={true} size="large" />
        }

        if( memberState === "pending" && (userRole === "manager" && member.email !== currentUser.email) ){
            return(
                <>
                    <TouchableOpacity onPress={handleSubmit(refuseMember)}>
                        <Icon source={"close"} size={30} color={colors.error} />
                    </TouchableOpacity>
                </>
            );
        }
        if( memberState === "accepted" && ((userRole !== "manager" && member.email === currentUser.email) || (userRole === "manager" && member.email !== currentUser.email)) ){
            return(
                <>
                    <TouchableOpacity onPress={() => { setModalValidationVisible(true) }}>
                        <Icon source={"exit-to-app"} size={30} color={colors.error} />
                    </TouchableOpacity>
                </>
            );
        }
    }

    const styles = StyleSheet.create({
        card:{
            backgroundColor: colors.background,
            marginBottom: 10,
            borderRadius: 5,
            shadowColor: colors.default_dark,
            shadowOpacity: 0.1,
            elevation: 1, 
            shadowOffset: {width: 0,height: 1},
            paddingHorizontal: 10,
            paddingVertical: 10
        },
        contentCard:{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        itemsContainer:{
            flexDirection: "row",
            alignItems: "center"
        },
    });

    return(
        <>
            <ModalValidation
                displayedText={`Êtes-vous sûr de vouloir retirer ${member.email} du groupe ?`}
                title={"Retrait d'un membre"}
                onConfirm={handleSubmit(deleteMember)}
                setVisible={setModalValidationVisible}
                visible={modalValidationVisible}
            />
            <View style={styles.card}>
                <View style={styles.contentCard}>
                    <View style={styles.itemsContainer}>
                        <Text>{member.email}</Text>
                    </View>
                    <View style={styles.itemsContainer}>
                        {getActionsPart()}
                    </View>
                </View>
            </View>
        </>
    );
}

export default MemberCard;