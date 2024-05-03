import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import variables from "../styles/Variables";
import { Entypo } from '@expo/vector-icons'
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

const EventCard = ({eventInfos, updateFunction,  deleteFunction, withSubMenu=true}) => {
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
            padding: 10, 
            display: "flex", 
            flexDirection: "row", 
            width: "100%", 
            justifyContent: "space-between"
        }
    });

    const handleDelete = () =>{
        deleteFunction(eventInfos);
    }

    const handleModify = () =>{
        setModalModificationVisible(true);
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
                    <View style={styles.cardEventContainer}>
                        <BaladeCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "rdv" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.rdv, styles.typeEventIndicator]}></View>
                    <View style={styles.cardEventContainer}>
                        <RdvCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                </View>
            }
            {eventInfos.eventtype == "soins" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.soins, styles.typeEventIndicator]}></View>
                    <View style={styles.cardEventContainer}>
                        <SoinsCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                </View>
            }
            {eventInfos.eventtype == "entrainement" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.entrainement, styles.typeEventIndicator]}></View>
                    <View style={styles.cardEventContainer}>
                        <EntrainementCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                    
                </View>
            }
            {eventInfos.eventtype == "autre" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.autre, styles.typeEventIndicator]}></View>
                    <View style={styles.cardEventContainer}>
                        <AutreCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                </View>
            }
            {eventInfos.eventtype == "concours" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.concours, styles.typeEventIndicator]}></View>
                    <View style={styles.cardEventContainer}>
                        <ConcoursCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                </View>
            }
            {eventInfos.eventtype == "depense" &&
                <View style={[styles.eventContainer]}>
                    <View style={[styles.depense, styles.typeEventIndicator]}></View>
                    <View style={styles.cardEventContainer}>
                        <DepenseCard
                            eventInfos={eventInfos}
                            animaux={animaux}
                        />
                        {withSubMenu === true &&
                            <View style={styles.actionEventContainer}>
                                <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                            </View>
                        }
                    </View>
                </View>
            }
        </>
    );
}

export default EventCard;