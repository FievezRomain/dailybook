import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';
import variables from "./styles/Variables";

const Back = () => {
    const styles = StyleSheet.create({
        backButton:{
            marginLeft: 20
        }
    });

    const navigation = useNavigation();

    return(
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" style={styles.backButton} size={30} color={variables.alezan} />
        </TouchableOpacity>
    );
}

export default Back;