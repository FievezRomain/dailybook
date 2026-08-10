import { Calendar, LocaleConfig, type CalendarProps, type DateData } from 'react-native-calendars';
import { Text } from 'react-native';
import { alpha } from '../../../../theme/primitives';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from '../content';

export interface InlineCalendarProps { current: string; selectedDate: string; markedDates?: CalendarProps['markedDates']; onSelectDate: (date: string) => void; onMonthChange?: (month: string) => void; testID?: string }

LocaleConfig.locales.fr = { monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'], dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'], today: 'Aujourd’hui' };
LocaleConfig.defaultLocale = 'fr';

export function InlineCalendar({ current, selectedDate, markedDates, onSelectDate, onMonthChange, testID }: InlineCalendarProps) {
  const { colors } = useAppTheme();
  const selected = { ...(markedDates?.[selectedDate] ?? {}), selected: true, selectedColor: colors.primary, selectedTextColor: colors.textOnPrimary };
  return <Card accessibilityLabel="Calendrier" testID={testID} style={{ width: '100%', maxWidth: 360, minHeight: 337, padding: 0, borderRadius: radii.modal, shadowColor: alpha.black16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8, overflow: 'hidden' }}><Calendar current={current.slice(0, 10)} firstDay={1} enableSwipeMonths markingType="multi-dot" markedDates={{ ...markedDates, [selectedDate]: selected }} onDayPress={(day: DateData) => onSelectDate(day.dateString)} onMonthChange={(month: DateData) => onMonthChange?.(month.dateString)} renderHeader={(value) => { const date = new Date(String(value)); const label = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date); return <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>; }} theme={{ calendarBackground: colors.surface, backgroundColor: colors.surface, monthTextColor: colors.textPrimary, textSectionTitleColor: colors.textSecondary, dayTextColor: colors.textPrimary, todayTextColor: colors.primary, selectedDayBackgroundColor: colors.primary, selectedDayTextColor: colors.textOnPrimary, arrowColor: colors.textPrimary, textMonthFontFamily: typography.fonts.semiBold, textMonthFontSize: typography.sizes.lg, textDayFontFamily: typography.fonts.medium, textDayFontSize: typography.sizes.control, textDayHeaderFontFamily: typography.fonts.medium, textDayHeaderFontSize: typography.sizes.xs }} /></Card>;
}
