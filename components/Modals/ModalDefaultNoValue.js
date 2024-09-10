import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import variables from '../styles/Variables';

const ModalDefaultNoValue = ({ text })=> {

    return(
        <View style={{backgroundColor: variables.blanc, width: "100%", padding: 20, borderRadius: 5, shadowColor: "black", shadowOpacity: 0.1, shadowOffset: {width: 0,height: 1},}}>
            <Text style={{color: variables.fontRegular}}>{text}</Text>
        </View>
    )

}

export default ModalDefaultNoValue;