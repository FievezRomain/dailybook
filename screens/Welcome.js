import { View, Text, StyleSheet, Image, Dimensions, ScrollView, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import TopTab from '../components/common/TopTab';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventsBloc from "../components/EventsBloc";
import ObjectifsInProgressBloc from "../components/ObjectifsInProgressBloc";
import { useAuth } from "../contexts/AuthenticatedUserProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import { useEvents } from "../contexts/EventsProvider";
import { useObjectifs } from "../contexts/ObjectifsProvider";
import { isAfter, isEqual, startOfDay } from 'date-fns';
import groupServiceInstance from "../services/api/GroupService";

const WelcomeScreen = ({ navigation })=> {
  const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState({message1 :"Bienvenue", message2: ""});
    const { events } = useEvents();
    const { objectifs, setObjectifs } = useObjectifs();
    const [refreshing, setRefreshing] = useState(false);
          
    useFocusEffect(
      useCallback(() => {
          setMessages({message1: "Bienvenue", message2: currentUser.displayName != null && currentUser.displayName != undefined ? currentUser.displayName.slice(0,17) : currentUser.displayName});
          //getEventsForUser();
          //getObjectifsForUser();
      }, [])
    );

    const onRefresh = async () => {
      setRefreshing(true);
      await groupServiceInstance.refreshCache();
      setRefreshing(false);
    };

    const getObjectifsInProgress = () => {
      if( objectifs !== undefined && Array.isArray(objectifs) ){
        return objectifs.filter( (item) =>  item.sousEtapes.some(etape => etape.state === false) && 
          (
            isAfter( startOfDay(new Date(item.datefin)), startOfDay(new Date()) ) 
            ||
            isEqual( startOfDay(new Date(item.datefin)), startOfDay(new Date()) )
          ) 
        );
      }
      return undefined;
    }

    const convertDateToText = () => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateObject = new Date();
      const dateText = dateObject.toLocaleDateString("fr-FR", options);
    
      return dateText;
    };

    const convertDayDateToText = () => {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var dateObject  = new Date();
      var dateText = String(dateObject.toLocaleDateString("fr-FR", options));
      dateText = String(dateText.split(" ", 1));
      return dateText.charAt(0).toUpperCase() + dateText.slice(1);;
    };

    const handleObjectifChange = (objectif) => {
      let updatedObjectifs = [];
      updatedObjectifs = [... objectifs];

      var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
      updatedObjectifs[index] = objectif;
      //setObjectifs(updatedObjectifs);

    }

    const handleObjectifDelete = (objectif) => {
      let updatedObjectifs = [];
      updatedObjectifs = [... objectifs];

      var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
      updatedObjectifs.splice(index, 1);
      //setObjectifs(updatedObjectifs);
    }

    const handleEventChange = async () => {
      //setEvents(await eventService.getEvents(currentUser.email));

    }

    const styles = StyleSheet.create({
      imagePrez:{
        height: "90%",
        width: "100%",
      },
      contentContainer:{
        display: "flex",
        height: "90%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      },
      image: {
        height: "100%",
        backgroundColor: colors.background,
      },
      svgCurve:{
        position: 'absolute',
        width: Dimensions.get('window').width
      },
      summaryContainer:{
        marginTop: 15,
        marginLeft: 20
      },
      summary:{
        fontSize: 20,
        color: colors.default_dark
      },
    });

    function getContent() {
      if (refreshing) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        );
      }

      return (
        <FlatList
          data={[]}
          keyExtractor={() => "key"}
          renderItem={null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.default_dark} />
          }
          ListHeaderComponent={
            <>
              <View style={styles.summaryContainer}>
                <Text style={[styles.summary, , {fontFamily: fonts.bodyMedium.fontFamily, marginBottom: 2}]}>{messages.message1} {messages.message2}</Text>
                <Text style={[styles.summary, {fontFamily: fonts.bodySmall.fontFamily}]}>{convertDayDateToText()} {convertDateToText()}</Text>
              </View>
              <View style={{marginTop: 10, paddingBottom: 10}}>
                <EventsBloc 
                  events={events}
                  handleEventsChange={handleEventChange}
                />
                <ObjectifsInProgressBloc
                  objectifs={getObjectifsInProgress()}
                  handleObjectifChange={handleObjectifChange}
                  handleObjectifDelete={handleObjectifDelete}
                />
              </View>
            </>
          }
        />
      )
    }

    return (
      <>
        <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
            <View style={{flex: 1}}>
              <TopTab withBackground={false} withLogo={true}/>
              
              {getContent()}
              
            </View>
        </LinearGradient>
      </>
      );
}

module.exports = WelcomeScreen;