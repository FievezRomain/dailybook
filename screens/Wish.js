import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext, useState, useEffect } from 'react';
import Back from "../components/Back";
import ButtonLong from "../components/ButtonLong";
import Variables from "../components/styles/Variables";
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import LogoutModal from "../components/Modals/ModalLogout";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native";
import TopTabSecondary from "../components/TopTabSecondary";
import WishService from "../services/WishService";
import { getImagePath } from '../services/Config';
import MasonryList from 'react-native-masonry-list';

const WishScreen = ({ navigation }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [wishs, setWishs] = useState([]);
    const [loading, setLoading] = useState(false);
    const wishService = new WishService();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
          
          getWishs();
          
        });
        return unsubscribe;
    }, [navigation]);

    const getWishs = async () => {
        setLoading(true);
        var result = await wishService.getWishs(user.id);
        setLoading(false);
        if(result.length != 0){
            setWishs(result.rows);
        }
        
    }

    return(
        <>
            <View style={styles.contentContainer}>
                {loading && (
                    <View style={styles.loading}>
                        <Image
                        style={styles.loader}
                        source={require("../assets/loader.gif")}
                        />
                    </View>
                )}
                <TopTabSecondary
                    message1={"Vos"}
                    message2={"souhaits"}
                />
                <View style={styles.container}>
                    <MasonryList
                        images={wishs.map(item => item.image)}
                        customImageComponent={({ imageUri }) => (
                          <Image source={{uri: `${getImagePath()}${imageUri.image}`}} style={styles.image} />
                        )}
                        onPressImage={image => console.log('Image pressée:', image)}
                    />
                </View>
            </View>
            
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
        paddingHorizontal: 10,
        paddingTop: 20,
      },
      image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
      },
      contentContainer:{
        backgroundColor: Variables.default
      },
});

module.exports = WishScreen;