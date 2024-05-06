import { View, Text, StyleSheet, Image } from "react-native";
import variables from "../../styles/Variables";
import { getImagePath } from '../../../services/Config';
import { Entypo } from '@expo/vector-icons'

const DepenseCard = ({eventInfos, animaux, setSubMenu}) => {
    const styles = StyleSheet.create({
        eventTextContainer:{
            display: "flex",
            flexDirection: "column",
            width: "80%",
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
            fontSize: 14,
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
    });

    const getAnimalById = (idAnimal) =>{
        var animal = animaux.filter((animal) => animal.id === idAnimal)[0];

        return animal;
    }

    return(
        <View style={styles.eventTextContainer}>
            <View style={{display: "flex", flexDirection: "row"}}>
                <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "90%"}}>
                    <Text style={[styles.eventTitle, styles.text]}>{eventInfos.nom}  </Text>
                    {eventInfos !== undefined && animaux.length !== 0 && eventInfos.animaux.map((eventAnimal, index) => {
                            var animal = getAnimalById(eventAnimal);
                            return(
                                <View key={animal.id} style={{marginRight: 5}}>
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
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "10%"}}>
                    <Entypo name='dots-three-horizontal' size={20} onPress={() => setSubMenu(true)}/>
                </View>
            </View>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
                {eventInfos.lieu != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.alezan}}>Lieu : </Text>{eventInfos.lieu}</Text>
                    </View>
                }
                {eventInfos.depense != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.alezan}}>Dépense : </Text>{eventInfos.depense} euros</Text>
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

export default DepenseCard;