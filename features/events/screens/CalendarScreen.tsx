import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, CalendarUtils, LocaleConfig } from 'react-native-calendars';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TopTab from '../../../shared/components/common/TopTab';
import EventCard from '../../../shared/components/cards/EventCard';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import ModalFilterCalendar from '../components/ModalFilterCalendar';
import Toast from 'react-native-toast-message';
import { CalendarFilter } from '../../../business/models/CalendarFilter';
import { getEventTypeDot, convertDateToText, buildMarkedDates } from '../../../shared/utils/EventUtils';
import { useEventsQuery, EVENTS_KEY } from '../../../hooks/queries/useEventsQuery';
import { GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import type { TabScreenProps } from '../../../navigation/types';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const INITIAL_DATE = new Date().toISOString().split('T')[0];

export default function CalendarScreen({ navigation }: TabScreenProps<'Calendrier'>) {
  const { colors, fonts } = useAppTheme();
  const queryClient = useQueryClient();
  const { data: events = [] } = useEventsQuery();
  const [eventsCurrentDateSelected, setEventsCurrentDateSelected] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [marked, setMarked] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState<CalendarFilter | null>(null);
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { /* intentionally blank */ }, []));

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => setSelectedDate(INITIAL_DATE));
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setupMarkedDates(true);
    changeEventsCurrentDateSelected(selectedDate);
  }, [events]);

  useEffect(() => {
    applyFilter();
  }, [filter, events]);

  const applyFilter = () => {
    if (filter) setFilteredEvents(filter.filter(events));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    await queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
    setRefreshing(false);
  };

  const setupMarkedDates = (isInit: boolean) => {
    setMarked(buildMarkedDates(events, selectedDate, colors, isInit));
  };

  const changeEventsCurrentDateSelected = (date: string) => {
    setEventsCurrentDateSelected(events.filter((item: any) => item.dateevent === date));
  };

  const onDayPress = (day: string) => {
    setFilter(null);
    setSelectedDate(day);
    const newMarked = { ...marked };
    Object.values(newMarked).forEach((v) => (v.selected = false));
    if (!newMarked[day]) {
      newMarked[day] = { selected: true, disableTouchEvent: false, selectedColor: colors.accent, selectedTextColor: 'white', dots: [] };
    } else {
      newMarked[day].selected = true;
    }
    setMarked(newMarked);
    changeEventsCurrentDateSelected(day);
  };

  const handleEventsChange = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: "Modification d'un événement" }), 350);
  };

  const handleSearch = (query: string) => {
    if (filter) setFilter(new CalendarFilter(filter.date, filter.animals, filter.eventType, query));
    else setFilter(new CalendarFilter(undefined, undefined, undefined, query));
  };

  const deleteSearchText = () => {
    if (!filter?.date && !filter?.animals && !filter?.eventType) setFilter(null);
    else if (filter) setFilter(new CalendarFilter(filter.date, filter.animals, filter.eventType, undefined));
  };

  const styles = StyleSheet.create({
    calendarContainer: { marginTop: 10, width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: colors.background },
    calendar: { borderRadius: 5, shadowColor: colors.default_dark, shadowOpacity: 0.1, elevation: 1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, backgroundColor: colors.background },
    listEventContainer: { alignSelf: 'center', width: '90%', marginBottom: 5 },
    selectedDateContainer: { marginTop: 10, padding: 2, width: '100%', marginBottom: 10 },
    selectedDateText: { textAlign: 'center', color: colors.default_dark },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <>
      <ModalFilterCalendar modalVisible={modalFilterVisible} setModalVisible={setModalFilterVisible} setFilter={setFilter} filter={filter ?? undefined} />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTab message1="Mon" message2="Calendrier" />
        {refreshing ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <FlatList
            data={filter ? filteredEvents : eventsCurrentDateSelected}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.default_dark} />}
            ListHeaderComponent={
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, alignSelf: 'center', width: '90%', justifyContent: 'space-between', padding: 10, borderRadius: 5, shadowColor: colors.default_dark, elevation: 1, shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="search-outline" size={16} color={colors.default_dark} />
                    <TextInput placeholder="Recherche" style={[{ marginLeft: 5, width: '80%', color: colors.default_dark }, styles.textFontRegular]} placeholderTextColor={colors.default_dark} value={filter?.text ?? ''} onChangeText={handleSearch} />
                    {filter?.text && (
                      <TouchableOpacity onPress={deleteSearchText}>
                        <AntDesign name="close" size={16} color={colors.default_dark} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => setModalFilterVisible(true)}>
                    {filter ? <MaterialCommunityIcons name="filter-variant-plus" size={21} color={colors.default_dark} /> : <Ionicons name="filter" size={20} color={colors.default_dark} />}
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarContainer}>
                  <Calendar
                    style={styles.calendar}
                    firstDay={1}
                    monthFormat="MMMM yyyy"
                    theme={{ arrowColor: colors.accent, todayTextColor: colors.tertiary, selectedDayTextColor: 'white', selectedDayBackgroundColor: colors.accent, calendarBackground: 'transparent', dayTextColor: colors.accent, textDayHeaderTextColor: colors.accent, textSectionTitleColor: colors.accent, monthTextColor: colors.accent } as any}
                    enableSwipeMonths
                    onDayPress={(day) => onDayPress(day.dateString)}
                    markingType="multi-dot"
                    markedDates={marked}
                  />
                </View>
                <View style={styles.selectedDateContainer}>
                  <Text style={[styles.selectedDateText, styles.textFontMedium]}>{filter ? 'Résultats du filtre' : convertDateToText(selectedDate)}</Text>
                </View>
              </>
            }
            renderItem={({ item }) => (
              <View style={styles.listEventContainer}>
                <EventCard eventInfos={item} handleEventsChange={handleEventsChange} withDate={!!filter} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.listEventContainer}>
                <ModalDefaultNoValue text={filter ? 'Aucun événement correspond à ce filtre' : "Vous n'avez aucun événement pour cette date"} />
              </View>
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
