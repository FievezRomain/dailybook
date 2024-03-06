import { View, Text, StyleSheet } from "react-native";
import variables from "../../styles/Variables";

const AutreCard = ({eventInfos}) => {
    const styles = StyleSheet.create({
        eventTextContainer:{
            display: "flex",
            flexDirection: "column",
            width: "80%",
        },
        eventTitle:{
            fontWeight: "bold",
            marginBottom: 10,
        },
        actionEventContainer:{
            width: "20%",
            alignItems: "flex-end",
        },
        eventContainer:{
            backgroundColor: variables.blanc,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: 10,
        },
        eventCommentaire:{

        },
    });

    return(
        <View style={styles.eventTextContainer}>
            <Text style={[styles.eventTitle, styles.text]}>{eventInfos.nom}</Text>
            {eventInfos.commentaire != "" && 
                <Text style={[styles.eventCommentaire, styles.text]}>{eventInfos.commentaire}</Text>
            }
        </View>
    );
}

export default AutreCard;