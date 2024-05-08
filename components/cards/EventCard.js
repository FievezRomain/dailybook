import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import variables from "../styles/Variables";
import { Entypo, MaterialIcons } from '@expo/vector-icons'
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
            flexDirection: "row",
            marginBottom: 10,
        },
        balade:{
            backgroundColor: variables.alezan,
        },
        autre:{
            backgroundColor: variables.pinterest,
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
            width: "3%", 
            height: "100%", 
            borderTopStartRadius: 5, 
            borderBottomStartRadius: 5
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
            paddingRight: 30,
            paddingLeft: 10
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
                    <View style={[styles.balade, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.alezan} />
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
            }
            {eventInfos.eventtype == "rdv" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.rdv, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.souris} />
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
                        <RdvCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                            setSubMenu={setModalSubMenuEventVisible}
                        />
                    </View>
                </View>
            }
            {eventInfos.eventtype == "soins" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.soins, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.isabelle} />
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
            }
            {eventInfos.eventtype == "entrainement" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.entrainement, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.aubere} />
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
            }
            {eventInfos.eventtype == "autre" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.autre, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.pinterest} />
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
            }
            {eventInfos.eventtype == "concours" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.concours, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.bai} />
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
            }
            {eventInfos.eventtype == "depense" &&
                <View style={styles.eventContainer}>
                    <View style={[styles.depense, styles.typeEventIndicator]}></View>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={{justifyContent: "center", padding: 5}}>
                            {eventInfos.state === "À faire" && 
                                <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                ||
                                <MaterialIcons name="check-box" size={30} color={variables.rouan} />
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
                        <DepenseCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                            setSubMenu={setModalSubMenuEventVisible}
                        />
                    </View>
                </View>
            }
        </>
    );
}

export default EventCard;