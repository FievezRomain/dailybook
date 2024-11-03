import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const Back = ({isWithBackground=false}) => {
    const { colors, fonts } = useTheme();
    
    const styles = StyleSheet.create({
        backButton:{
            marginLeft: 20
        }
    });

    const navigation = useNavigation();

    return(
        <TouchableOpacity onPress={() => navigation.goBack()}>
            {isWithBackground ?
                <View style={[{backgroundColor: colors.accent, borderRadius: 30, width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}, styles.backButton]}>
                    <Ionicons name="chevron-back" size={30} color={colors.background} />
                </View>
            :
                <Ionicons name="chevron-back" style={styles.backButton} size={30} color={colors.accent} />
            }
        </TouchableOpacity>
    );
}

export default Back;