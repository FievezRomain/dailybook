import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import variables from "../styles/Variables";
import { FontAwesome5 } from '@expo/vector-icons'
import BaladeCard from './eventCards/BaladeCard';
import SoinsCard from './eventCards/SoinsCard';
import AutreCard from './eventCards/AutreCard';
import EntrainementCard from './eventCards/EntrainementCard';
import ConcoursCard from './eventCards/ConcoursCard';
import RdvCard from './eventCards/RdvCard';
import ModalEvents from "../Modals/ModalEvents";
import React, { useState } from 'react';

const EventCard = ({eventInfos, updateFunction,  deleteFunction}) => {
    const [modalModificationVisible, setModalModificationVisible] = useState(false);

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
            backgroundColor: variables.blanc,
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
        }
    });
    
    return(
        <>
            <ModalEvents 
                event={eventInfos}
                isVisible={modalModificationVisible}
                setVisible={setModalModificationVisible}
                actionType={"modify"}
                onModify={updateFunction}
            />
            {eventInfos.eventtype == "balade" &&
                <View style={[styles.eventContainer, styles.balade]}>
                    <BaladeCard
                        eventInfos={eventInfos}
                    />
                    <View style={styles.actionEventContainer}>
                        <TouchableOpacity onPress={() => {setModalModificationVisible(true)}}><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15, color: variables.blanc}}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => {deleteFunction(eventInfos)}}><FontAwesome5 name="trash-alt" size={18} style={{color: variables.blanc}}/></TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "rdv" &&
                <View style={[styles.eventContainer, styles.rdv]}>
                    <RdvCard
                        eventInfos={eventInfos}
                    />
                    <View style={styles.actionEventContainer}>
                        <TouchableOpacity onPress={() => {setModalModificationVisible(true)}}><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15, color: variables.blanc}}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => {deleteFunction(eventInfos)}}><FontAwesome5 name="trash-alt" size={18} style={{color: variables.blanc}}/></TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "soins" &&
                <View style={[styles.eventContainer, styles.soins]}>
                    <SoinsCard
                        eventInfos={eventInfos}
                    />
                    <View style={styles.actionEventContainer}>
                        <TouchableOpacity onPress={() => {setModalModificationVisible(true)}}><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15, color: variables.blanc}}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => {deleteFunction(eventInfos)}}><FontAwesome5 name="trash-alt" size={18} style={{color: variables.blanc}}/></TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "entrainement" &&
                <View style={[styles.eventContainer, styles.entrainement]}>
                    <EntrainementCard
                        eventInfos={eventInfos}
                    />
                    <View style={styles.actionEventContainer}>
                        <TouchableOpacity onPress={() => {setModalModificationVisible(true)}}><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15}}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => {deleteFunction(eventInfos)}}><FontAwesome5 name="trash-alt" size={18}/></TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "autre" &&
                <View style={[styles.eventContainer, styles.autre]}>
                    <AutreCard
                        eventInfos={eventInfos}
                    />
                    <View style={styles.actionEventContainer}>
                        <TouchableOpacity onPress={() => {setModalModificationVisible(true)}}><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15}}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => {deleteFunction(eventInfos)}}><FontAwesome5 name="trash-alt" size={18}/></TouchableOpacity>
                    </View>
                </View>
            }
            {eventInfos.eventtype == "concours" &&
                <View style={[styles.eventContainer, styles.concours]}>
                    <ConcoursCard
                        eventInfos={eventInfos}
                    />
                    <View style={styles.actionEventContainer}>
                        <TouchableOpacity onPress={() => {setModalModificationVisible(true)}}><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15, color: variables.blanc}}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => {deleteFunction(eventInfos)}}><FontAwesome5 name="trash-alt" size={18} style={{color: variables.blanc}}/></TouchableOpacity>
                    </View>
                </View>
            }
        </>
    );
}

export default EventCard;