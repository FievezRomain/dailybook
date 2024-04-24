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
import React, { useState } from 'react';
import ModalSubMenuEventActions from "../Modals/ModalSubMenuEventActions";

const EventCard = ({eventInfos, updateFunction,  deleteFunction, withSubMenu=true}) => {
    const [modalModificationVisible, setModalModificationVisible] = useState(false);
    const [modalSubMenuEventVisible, setModalSubMenuEventVisible] = useState(false);

    const styles = StyleSheet.create({
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
                <View style={[styles.eventContainer, styles.balade]}>
                    <BaladeCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                    
                </View>
            }
            {eventInfos.eventtype == "rdv" &&
                <View style={[styles.eventContainer, styles.rdv]}>
                    <RdvCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                </View>
            }
            {eventInfos.eventtype == "soins" &&
                <View style={[styles.eventContainer, styles.soins]}>
                    <SoinsCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                </View>
            }
            {eventInfos.eventtype == "entrainement" &&
                <View style={[styles.eventContainer, styles.entrainement]}>
                    <EntrainementCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                </View>
            }
            {eventInfos.eventtype == "autre" &&
                <View style={[styles.eventContainer, styles.autre]}>
                    <AutreCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                </View>
            }
            {eventInfos.eventtype == "concours" &&
                <View style={[styles.eventContainer, styles.concours]}>
                    <ConcoursCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                </View>
            }
            {eventInfos.eventtype == "depense" &&
                <View style={[styles.eventContainer, styles.depense]}>
                    <DepenseCard
                        eventInfos={eventInfos}
                    />
                    {withSubMenu === true &&
                        <View style={styles.actionEventContainer}>
                            <Entypo name='dots-three-horizontal' size={20} onPress={() => setModalSubMenuEventVisible(true)}/>
                        </View>
                    }
                </View>
            }
        </>
    );
}

export default EventCard;