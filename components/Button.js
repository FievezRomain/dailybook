import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useTheme } from 'react-native-paper';

const Button = ({ children, type, size, optionalStyle, disabled, onPress, isUppercase=true, isLong=false }) => {
    const { colors, fonts } = useTheme();
  
    let backgroundColor = colors.neutral;
    let color = colors.background;
    let paddingLeft = 5;
    let paddingRight = 5;
    let paddingBottom = 10;
    let paddingTop = 10;
    let fontSize = 12;
    let textTransform = "uppercase";
  
    if (type === "primary") {
      backgroundColor = colors.neutral
      color = colors.background;
    } else if (type === "secondary") {
      backgroundColor = colors.secondary;
      color = colors.neutral
    } else if (type === "tertiary") {
      backgroundColor = colors.tertiary;
      color = colors.background;
    } else if (type === "quaternary"){
      backgroundColor = colors.accent;
      color = colors.background;
    } else if (type === "quinary"){
      backgroundColor = colors.background;
      color = colors.default_dark;
    }

    if(disabled === true){
      backgroundColor = colors.quaternary
      color = colors.neutral
    }

    if(size === "m"){
      paddingLeft = 15;
      paddingRight = 15;
      paddingBottom = 12;
      paddingTop = 12;
      fontSize = 14;
    } else if(size === "l"){
      paddingLeft = 40;
      paddingRight = 40;
      paddingBottom = 15;
      paddingTop = 15;
      fontSize = 16;
    } else if(size === "s"){
      paddingLeft = 5;
      paddingRight = 5;
      paddingBottom = 10;
      paddingTop = 10;
      fontSize = 12;
    }

    if(!isUppercase){
      textTransform = "none";
    }

    if(isLong){
      paddingLeft = 40;
      paddingRight = 40;
    }
  
    const styles = StyleSheet.create({
      button: {
        backgroundColor: backgroundColor,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        paddingTop: paddingTop,
        borderRadius: 15,
        optionalStyle
      },
      buttonText: {
        color: color,
        textAlign: "center",
        fontSize: fontSize,
        textTransform: textTransform
      },
    });
  
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{children}</Text>
      </TouchableOpacity>
    );
  };
  
  export default Button;
  