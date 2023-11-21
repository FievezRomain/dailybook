import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";

const Button = ({ children, type, size, optionalStyle, onPress }) => {
    let backgroundColor = Variables.isabelle;
    let color = Variables.blanc;
    let paddingLeft = 5;
    let paddingRight = 5;
    let paddingBottom = 10;
    let paddingTop = 10;
    let fontSize = 12;
  
    if (type === "primary") {
      backgroundColor = Variables.isabelle
      color = Variables.blanc;
    } else if (type === "secondary") {
      backgroundColor = Variables.aubere;
      color = Variables.isabelle
    } else if (type === "tertiary") {
      backgroundColor = Variables.alezan
      color = Variables.blanc;
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
        textTransform: "uppercase"
      },
    });
  
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{children}</Text>
      </TouchableOpacity>
    );
  };
  
  export default Button;
  