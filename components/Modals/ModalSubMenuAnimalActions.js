import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import Variables from "../styles/Variables";
import { FontAwesome5, Octicons, SimpleLineIcons, AntDesign } from '@expo/vector-icons';

const ModalSubMenuAnimalActions = ({ modalVisible, setModalVisible, handleModify, handleDelete, handleManageBody }) => {

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
                    <Text>Gérer les informations</Text>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleManageBody)}>
                            <View style={styles.informationsActionButton}>
                                <Octicons name="history" size={20}/>
                                <Text style={styles.textActionButton}>
                                    Gestion de l'évolution du physique
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.bottomBar} />
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
                            <View style={styles.informationsActionButton}>
                                <SimpleLineIcons name="pencil" size={20}/>
                                <Text style={styles.textActionButton}>
                                    Modifier
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.bottomBar} />
                        <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
                            <View style={styles.informationsActionButton}>
                                <AntDesign name="delete" size={20}/>
                                <Text style={styles.textActionButton}>
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
});

export default ModalSubMenuAnimalActions;
