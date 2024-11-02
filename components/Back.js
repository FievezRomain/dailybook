import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';
import variables from "./styles/Variables";

const Back = ({isWithBackground=false}) => {
    const styles = StyleSheet.create({
        backButton:{
            marginLeft: 20
        }
    });

    const navigation = useNavigation();

    return(
        <TouchableOpacity onPress={() => navigation.goBack()}>
            {isWithBackground ?
                <View style={[{backgroundColor: variables.bai, borderRadius: 30, width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}, styles.backButton]}>
                    <Ionicons name="chevron-back" size={30} color={variables.blanc} />
                </View>
            :
                <Ionicons name="chevron-back" style={styles.backButton} size={30} color={variables.bai} />
            }
        </TouchableOpacity>
    );
}

export default Back;