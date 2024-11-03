import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const ModalDefaultNoValue = ({ text })=> {
    const { colors, fonts } = useTheme();
    
    return(
        <View style={{backgroundColor: colors.background, width: "100%", padding: 20, borderRadius: 5, shadowColor: "black", shadowOpacity: 0.1, elevation: 1, shadowOffset: {width: 0,height: 1},}}>
            <Text style={{fontFamily: fonts.default.fontFamily}}>{text}</Text>
        </View>
    )

}

export default ModalDefaultNoValue;