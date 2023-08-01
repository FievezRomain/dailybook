import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';

const Back = () => {
    const styles = StyleSheet.create({
        backButton:{
            height: 25,
            width: 25,
            marginTop: Constants.statusBarHeight + 10,
            marginLeft: 20
        }
    });

    const navigation = useNavigation();

    return(
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.backButton} source={require("../assets/back.png")}/>
        </TouchableOpacity>
    );
}

export default Back;