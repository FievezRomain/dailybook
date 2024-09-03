import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import Variables from "../styles/Variables";
import { FontAwesome6, Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';

const ModalSubMenuContactActions = ({ modalVisible, setModalVisible, contact, handleModify, handleDelete }) => {

    const onAction = (event) =>{
        setModalVisible(false);
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
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.textFontRegular}>Gérer le contact</Text>
                        {contact !== null &&
                            <Text style={[{fontSize: 12}, styles.textFontBold]}>{contact.nom}</Text>
                        }
                    </View>
                    
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
                            <View style={styles.informationsActionButton}>
                                <SimpleLineIcons name="pencil" size={20}/>
                                <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                    Modifier
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.bottomBar} />
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
                            <View style={styles.informationsActionButton}>
                                <AntDesign name="delete" size={20}/>
                                <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                    Supprimer
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
};

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
        backgroundColor: Variables.souris,
    },
    actionButtonContainer:{
        width: "90%",
        borderRadius: 10,
        backgroundColor: Variables.rouan,
        flexDirection: "column",
        justifyContent: "space-evenly",
        marginBottom: 15
    },
    actionButton:{
        padding: 20,
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
        backgroundColor: Variables.alezan,
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
    disabledButton:{
        backgroundColor: Variables.pinterest,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },
    disabledText:{
        color: Variables.rouan
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

export default ModalSubMenuContactActions;
