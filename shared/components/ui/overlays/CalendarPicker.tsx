import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Calendar, LocaleConfig, type CalendarProps, type DateData } from 'react-native-calendars';
import { componentTokens } from '../../../../theme/componentTokens';
import { alpha } from '../../../../theme/primitives';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Button } from '../actions';

export type CalendarSelectionMode = 'single' | 'range';
export interface CalendarPickerProps { open: boolean; mode?: CalendarSelectionMode; current?: string; selectedStart?: string; selectedEnd?: string; minimumDate?: string; maximumDate?: string; onSelectDay: (date: string) => void; onConfirm: () => void; onClose: () => void; markedDates?: CalendarProps['markedDates']; confirmLabel?: string; testID?: string }

LocaleConfig.locales.fr = { monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'], dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'], today: 'Aujourd’hui' };
LocaleConfig.defaultLocale = 'fr';

export function CalendarPicker({ open, mode = 'single', current, selectedStart, selectedEnd, minimumDate, maximumDate, onSelectDay, onConfirm, onClose, markedDates, confirmLabel = 'Choisir la date', testID }: CalendarPickerProps) {
  const { colors } = useAppTheme();
  const initialCurrent = (current ?? selectedStart ?? new Date().toISOString().slice(0, 10)).slice(0, 10);
  const [visibleCurrent, setVisibleCurrent] = useState(initialCurrent);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(Number(initialCurrent.slice(0, 4)));
  const years = useMemo(() => Array.from({ length: new Date().getFullYear() + 11 - 1900 }, (_, index) => new Date().getFullYear() + 10 - index), []);
  const months = LocaleConfig.locales.fr.monthNames as string[];
  useEffect(() => {
    if (!open) return;
    setVisibleCurrent(initialCurrent);
    setPickerYear(Number(initialCurrent.slice(0, 4)));
    setPeriodOpen(false);
  }, [initialCurrent, open]);
  const selection = buildSelectionMarks(selectedStart, selectedEnd, mode, colors.primary, colors.primaryLight, colors.textOnPrimary);
  const header = (value: unknown) => {
    const date = new Date(String(value));
    const label = Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
    return <Pressable accessibilityRole="button" accessibilityLabel="Changer le mois et l’année" onPress={() => { setPickerYear(date.getFullYear()); setPeriodOpen(true); }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{label.charAt(0).toUpperCase() + label.slice(1)} ▾</Text></Pressable>;
  };
  const choosePeriod = (monthIndex: number) => {
    setVisibleCurrent(`${pickerYear}-${String(monthIndex + 1).padStart(2, '0')}-01`);
    setPeriodOpen(false);
  };
  return <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
    <Pressable onPress={onClose} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay }}>
      <Pressable onPress={(event) => event.stopPropagation()} accessibilityRole="summary" accessibilityLabel="Choisir une date" testID={testID} style={{ width: '100%', maxWidth: componentTokens.picker.calendar.width, gap: 14, padding: spacing.md, paddingVertical: 20, borderRadius: radii.modal, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, shadowColor: alpha.black16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8 }}>
        {periodOpen ? <View style={{ height: 310, gap: spacing.md }}>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>Choisir le mois et l’année</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>{years.map((year) => <Pressable key={year} accessibilityRole="button" accessibilityState={{ selected: pickerYear === year }} onPress={() => setPickerYear(year)} style={{ minWidth: 64, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: pickerYear === year ? colors.primary : colors.surfaceVariant }}><Text style={{ color: pickerYear === year ? colors.textOnPrimary : colors.textPrimary, fontFamily: typography.fonts.semiBold }}>{year}</Text></Pressable>)}</ScrollView>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>{months.map((month, index) => <Pressable key={month} accessibilityRole="button" onPress={() => choosePeriod(index)} style={{ width: '30%', minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.surfaceVariant }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium }}>{month.slice(0, 4)}</Text></Pressable>)}</View>
        </View> : <Calendar key={visibleCurrent} current={visibleCurrent} minDate={minimumDate} maxDate={maximumDate} firstDay={1} renderHeader={header} markingType={mode === 'range' ? 'period' : 'custom'} markedDates={{ ...markedDates, ...selection }} onDayPress={(day: DateData) => onSelectDay(day.dateString)} onMonthChange={(month) => setVisibleCurrent(month.dateString)} enableSwipeMonths theme={{ calendarBackground: colors.surface, backgroundColor: colors.surface, monthTextColor: colors.textPrimary, textSectionTitleColor: colors.textSecondary, dayTextColor: colors.textPrimary, todayTextColor: colors.primary, selectedDayBackgroundColor: colors.primary, selectedDayTextColor: colors.textOnPrimary, arrowColor: colors.textPrimary, textMonthFontFamily: typography.fonts.semiBold, textMonthFontSize: typography.sizes.lg, textDayFontFamily: typography.fonts.medium, textDayFontSize: typography.sizes.control, textDayHeaderFontFamily: typography.fonts.medium, textDayHeaderFontSize: typography.sizes.xs }} />}
        <Button label={periodOpen ? 'Retour au calendrier' : confirmLabel} fullWidth disabled={!periodOpen && !selectedStart} onPress={periodOpen ? () => setPeriodOpen(false) : onConfirm} />
      </Pressable>
    </Pressable>
  </Modal>;
}
function buildSelectionMarks(start: string | undefined, end: string | undefined, mode: CalendarSelectionMode, primary: string, range: string, text: string): NonNullable<CalendarProps['markedDates']> {
  if (!start) return {};
  if (mode === 'single' || !end) return { [start]: { selected: true, selectedColor: primary, selectedTextColor: text, startingDay: mode === 'range', endingDay: mode === 'range', color: primary, textColor: text } };
  const marks: NonNullable<CalendarProps['markedDates']> = {};
  const cursor = new Date(`${start}T12:00:00`); const last = new Date(`${end}T12:00:00`);
  while (cursor <= last) { const key = cursor.toISOString().slice(0, 10); marks[key] = { color: key === start || key === end ? primary : range, textColor: key === start || key === end ? text : undefined, startingDay: key === start, endingDay: key === end }; cursor.setDate(cursor.getDate() + 1); }
  return marks;
}
