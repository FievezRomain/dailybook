import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";

const ButtonLong = ({ children, type, onPress }) => {
    let backgroundColor = "white";
    let color = "black";
  
    if (type === "primary") {
      backgroundColor = Variables.green_primary;
      color = "black";
    } else if (type === "secondary") {
      backgroundColor = "white";
      color = Variables.green_secondary;
    } else if (type === "disconnect") {
      backgroundColor = Variables.bouton_secondary;
      color = "white";
    }
  
    const styles = StyleSheet.create({
      button: {
        backgroundColor: backgroundColor,
        width: 200,
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 5,
        marginBottom: 5
      },
      buttonText: {
        color: color,
        textAlign: "center",
        fontSize: 14,
        textTransform: "uppercase"
      },
    });
  
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{children}</Text>
      </TouchableOpacity>
    );
  };
  
  export default ButtonLong;
  