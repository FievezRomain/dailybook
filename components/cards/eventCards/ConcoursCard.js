import { View, Text, StyleSheet, Image } from "react-native";
import variables from "../../styles/Variables";
import { getImagePath } from '../../../services/Config';

const ConcoursCard = ({eventInfos, animaux}) => {
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
            backgroundColor: variables.rouan,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: 10,
        },
        eventCommentaire:{
            fontSize: 12
        },
        text:{
            color: variables.blanc,
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
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
                {eventInfos.lieu != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Lieu : </Text>{eventInfos.lieu}</Text>
                    </View>
                }
                {eventInfos.discipline != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Discipline : </Text>{eventInfos.discipline}</Text>
                    </View>
                }
                {eventInfos.epreuve != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Épreuve : </Text>{eventInfos.epreuve}</Text>
                    </View>
                }
                {eventInfos.dossart != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Dossart : </Text>{eventInfos.dossart}</Text>
                    </View>
                }
                {eventInfos.placement != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Placement : </Text>{eventInfos.placement}</Text>
                    </View>
                }
                {eventInfos.note != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Note : </Text>{eventInfos.note} / 5</Text>
                    </View>
                }
                {eventInfos.commentaire != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text]}><Text style={{fontStyle: "italic", color: variables.bai}}>Commentaire : </Text>{eventInfos.commentaire}</Text>
                    </View>
                }
            </View>
        </View>
    );
}

export default ConcoursCard;