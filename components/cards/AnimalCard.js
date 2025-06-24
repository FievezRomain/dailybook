import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, useTheme } from "react-native-paper";
import FileStorageService from "../../services/aws/FileStorageService";
import { useAuth } from "../../contexts/AuthenticatedUserProvider";
import { useGroupForm } from "../../hooks/useGroupForm";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import ModalValidation from "../modals/common/ModalValidation";

const AnimalCard = ({ animal, animalState, userRole, group }) => {
    const { colors, fonts } = useTheme();
    const fileStorageService = new FileStorageService();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [ modalValidationVisible, setModalValidationVisible ] = useState(false);

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

    const getGlobalCurrantAnimalByAnimalGroup = ( animal ) => {
        let index = animaux.findIndex(objet => objet.id === animal.id);

        if( index !== -1 ) return animaux[index];
        
        return {};
    }
    const currentAnimal = getGlobalCurrantAnimalByAnimalGroup( animal );

    useEffect(() => {
        setValue("animaux", [currentAnimal.id]);
    }, [currentAnimal]);
    
    const acceptAnimal = async (data) => {
        data.status = 'accepted';
        data.id = group.id;
        submitGroup(data, "respondAnimal");
    }

    const refuseAnimal = async (data) => {
        data.status = 'declined';
        data.id = group.id;
        submitGroup(data, "respondAnimal");
    }

    const getActionsPart = () => {
        if( loading ){
            return <ActivityIndicator animating={true} size="large" />
        }
        if( animalState === "pending" ){
            return(
                <>
                    <TouchableOpacity style={{marginRight: 20}} onPress={handleSubmit(refuseAnimal)}>
                        <Icon source={"close"} size={30} color={colors.error} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit(acceptAnimal)}>
                        <Icon source={"check"} size={30} color={colors.accent} />
                    </TouchableOpacity>
                </>
            );
        }
        if( animalState === "accepted" && (userRole === "manager" || currentAnimal.provenance === "owner") ){
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
            paddingHorizontal: 10
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
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        avatar: {
            width: 60,
            height: 60,
            borderRadius: 50,
            zIndex: 1,
            justifyContent: "center",
            borderWidth: 0.1,
        },
        containerAvatarWithoutImage:{
            height: 65, 
            width: 65, 
            borderRadius: 50, 
            justifyContent: "center", 
            alignItems: "center",
            shadowColor: colors.default_dark,
            shadowOpacity: 0.1,
            elevation: 1, 
            shadowOffset: {width: 0,height: 1},
        },
        containerAvatarWithImage:{
            width: 65, 
            height: 65, 
            borderRadius: 50, 
            alignItems: "center", 
            justifyContent: "center",
            shadowColor: colors.default_dark,
            shadowOpacity: 0.1,
            elevation: 1, 
            shadowOffset: {width: 0,height: 1},
        },
        avatarText: {
            textAlign: "center", 
            color: colors.background, 
            fontSize: 30
        },
        informationsAnimal:{
            marginLeft: 10
        },
        infoText:{
            color: colors.default_dark
        }
    });

    return(
        <>
            <ModalValidation
                displayedText={`Êtes-vous sûr de vouloir retirer ${animal.nom} du groupe ?`}
                title={"Retrait d'un animal"}
                onConfirm={handleSubmit(refuseAnimal)}
                setVisible={setModalValidationVisible}
                visible={modalValidationVisible}
            />
            <View style={styles.card}>
                <View style={styles.contentCard}>
                    <View style={styles.itemsContainer}>
                        { currentAnimal.image !== null ? 
                                <View style={[styles.containerAvatarWithImage]}>
                                    <Image style={[styles.avatar]} source={{uri:  fileStorageService.getFileUrl( currentAnimal.image, currentUser.uid ) }} cachePolicy="disk" />
                                </View>
                            :
                                <View style={[styles.containerAvatarWithoutImage]}>
                                    <View style={[styles.avatar, {backgroundColor: colors.quaternary}]}>
                                        <Text style={[styles.avatarText, styles.textFontRegular]}>{currentAnimal.nom[0]}</Text>
                                    </View>
                                </View>
                        }
                        <View style={styles.informationsAnimal}>
                            <Text style={[styles.textFontBold, styles.infoText]}>{currentAnimal.nom}</Text>
                            <Text style={[styles.textFontRegular, styles.infoText]}>{currentAnimal.espece}</Text>
                            {currentAnimal.datenaissance && 
                                <Text style={[styles.textFontRegular, styles.infoText]}>{currentAnimal.datenaissance}</Text>
                            }
                        </View>
                    </View>
                    
                    <View style={styles.itemsContainer}>
                        {getActionsPart()}
                    </View>
                </View>
            </View>
        </>
    );
}

export default AnimalCard;