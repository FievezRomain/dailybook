import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import variables from "../styles/Variables";
import { Entypo, MaterialIcons, FontAwesome6, FontAwesome } from '@expo/vector-icons'
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
import AnimalsService from "../../services/AnimalsService";
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';

const EventCard = ({eventInfos, updateFunction,  deleteFunction, withSubMenu=true, withDate=false, withState=false, handleStateChange=undefined, typeEvent=undefined}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [modalModificationVisible, setModalModificationVisible] = useState(false);
    const [modalSubMenuEventVisible, setModalSubMenuEventVisible] = useState(false);
    const animalsService = new AnimalsService;
    const [animaux, setAnimaux] = useState([]);

    useEffect(() => {
        if(animaux.length == 0){
            getAnimaux();
        }
    }, [eventInfos])

    const getAnimaux = async () => {
        var result = await animalsService.getAnimals(user.id);

        setAnimaux(result);
    }

    const styles = StyleSheet.create({
        actionEventContainer:{
            marginRight: 10
        },
        eventContainer:{
            backgroundColor: variables.blanc,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            shadowColor: variables.bai,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 1
            },
        },
        balade:{
            backgroundColor: variables.alezan,
        },
        autre:{
            backgroundColor: variables.bai_cerise,
        },
        rdv:{
            backgroundColor: variables.souris,
        },
        soins:{
            backgroundColor: variables.isabelle,
        },
        entrainement:{
            backgroundColor: variables.aubere,
        },
        concours:{
            backgroundColor: variables.bai,
        },
        depense:{
            backgroundColor: variables.rouan,
        },
        typeEventIndicator:{
            width: "100%", 
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
            padding: 10
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
            alignItems: "center"
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
            borderColor: variables.alezan
        }
    });

    const handleDelete = () =>{
        deleteFunction(eventInfos);
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
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateObject  = new Date(date);
        dateText = String(dateObject.toLocaleDateString("fr-FR", options));
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
                onModify={updateFunction}
            />
            <ModalSubMenuEventActions
                event={eventInfos}
                handleDelete={handleDelete}
                handleModify={handleModify}
                modalVisible={modalSubMenuEventVisible}
                setModalVisible={setModalSubMenuEventVisible}
            />
            {eventInfos.eventtype == "balade" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.balade, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                                <Entypo name="compass" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Balade</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={{justifyContent: "center", padding: 5}}>
                                <Text>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11}}>{getDateText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <BaladeCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "rdv" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.rdv, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome name="stethoscope" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Rendez-vous médical</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                                <Text>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11}}>{getDateText(eventInfos.dateevent)}</Text>
                                <Text style={{fontSize: 9}}>{getYearText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <RdvCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "soins" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.soins, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                            <FontAwesome6 name="hand-holding-medical" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Soins</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={{justifyContent: "center", padding: 5}}>
                                <Text>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11}}>{getDateText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <SoinsCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "entrainement" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.entrainement, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                                <Entypo name="traffic-cone" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Entrainement</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={{justifyContent: "center", padding: 5}}>
                                <Text>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11}}>{getDateText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <EntrainementCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "autre" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.autre, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome6 name="check-circle" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Autre</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={{justifyContent: "center", padding: 5}}>
                                <Text>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11}}>{getDateText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <AutreCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "concours" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.concours, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome name="trophy" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Concours</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={{justifyContent: "center", padding: 5}}>
                                <Text>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11}}>{getDateText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <ConcoursCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "depense" &&
                <View style={styles.eventContainer}>
                    <View style={styles.headerEventContainer}>
                        <View style={[styles.depense, styles.typeEventIndicator, styles.headerEvent]}>
                            <View style={styles.titleTypeEventContainer}>
                                <FontAwesome6 name="money-bill-wave" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={{color: variables.blanc, fontWeight: "bold", fontSize: 14}}>Dépense</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.alezan} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.alezan} />
                                }
                            </TouchableOpacity>
                        }
                        { withDate === true &&
                            <View style={styles.indicatorEventContainer}>
                                <Text style={{color: variables.alezan}}>{getDayText(eventInfos.dateevent)}.</Text>
                                <Text style={{fontSize: 11, color: variables.alezan}}>{getDateText(eventInfos.dateevent)}</Text>
                            </View>
                        }
                        <View style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]}>
                            <DepenseCard
                                eventInfos={eventInfos}
                                animaux={animaux}
                                setSubMenu={setModalSubMenuEventVisible}
                            />
                        </View>
                    </View>
                    
                    
                </View>
            }
        </>
    );
}

export default EventCard;