import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TopTab from '../../../shared/components/common/TopTab';
import EventCard from '../../../shared/components/cards/EventCard';
import ModalFilterCalendar from '../components/ModalFilterCalendar';
import Toast from 'react-native-toast-message';
import { convertDateToText } from '../../../shared/utils/EventUtils';
import { useCalendarLogic, INITIAL_DATE } from '../hooks/useCalendarLogic';
import type { TabScreenProps } from '../../../navigation/types';
import { useTranslation } from 'react-i18next';
import { AppEmptyState, AppErrorState } from '../../../shared/components/ui';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

export default function CalendarScreen({ navigation }: TabScreenProps<'Calendrier'>) {
  const { colors, fonts, tokens } = useAppTheme();
  const { t } = useTranslation('events');
  const [modalFilterVisible, setModalFilterVisible] = React.useState(false);
  const {
    eventsCurrentDateSelected,
    filteredEvents,
    marked,
    filter,
    selectedDate,
    refreshing,
    isLoadingEvents,
    isErrorEvents,
    setFilter,
    setSelectedDate,
    onRefresh,
    retryEvents,
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
        {isLoadingEvents ? (
          <View style={{ paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.xl }}>
            <ListSkeleton count={4} variant="event" />
          </View>
        ) : isErrorEvents ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppErrorState message="Impossible de charger le calendrier." onRetry={retryEvents} />
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
                    theme={{ arrowColor: colors.primary, todayTextColor: colors.textSecondary, selectedDayTextColor: colors.textOnPrimary, selectedDayBackgroundColor: colors.primary, calendarBackground: tokens.overlays.transparent, dayTextColor: colors.primary, textDayHeaderTextColor: colors.primary, textSectionTitleColor: colors.primary, monthTextColor: colors.primary } as any}
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
                  <AppEmptyState
                    icon="filter-off-outline"
                    title={t('filterNoResult')}
                    description="Essayez d'ajuster vos filtres ou votre recherche."
                  />
                ) : (
                  <AppEmptyState
                    icon="calendar-blank-outline"
                    title={t('noDayEvent')}
                    description={t('planTrip')}
                    ctaLabel={t('addEvent')}
                    onCta={() => navigation.navigate('EventEntry')}
                  />
                )}
              </View>
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
