import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import CompletionBar from '../../../shared/components/common/CompletionBar';
import EventCard from '../../../shared/components/cards/EventCard';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

const EventsBloc = ({ navigation, events, handleEventsChange }: any) => {
    const { colors, fonts } = useAppTheme();
    const { t } = useTranslation('events');
    const [eventsToday, setEventsToday] = useState<any[]>([]);
    const [eventsUpcoming, setEventsUpcoming] = useState<any[]>([]);
    const [eventsExceeded, setEventsExceeded] = useState<any[]>([]);
    const [percentEventsDone, setPercentEventsDone] = useState(0);

    useEffect(() => {
        filterByPeriod();
    }, [events]);

    useEffect(() => {
        definePercentDone();
    }, [eventsToday, eventsUpcoming, eventsExceeded]);

    const calculateOverdueDays = (event: any) => {
        var eventDate = new Date(event.dateevent).setHours(0, 0, 0, 0);
        var currentDate = new Date().setHours(0, 0, 0, 0);

        // Calcul de la différence en millisecondes
        const differenceInMilliseconds = Math.abs(currentDate - eventDate);

        // Convertir la différence en jours
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        return differenceInDays;

    }

    const parseHeureToMinutes = (heureStr: any) => {
        if (!heureStr || typeof heureStr !== 'string') return Number.MAX_SAFE_INTEGER;
      
        const parts = heureStr.split('h');
        const heures = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
      
        return heures * 60 + minutes;
    };

    const filterByPeriod = () => {
        var todayArray: any[] = [];
        var upcomingArray: any[] = [];
        var exceededArray: any[] = [];

        events.sort((a: any, b: any) => {
            let dateA = new Date(a.dateevent).setHours(0, 0, 0, 0);
            let dateB = new Date(b.dateevent).setHours(0, 0, 0, 0);

            if (dateA !== dateB) {
                return dateA - dateB;
            }

            // Si la date est la même, on trie par heure
            const heureA = parseHeureToMinutes(a.heuredebutevent);
            const heureB = parseHeureToMinutes(b.heuredebutevent);
            return heureA - heureB;
        })
  
        events.map((event: any) => {
          var currentDate = new Date(event.dateevent).setHours(0, 0, 0, 0);
  
          if(currentDate === new Date().setHours(0, 0, 0, 0)){
            todayArray.push(event);
          }
          if(event.state === "À faire" && currentDate < new Date().setHours(0, 0, 0, 0)){
            exceededArray.push(event);
          }
          if(currentDate > new Date().setHours(0, 0, 0, 0)){
            upcomingArray.push(event);
          }
        })
  
        setEventsToday(todayArray);
        setEventsUpcoming(upcomingArray.slice(0,5));
        setEventsExceeded(exceededArray);
  
    }

    const definePercentDone = () => {
        var total = 0;
        var done = 0;

        total = eventsToday.length + eventsExceeded.length;
        done = eventsToday.filter((event) => event.state === "Terminé").length + eventsExceeded.filter((event) => event.state === "Terminé").length;
        
        setPercentEventsDone(done === 0 ? 0 : Math.round((done / total) * 100));
    }

    const styles = {
        container:{
            width: "100%",
            alignItems: "center",
        },
        eventTodayContainer:{
            width: "100%",
            paddingTop: 20,
            borderRadius: 5,
            paddingBottom: 20
        },
        eventUpcomingContainer:{
            width: "100%",
            borderRadius: 5,
        },
        headerContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
        },
        title:{
            color: colors.textPrimary,
            fontSize: 16,
        },
        icon:{
            marginRight: 10,
        },
        containerCompletionBar:{
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
        },
        eventContainer:{
            display: "flex",
            flexDirection: "row",
            width: "100%"
        },
        stateContainer:{
            width: "10%", 
            justifyContent: "center", 
            alignItems: "center", 
            marginBottom: 10
        },
        inputStateContainer:{
            alignItems: "center", 
            justifyContent: "center", 
            width: 25, 
            height: 25,  
            borderRadius: 60, 
            borderBlockColor: colors.textPrimary, 
            borderWidth: 0.2
        },
        dateContainer:{
            width: "10%", 
            justifyContent: "center", 
            alignItems: "center", 
            marginBottom: 10
        },
        inputDateContainer:{
            alignItems: "center", 
            justifyContent: "center",
        },
        cardEventContainer:{
            width: "100%"
        },
        overdueIndicatorContainer:{
            backgroundColor: colors.background, 
            alignSelf: "flex-end",
            top: -20, 
            width: "40%", 
            padding: 5, 
            borderRadius: 60, 
            marginRight: 10, 
            borderColor: colors.textPrimary,
            borderWidth: 0.2,
            alignItems: "center",
            shadowColor: colors.textPrimary,
            shadowOpacity: 0.1,
            elevation: 1,
            shadowRadius: 5,
            shadowOffset: {width: 0, height: 2}
        },
        overdueIndicator:{
            color: colors.textPrimary, 
            fontSize: 12,
        },
        inputStateContainerDefault:{
            backgroundColor: colors.background,
        },
        inputStateContainerSelected:{
            backgroundColor: colors.textPrimary,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    
    } as const;

    return(
        <>
        <View style={styles.container}>
            <View style={styles.eventTodayContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='check-circle' size={20} color={colors.textPrimary} style={styles.icon} />
                    <Text style={[styles.title, styles.textFontBold]}>{t('tasks')}</Text>
                </View>
                <View>
                    {(eventsExceeded.length !== 0 || eventsToday.length !== 0) &&
                        <>
                            <View style={styles.containerCompletionBar}>
                                <CompletionBar
                                    percentage={percentEventsDone}
                                />
                            </View>
                        </>
                    }
                </View>
                <View>
                    <View>
                        <FlatList
                            data={eventsExceeded}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            style={{paddingHorizontal: 20, paddingBottom: 5, paddingTop: 5}}
                            renderItem={({ item }) => (
                                <TouchableOpacity>
                                    <View style={styles.eventContainer}>
                                        <EventCard
                                            eventInfos={item}
                                            withSubMenu={true}
                                            withState={true}
                                            handleEventsChange={handleEventsChange}
                                            typeEvent={"exceeded"}
                                        />
                                    </View>
                                    <View style={styles.overdueIndicatorContainer}>
                                        <Text style={[styles.overdueIndicator, styles.textFontRegular]}>{calculateOverdueDays(item)} jour(s) de retard</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <FlatList
                        data={eventsToday}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        style={{paddingHorizontal: 20, paddingBottom: 5, paddingTop: 5}}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Vous n'avez aucun événement aujourd'hui"}
                            />
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity>
                                <View style={styles.eventContainer}>
                                    <EventCard
                                        eventInfos={item}
                                        withSubMenu={true}
                                        withState={true}
                                        typeEvent={"today"}
                                        handleEventsChange={handleEventsChange}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                
            </View>

            <View style={styles.eventUpcomingContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='calendar' size={20} color={colors.textPrimary} style={styles.icon}/>
                    <Text style={[styles.title, styles.textFontBold]}>{t('upcomingEvents')}</Text>
                </View>
                <View>
                    <FlatList
                        data={eventsUpcoming}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        style={{paddingHorizontal: 20, paddingBottom: 5, paddingTop: 5}}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Vous n'avez aucun événement à venir"}
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={styles.eventContainer}>
                                <View style={[styles.cardEventContainer]}>
                                    <EventCard
                                        eventInfos={item}
                                        withSubMenu={true}
                                        withDate={true}
                                        handleEventsChange={handleEventsChange}
                                    />
                                </View>
                            </View>
                        )}
                    />
                    
                </View>
            </View>
        </View>
            
        </>
    )
}

export default EventsBloc;
