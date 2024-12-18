import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import Variables from "../styles/Variables";
import { FontAwesome6, Octicons, SimpleLineIcons, Entypo } from '@expo/vector-icons';

const ModalSubMenuAvatarPickerActions = ({ modalVisible, setModalVisible, handleLibraryPick, handleCameraPick }) => {
    const onAction = (event) =>{
        event();
    }

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
        backgroundColor: Variables.bai_brun,
    },
    actionButtonContainer:{
        height: "60%",
        width: "90%",
        borderRadius: 5,
        backgroundColor: Variables.rouan,
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    actionButton:{
        padding: 10,
    },
    card: {
        backgroundColor: Variables.blanc,
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
        backgroundColor: Variables.bai,
        borderRadius: 5,
        margin: 5,
        padding: 10,
    },
    selected:{
        backgroundColor: Variables.bai,
    },
    title:{
        color: "white"
    },
    textFontRegular:{
        fontFamily: Variables.fontRegular
    },
    textFontMedium:{
        fontFamily: Variables.fontMedium
    },
    textFontBold:{
        fontFamily: Variables.fontBold
    }
});

export default ModalSubMenuAvatarPickerActions;