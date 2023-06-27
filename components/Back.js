import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Back = () => {
    const styles = StyleSheet.create({
        backButton:{
            height: 25,
            width: 25,
            marginTop: 30,
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