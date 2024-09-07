import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import variables from "../styles/Variables";
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
import AnimalsService from "../../services/AnimalsService";
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import ModalEventDetails from "../Modals/ModalEventDetails";

const EventCard = ({eventInfos, updateFunction,  deleteFunction, withSubMenu=true, withDate=false, withState=false, handleStateChange=undefined, typeEvent=undefined}) => {
    const { currentUser } = useAuth();
    const [modalModificationVisible, setModalModificationVisible] = useState(false);
    const [modalSubMenuEventVisible, setModalSubMenuEventVisible] = useState(false);
    const [modalEventDetailsVisible, setModalEventDetailsVisible] = useState(false);
    const animalsService = new AnimalsService;
    const [animaux, setAnimaux] = useState([]);

    useEffect(() => {
        if(animaux.length == 0){
            getAnimaux();
        }
    }, [eventInfos])

    const getAnimaux = async () => {
        var result = await animalsService.getAnimals(currentUser.email);

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
            shadowColor: "black",
            shadowOpacity: 0.1,
            shadowOffset: {
              width: 0,
              height: 1
            },
        },
        balade:{
            backgroundColor: variables.bai,
        },
        autre:{
            backgroundColor: variables.bai_cerise,
        },
        rdv:{
            backgroundColor: variables.bai_brun,
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
            borderColor: variables.bai
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
            <ModalEventDetails
                isVisible={modalEventDetailsVisible}
                setVisible={setModalEventDetailsVisible}
                event={eventInfos}
                animaux={animaux}
                onModify={updateFunction}
            />
            {eventInfos.eventtype == "balade" &&
                <View style={[styles.eventContainer]}>
                    <View style={styles.headerEventContainer}>
                        <TouchableOpacity style={[styles.balade, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                            <View style={styles.titleTypeEventContainer}>
                                <Entypo name="compass" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Balade</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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
                                <FontAwesome name="stethoscope" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Rendez-vous médical</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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
                                <FontAwesome6 name="hand-holding-medical" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Soins</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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
                                <Entypo name="traffic-cone" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Entrainement</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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
                                <FontAwesome6 name="check-circle" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Autre</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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
                                <FontAwesome name="trophy" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Concours</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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
                                <FontAwesome6 name="money-bill-wave" size={20} color={variables.blanc} style={{marginRight: 10, marginLeft: 5}}/>
                                <Text style={[{color: variables.blanc, fontSize: 14}, styles.textFontBold]}>Dépense</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)}>
                                    <Entypo name='dots-three-horizontal' size={20} color={variables.blanc} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentEventContainer}>
                        { withState === true &&
                            <TouchableOpacity onPress={()=>handleStateChange(eventInfos, typeEvent)} style={styles.indicatorEventContainer}>
                                {eventInfos.state === "À faire" && 
                                    <MaterialIcons name="check-box-outline-blank" size={32} color={variables.bai} />
                                    ||
                                    <MaterialIcons name="check-box" size={32} color={variables.bai} />
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