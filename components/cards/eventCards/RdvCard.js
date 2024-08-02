import { View, Text, StyleSheet, Image } from "react-native";
import variables from "../../styles/Variables";
import { getImagePath } from '../../../services/Config';
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

const RdvCard = ({eventInfos, animaux, setSubMenu}) => {
    const styles = StyleSheet.create({
        eventTextContainer:{
            display: "flex",
            flexDirection: "column",
        },
        eventTitle:{
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
            flexDirection: "column", 
            justifyContent: "space-between", 
            flexWrap: "wrap"
        },
        textFontRegular:{
            fontFamily: variables.fontRegular
        },
        textFontMedium:{
            fontFamily: variables.fontMedium
        },
        textFontBold:{
            fontFamily: variables.fontBold
        }
    });

    const getAnimalById = (idAnimal) =>{
        var animal = animaux.filter((animal) => animal.id === idAnimal)[0];

        return animal;
    }

    function isValidString(str) {
        return str !== null && str !== undefined && str.trim() !== "";
    }

    return(
        <View style={styles.eventTextContainer}>
            <View style={styles.headerEventContainer}>
                <View style={styles.titleAndAnimalsContainer}>
                    <View style={{width: "70%"}}>
                        <Text style={[styles.eventTitle, styles.text, styles.textFontBold]}>{eventInfos.nom}  </Text>
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
                                                <Text style={[styles.avatarText, styles.textFontRegular]}>{animal.nom[0]}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                        })}
                    </View>
                </View>
            </View>
            <View style={styles.contentEventContainer}>
                {isValidString(eventInfos.lieu) && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}><Text style={[{fontStyle: "italic", color: variables.alezan}, styles.textFontRegular]}>Lieu : </Text>{eventInfos.lieu}</Text>
                    </View>
                }
                {isValidString(eventInfos.specialiste) && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}><Text style={[{fontStyle: "italic", color: variables.alezan}, styles.textFontRegular]}>Spécialiste : </Text>{eventInfos.specialiste}</Text>
                    </View>
                }
                {eventInfos.depense != null && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}><Text style={[{fontStyle: "italic", color: variables.alezan}, styles.textFontRegular]}>Dépense : </Text>{eventInfos.depense} euros</Text>
                    </View>
                }
                {isValidString(eventInfos.commentaire) && 
                    <View style={{paddingRight: 5, paddingBottom: 5}}>
                        <Text style={[styles.eventCommentaire, styles.text, styles.textFontRegular]}><Text style={[{fontStyle: "italic", color: variables.alezan}, styles.textFontRegular]}>Commentaire : </Text>{eventInfos.commentaire}</Text>
                    </View>
                }
            </View>
        </View>
    );
}

export default RdvCard;