import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";

const Button = ({ children, type, onPress }) => {
    let backgroundColor = "white";
    let color = "black";
  
    if (type === "primary") {
      backgroundColor = Variables.green_primary;
      color = "black";
    } else if (type === "secondary") {
      backgroundColor = "white";
      color = Variables.green_secondary;
    } else if (type === "disconnect") {
      backgroundColor = Variables.red;
      color = "white";
    }
  
    const styles = StyleSheet.create({
      button: {
        backgroundColor: backgroundColor,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 20,
      },
      buttonText: {
        color: color,
        textAlign: "center",
        fontSize: 16,
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
  