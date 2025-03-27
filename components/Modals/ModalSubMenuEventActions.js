import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import { FontAwesome6, Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";

const ModalSubMenuEventActions = ({ modalVisible, setModalVisible, event, handleModify, handleDelete, handleDeleteAll, handleShare }) => {
    const { colors, fonts } = useTheme();
    const onAction = (event) =>{
        setModalVisible(false);
        event();
    }

    const styles = StyleSheet.create({
        textActionButton:{
            marginLeft: 15
        },
        informationsActionButton:{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10
        },
        bottomBar: {
            width: '100%',
            height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.text,
        },
        actionButtonContainer:{
            width: "90%",
            borderRadius: 10,
            marginTop: 15,
            backgroundColor: colors.quaternary,
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginBottom: 15
        },
        actionButton:{
            padding: 15,
        },
        card: {
            justifyContent: "space-evenly",
            alignItems: "center"
            //flexDirection: "row wrap"
        },
        background: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: "flex-end",
            height: "100%",
        },
        emptyBackground: {
            height: "80%",
        },
        buttonContainer:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 35,
            marginBottom: 20
        },
        itemContainer:{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 20,
            justifyContent: "center"
        },
        item:{
            backgroundColor: colors.default_dark,
            borderRadius: 5,
            margin: 5,
            padding: 10,
        },
        selected:{
            backgroundColor: colors.default_dark,
        },
        title:{
            color: colors.default_dark,
        },
        disabledButton:{
            backgroundColor: colors.secondary,
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
        },
        disabledText:{
            color: colors.quaternary
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily,
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return (
        <>
        <ModalEditGeneric
            isVisible={modalVisible}
            setVisible={setModalVisible}
            arrayHeight={((event.eventtype === "soins" || event.eventtype === "balade") && event.idparent !== null && event.idparent !== undefined) ? ["35%"] : ["30%"]}
        >
                <View style={styles.card}>
                    <Text style={[styles.textFontRegular, {color:colors.default_dark}]}>Gérer l'événement</Text>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity style={[styles.actionButton, styles.disabledButton]}>
                            <View style={styles.informationsActionButton}>
                                <Feather name="share-2" size={20} style={styles.disabledText}/>
                                <Text style={[styles.textActionButton, styles.disabledText, styles.textFontMedium]}>
                                    Partager (bientôt disponible)
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <Divider style={{height: 1}}/>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
                            <View style={styles.informationsActionButton}>
                                <SimpleLineIcons name="pencil" size={20}/>
                                <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                    Modifier
                                </Text>
                            </View>
                        </TouchableOpacity>
                        { ((event.eventtype !== "soins" && event.eventtype !== "balade") || 
                            ((event.eventtype === "soins" || event.eventtype === "balade") && event.idparent !== null && event.idparent !== undefined)) &&
                            <>
                                <Divider style={{height: 1}}/>
                                <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
                                    <View style={styles.informationsActionButton}>
                                        <AntDesign name="delete" size={20}/>
                                        <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                            Supprimer
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        }
                        {(event.eventtype === "soins" || event.eventtype === "balade") && 
                            <>
                                <Divider style={{height: 1}}/>
                                <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDeleteAll)}>
                                    <View style={styles.informationsActionButton}>
                                        <AntDesign name="delete" size={20}/>
                                        <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                            Supprimer les {event.eventtype === "balade" ? "balades" : "soins"} {event.nom !== null && event.nom !== undefined && event.nom.substring(0, 15)}{event.nom !== null && event.nom !== undefined && event.nom.length > 15 && "..."}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </View>
        </ModalEditGeneric>
        </>
    );
};

export default ModalSubMenuEventActions;
