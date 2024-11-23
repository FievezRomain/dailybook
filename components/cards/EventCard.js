import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo, MaterialIcons, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import BaladeCard from './eventCards/BaladeCard';
import SoinsCard from './eventCards/SoinsCard';
import AutreCard from './eventCards/AutreCard';
import EntrainementCard from './eventCards/EntrainementCard';
import ConcoursCard from './eventCards/ConcoursCard';
import RdvCard from './eventCards/RdvCard';
import ModalEvents from "../Modals/ModalEvents";
import DepenseCard from "./eventCards/DepenseCard";
import React, { useEffect, useState, useContext } from 'react';
import ModalSubMenuEventActions from "../Modals/ModalSubMenuEventActions";
import { useAnimaux } from "../../providers/AnimauxProvider";
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import ModalEventDetails from "../Modals/ModalEventDetails";
import eventsServiceInstance from "../../services/EventService";
import LoggerService from '../../services/LoggerService';
import Toast from "react-native-toast-message";
import { useTheme } from 'react-native-paper';
import ModalValidation from "../Modals/ModalValidation";

const EventCard = ({eventInfos, handleEventsChange, withSubMenu=true, withDate=false, withState=false, typeEvent=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const [modalModificationVisible, setModalModificationVisible] = useState(false);
    const [modalSubMenuEventVisible, setModalSubMenuEventVisible] = useState(false);
    const [modalEventDetailsVisible, setModalEventDetailsVisible] = useState(false);
    const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);
    const [modalValidationDeleteAllVisible, setModalValidationDeleteAllVisible] = useState(false);
    const { animaux } = useAnimaux();

/*     useEffect(() => {
        getAnimaux();
    }, [eventInfos])

    const getAnimaux = async () => {
        var result = await animalsServiceInstance.getAnimals(currentUser.email);

        setAnimaux(result);
    } */

    const styles = StyleSheet.create({
        actionEventContainer:{
            marginRight: 10
        },
        eventContainer:{
            backgroundColor: colors.background,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            shadowColor: "black",
            shadowOpacity: 0.1,
            elevation: 1,
            shadowOffset: {
              width: 0,
              height: 1
            },
        },
        balade:{
            backgroundColor: colors.accent,
        },
        autre:{
            backgroundColor: colors.error,
        },
        rdv:{
            backgroundColor: colors.text,
        },
        soins:{
            backgroundColor: colors.neutral,
        },
        entrainement:{
            backgroundColor: colors.tertiary,
        },
        concours:{
            backgroundColor: colors.primary,
        },
        depense:{
            backgroundColor: colors.quaternary,
        },
        typeEventIndicator:{
            width: "100%", 
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
        },
        cardEventContainer:{
            paddingVertical: 10,
            display: "flex", 
            flexDirection: "row",  
            justifyContent: "space-between"
        },
        cardEventContainerWithIndicator:{
            width: "80%",
        },
        cardEventContainerWithoutIndicator:{
            width: "100%",
            paddingRight: 10,
            paddingLeft: 10
        },
        headerEventContainer:{
            display: "flex", 
            flexDirection: "row"
        },
        headerEvent:{
            flexDirection: "row", 
            justifyContent: "space-between"
        },
        titleTypeEventContainer:{
            flexDirection: "row", 
            alignItems: "center",
            paddingLeft: 10
        },
        contentEventContainer:{
            display: "flex", 
            flexDirection: "row"
        },
        indicatorEventContainer:{
            justifyContent: "center", 
            padding: 10, 
            marginRight: 10, 
            borderRightWidth: 0.3, 
            borderColor: colors.accent
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        subMenuContainer:{
            paddingVertical: 10,
            paddingLeft: 20,
            paddingRight: 10
        }
    });

    const handleDelete = () =>{
        setModalValidationDeleteVisible(true);
    }

    const confirmDelete = () =>{
        eventInfos.email = currentUser.email;
        
        eventsServiceInstance.delete(eventInfos)
            .then((reponse) =>{
    
              Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
              });
    
              handleEventsChange();
    
            })
            .catch((err) =>{
              Toast.show({
                  type: "error",
                  position: "top",
                  text1: err.message
              });
              LoggerService.log( "Erreur lors de suppression d'un event : " + err.message );
            });
    }

    const handleDeleteAll = () =>{
        setModalValidationDeleteAllVisible(true);
    }

    const confirmDeleteAll = () =>{
        eventInfos.email = currentUser.email;
        eventInfos.id = eventInfos.idparent === null ? eventInfos.id : eventInfos.idparent;

        eventsServiceInstance.delete(eventInfos)
            .then((reponse) =>{
    
              Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
              });
    
              handleEventsChange();
    
            })
            .catch((err) =>{
              Toast.show({
                  type: "error",
                  position: "top",
                  text1: err.message
              });
              LoggerService.log( "Erreur lors de suppression d'un event : " + err.message );
            });
    }

    const handleStateChange = async () => {
        switch(eventInfos.state){
            case "À faire":
                eventInfos.state = "Terminé";
                break;
            case "Terminé":
                eventInfos.state = "À faire";
                break;
        }

        let data = {};
        data["id"] = eventInfos.id;
        data["state"] = eventInfos.state;
        data["animaux"] = eventInfos.animaux;
        data["email"] = currentUser.email;

        eventsServiceInstance.updateState(data)
            .then((reponse) => {

                handleEventsChange();
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ du statut d'un event : " + err.message );
            })
    }

    const handleModify = () =>{
        setModalModificationVisible(true);
    }

    const getDateText = (date) =>{
        var dateObjet = new Date(date);
        var jour = ('0' + dateObjet.getDate()).slice(-2); 
        var mois = ('0' + (dateObjet.getMonth() + 1)).slice(-2);
        const dateFormatee = jour + '/' + mois;
        return dateFormatee;
    }

    const getYearText = (date) =>{
        var dateObjet = new Date(date);
        var annee = dateObjet.getFullYear();
        return annee;
    }

    const getDayText = (date) =>{
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var dateObject  = new Date(date);
        var dateText = String(dateObject.toLocaleDateString("fr-FR", options));
        dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
        return dateText.slice(0,3);
    }
    
    return(
        <>
            <ModalEvents 
                event={eventInfos}
                isVisible={modalModificationVisible}
                setVisible={setModalModificationVisible}
                actionType={"modify"}
                onModify={handleEventsChange}
            />
            <ModalSubMenuEventActions
                event={eventInfos}
                handleDelete={handleDelete}
                handleModify={handleModify}
                modalVisible={modalSubMenuEventVisible}
                setModalVisible={setModalSubMenuEventVisible}
                handleDeleteAll={handleDeleteAll}
            />
            <ModalEventDetails
                isVisible={modalEventDetailsVisible}
                setVisible={setModalEventDetailsVisible}
                event={eventInfos}
                animaux={animaux}
                handleEventsChange={handleEventsChange}
            />
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer l'événement ?"}
                onConfirm={confirmDelete}
                setVisible={setModalValidationDeleteVisible}
                visible={modalValidationDeleteVisible}
                title={"Suppression d'un événement"}
            />
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer l'événement ?"}
                onConfirm={confirmDeleteAll}
                setVisible={setModalValidationDeleteAllVisible}
                visible={modalValidationDeleteAllVisible}
                title={"Suppression d'un événement"}
            />
            {eventInfos.eventtype == "balade" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.balade, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <Entypo name="compass" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Balade</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange()} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <BaladeCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "rdv" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.rdv, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome name="stethoscope" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Rendez-vous médical</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <RdvCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "soins" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.soins, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome6 name="hand-holding-medical" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Soins</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <SoinsCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "entrainement" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.entrainement, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <Entypo name="traffic-cone" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Entrainement</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <EntrainementCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "autre" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.autre, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome6 name="check-circle" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Autre</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <AutreCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "concours" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.concours, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome name="trophy" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Concours</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <ConcoursCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "depense" &&
                <View style={styles.eventContainer}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.depense, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome6 name="money-bill-wave" size={20} color={colors.background} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: colors.background, fontSize: 14}, styles.textFontBold]}>Dépense</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                    <Entypo name='dots-three-horizontal' size={20} color={colors.background} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={colors.accent} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={colors.accent} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                            <DepenseCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    
                </View>
            }
        </>
    );
}

export default EventCard;