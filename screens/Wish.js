import { View, Text, StyleSheet, FlatList, Dimensions, Linking } from "react-native";
import React, { useContext, useState, useEffect } from 'react';
import Variables from "../components/styles/Variables";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import TopTabSecondary from "../components/TopTabSecondary";
import WishService from "../services/WishService";
import { Image } from "expo-image";
import ModalSubMenuWishActions from "../components/Modals/ModalSubMenuWishActions";
import Toast from "react-native-toast-message";
import ModalWish from "../components/Modals/ModalWish";
import { MaterialIcons } from "@expo/vector-icons";
import LoggerService from "../services/LoggerService";
import FileStorageService from "../services/FileStorageService";
import ModalDefaultNoValue from "../components/Modals/ModalDefaultNoValue";

const WishScreen = ({ navigation }) => {
    const { currentUser } = useAuth();
    const [wishs, setWishs] = useState([]);
    const [selectedWish, setSelectedWish] = useState(null);
    const wishService = new WishService();
    const [modalSubMenuWishVisible, setModalSubMenuWishVisible] = useState(false);
    const [modalWishVisible, setModalWishVisible] = useState(false);
    const fileStorageService = new FileStorageService();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
          
          getWishs();
          
        });
        return unsubscribe;
    }, [navigation]);

    const getWishs = async () => {
        var result = await wishService.getWishs(currentUser.email);
        if(result.length != 0){
            setWishs(result);
        }
    }

    const handleModify = () => {
        setModalWishVisible(true);
    };

    const onModify = (wish) => {
        Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un souhait réussi"
        });
        var indice = wishs.findIndex((a) => a.id == selectedWish.id);
        wishs[indice] = wish;

        setWishs(wishs);
        setSelectedWish(wish);
    };

    const handleRedirect = () => {
        Linking.openURL(selectedWish.url);
    };

    const handleDelete = () => {

        let data = {};
        data["id"] = selectedWish.id;
        wishService.delete(data)
            .then((response) =>{

                var filteredArray = wishs.filter((item) => item.id != selectedWish.id);
                setWishs(filteredArray);
                setSelectedWish(null);

                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'un souhait réussi"
                });
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la suppression d'un wish : " + err.message );
            });
    };
    const handleShare = () => {

    };

    const openSubMenuWish = (wish) => {
        setSelectedWish(wish);
        setModalSubMenuWishVisible(true)
    };
    return(
        <>
                <TopTabSecondary
                    message1={"Vos"}
                    message2={"souhaits"}
                />
                <ModalSubMenuWishActions
                    modalVisible={modalSubMenuWishVisible}
                    setModalVisible={setModalSubMenuWishVisible}
                    wish={selectedWish}
                    handleRedirect={handleRedirect}
                    handleModify={handleModify}
                    handleDelete={handleDelete}
                    handleShare={handleShare}
                />
                <ModalWish
                    actionType={"modify"}
                    isVisible={modalWishVisible}
                    setVisible={setModalWishVisible}
                    wish={selectedWish}
                    onModify={onModify}
                />
                <View style={styles.container}>
                    {wishs.length === 0 ?
                        <View style={{paddingLeft: 20, paddingRight: 20}}>
                            <ModalDefaultNoValue
                                text={"Aucun souhait enregistré"}
                            />
                        </View>
                        
                    :    
                        <FlatList
                            data={wishs}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={[styles.itemContainer, index % 2 !== 0 && styles.itemContainerSecondColumn]} onPress={() => openSubMenuWish(item)}>
                                    {item.image !== null && item.image !== undefined &&
                                        <Image source={{uri: fileStorageService.getFileUrl( item.image, currentUser.uid )}} style={styles.image} cachePolicy="disk" />
                                    }
                                    {(item.image === null || item.image === undefined) &&
                                        <View style={[{backgroundColor: Variables.rouan, alignItems: "center", justifyContent: "center"}, styles.image]}>
                                            <MaterialIcons name="no-photography" size={50} />
                                        </View>
                                    }
                                    {item.prix !== null && item.prix !== undefined &&
                                        <View style={styles.labelContainer}>
                                            <Entypo name="price-tag" size={16} color={Variables.bai} /> 
                                            <Text style={[styles.price, styles.textFontRegular]}>{item.prix} €</Text> 
                                        </View>
                                    }
                                    <Text style={[styles.title, styles.textFontBold]}>{item.nom}</Text>
                                    <Text style={styles.textFontRegular}>{item.destinataire}</Text>
                                </TouchableOpacity>
                            )}
                            numColumns={2}
                        />
                    }
                </View>
                <Text>  </Text>
            
        </>
    )

}

const styles = StyleSheet.create({
    loader: {
        width: 200,
        height: 200
      },
    loading: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000b8",
        paddingTop: 50
    },
    container: {
        flex: 1,
        backgroundColor: Variables.default,
    },
    itemContainer: {
        flex: 1,
        margin: 5,
    },
    itemContainerSecondColumn: {
        marginTop: Dimensions.get('window').width * 0.05,
    },
    image: {
        width: '100%',
        aspectRatio: 1, // Garantit que les images conservent leur ratio original
        borderRadius: 10,
    },
    title: {
        fontSize: 12,
        color: Variables.bai,
        marginTop: 5,
    },
    labelContainer: {
        position: 'absolute',
        top: 10, 
        left: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        zIndex: 1, 
    },
    price: {
        marginLeft: 5,
        color: Variables.bai,
        fontSize: 12
    },
    textFontRegular:{
        fontFamily: Variables.fontRegular
    },
    textFontBold:{
        fontFamily: Variables.fontBold
    }
});

module.exports = WishScreen;