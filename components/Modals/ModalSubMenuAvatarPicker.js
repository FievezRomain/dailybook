import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import { FontAwesome6, Octicons, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const ModalSubMenuAvatarPickerActions = ({ modalVisible, setModalVisible, handleLibraryPick, handleCameraPick }) => {
    const { colors, fonts } = useTheme();
    const onAction = (event) =>{
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
            height: "60%",
            width: "90%",
            borderRadius: 5,
            backgroundColor: colors.quaternary,
            flexDirection: "column",
            justifyContent: "space-evenly"
        },
        actionButton:{
            padding: 10,
        },
        card: {
            backgroundColor: colors.background,
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            height: "30%",
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
            backgroundColor: colors.accent,
            borderRadius: 5,
            margin: 5,
            padding: 10,
        },
        selected:{
            backgroundColor: colors.accent,
        },
        title:{
            color: "white"
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <View style={styles.background}>
                <TouchableOpacity
                    style={styles.emptyBackground}
                    onPress={() => setModalVisible(false)}
                ></TouchableOpacity>
                <View style={styles.card}>
                    <Text style={styles.textFontRegular}>Mode de sélection d'image</Text>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleLibraryPick)}>
                            <View style={styles.informationsActionButton}>
                                <Entypo name="folder-images" size={20}/>
                                <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                    Choisir une photo de la librairie
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.bottomBar} />
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleCameraPick)}>
                            <View style={styles.informationsActionButton}>
                                <Entypo name="camera" size={20}/>
                                <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                    Prendre une photo
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
}

export default ModalSubMenuAvatarPickerActions;