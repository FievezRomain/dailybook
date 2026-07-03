import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TopTab from '../../../shared/components/common/TopTab';
import EventCard from '../../../shared/components/cards/EventCard';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import ModalFilterCalendar from '../components/ModalFilterCalendar';
import Toast from 'react-native-toast-message';
import { convertDateToText } from '../../../shared/utils/EventUtils';
import { useCalendarLogic, INITIAL_DATE } from '../hooks/useCalendarLogic';
import type { TabScreenProps } from '../../../navigation/types';
import { useTranslation } from 'react-i18next';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

export default function CalendarScreen({ navigation }: TabScreenProps<'Calendrier'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('events');
  const [modalFilterVisible, setModalFilterVisible] = React.useState(false);
  const {
    eventsCurrentDateSelected,
    filteredEvents,
    marked,
    filter,
    selectedDate,
    refreshing,
    setFilter,
    setSelectedDate,
    onRefresh,
    onDayPress,
    handleSearch,
    deleteSearchText,
  } = useCalendarLogic(colors);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => setSelectedDate(INITIAL_DATE));
    return unsubscribe;
  }, [navigation, setSelectedDate]);

  const handleEventsChange = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: t('modifySuccess') }), 350);
  };

  const styles = {
    calendarContainer: { marginTop: 10, width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: colors.background },
    calendar: { borderRadius: 5, shadowColor: colors.textPrimary, shadowOpacity: 0.1, elevation: 1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, backgroundColor: colors.background },
    listEventContainer: { alignSelf: 'center', width: '90%', marginBottom: 5 },
    selectedDateContainer: { marginTop: 10, padding: 2, width: '100%', marginBottom: 10 },
    selectedDateText: { textAlign: 'center', color: colors.textPrimary },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <>
      <ModalFilterCalendar modalVisible={modalFilterVisible} setModalVisible={setModalFilterVisible} setFilter={setFilter} filter={filter ?? undefined} />
          <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTab message1="Mon" message2="Calendrier" />
        {refreshing ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <FlatList
            data={filter ? filteredEvents : eventsCurrentDateSelected}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textPrimary} />}
            ListHeaderComponent={
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, alignSelf: 'center', width: '90%', justifyContent: 'space-between', padding: 10, borderRadius: 5, shadowColor: colors.textPrimary, elevation: 1, shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="search-outline" size={16} color={colors.textPrimary} />
                    <TextInput placeholder={t('search')} style={[{ marginLeft: 5, width: '80%', color: colors.textPrimary }, styles.textFontRegular]} placeholderTextColor={colors.textSecondary} value={filter?.text ?? ''} onChangeText={handleSearch} />
                    {filter?.text && (
                      <TouchableOpacity onPress={deleteSearchText}>
                        <AntDesign name="close" size={16} color={colors.textPrimary} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => setModalFilterVisible(true)}>
                    {filter ? <MaterialCommunityIcons name="filter-variant-plus" size={21} color={colors.textPrimary} /> : <Ionicons name="filter" size={20} color={colors.textPrimary} />}
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarContainer}>
                  <Calendar
                    style={styles.calendar}
                    firstDay={1}
                    monthFormat="MMMM yyyy"
                    theme={{ arrowColor: colors.primary, todayTextColor: colors.textSecondary, selectedDayTextColor: 'white', selectedDayBackgroundColor: colors.primary, calendarBackground: 'transparent', dayTextColor: colors.primary, textDayHeaderTextColor: colors.primary, textSectionTitleColor: colors.primary, monthTextColor: colors.primary } as any}
                    enableSwipeMonths
                    onDayPress={(day) => onDayPress(day.dateString)}
                    markingType="multi-dot"
                    markedDates={marked}
                  />
                </View>
                <View style={styles.selectedDateContainer}>
                  <Text style={[styles.selectedDateText, styles.textFontMedium]}>{filter ? t('filterResults') : convertDateToText(selectedDate)}</Text>
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
                {filter ? (
                  <ModalDefaultNoValue text={t('filterNoResult')} />
                ) : (
                  <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                    <MaterialCommunityIcons name="calendar-blank-outline" size={52} color={colors.secondary_roux} />
                    <Text style={{ marginTop: 14, fontSize: 16, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary, textAlign: 'center' }}>{t('noDayEvent')}</Text>
                    <Text style={{ marginTop: 6, fontSize: 13, color: colors.secondary_roux, textAlign: 'center', fontFamily: fonts.default?.fontFamily }}>{t('planTrip')}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EventEntry' as any)}
                      style={{ marginTop: 18, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 }}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: '#fff', fontFamily: fonts.bodyMedium.fontFamily, fontSize: 14 }}>{t('addEvent')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
