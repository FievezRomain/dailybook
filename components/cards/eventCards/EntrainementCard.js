import { View, Text, StyleSheet, Image } from "react-native";
import variables from "../../styles/Variables";
import { getImagePath } from '../../../services/Config';
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

const EntrainementCard = ({eventInfos, animaux, setSubMenu}) => {

    const styles = StyleSheet.create({
        eventTextContainer:{
            display: "flex",
            flexDirection: "column",
        },
        eventTitle:{
            fontWeight: "bold",
            marginBottom: 10,
            fontSize: 16
        },
        actionEventContainer:{
            width: "20%",
            alignItems: "flex-end",
        },
        eventContainer:{
            backgroundColor: variables.rouan,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: 10,
        },
        eventCommentaire:{
            fontSize: 14
        },
        avatarText: {
            color: "white",
            textAlign: "center"
        },
        avatar: {
            width: 20,
            height: 20,
            borderRadius: 10,
            zIndex: 1,
            justifyContent: "center"
        },
        headerEventContainer:{
            display: "flex", 
            flexDirection: "row"
        },
        titleAndAnimalsContainer:{
            display: "flex", 
            flexDirection: "row", 
            flexWrap: "wrap", 
            justifyContent: "space-between", 
            width: "100%"
        },
        contentEventContainer:{
            display: "flex", 
            flexDirection: "row", 
            justifyContent: "space-between", 
            flexWrap: "wrap"
        }
    });

    const getAnimalById = (idAnimal) =>{
        var animal = animaux.filter((animal) => animal.id === idAnimal)[0];

        return animal;
    }

    return(
        <View style={styles.eventTextContainer}>
            <View style={styles.headerEventContainer}>
                <View style={styles.titleAndAnimalsContainer}>
                    <View>
                        <Text style={[styles.eventTitle, styles.text]}>{eventInfos.nom}  </Text>
                    </View>
                    <View style={{flexDirection: "row", marginRight: 5}}>
                        {eventInfos !== undefined && animaux.length !== 0 && eventInfos.animaux.map((eventAnimal, index) => {
                            var animal = getAnimalById(eventAnimal);
                            return(
                                <View key={animal.id} style={{marginRight: -3}}>
                                    <View style={{height: 20, width: 20, backgroundColor: variables.bai, borderRadius: 10, justifyContent: "center"}}>
                                        { animal.image !== null ? 
                                            <Image style={[styles.avatar]} source={{uri: `${getImagePath()}${animal.image}`}} />
                                            :
                                            <Text style={styles.avatarText}>{animal.nom[0]}</Text>
                                        }
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </View>
            <View style={styles.contentEventContainer}>
                {eventInfos.lieu != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.alezan}}>Lieu : </Text>{eventInfos.lieu}</Text>
                    </View>
                }
                {eventInfos.discipline != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.alezan}}>Discipline : </Text>{eventInfos.discipline}</Text>
                    </View>
                }
                {eventInfos.note != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.alezan}}>Note : </Text>{eventInfos.note} / 5</Text>
                    </View>
                }
                {eventInfos.commentaire != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.alezan}}>Commentaire : </Text>{eventInfos.commentaire}</Text>
                    </View>
                }
            </View>
            
            
        </View>
    );
}

export default EntrainementCard;