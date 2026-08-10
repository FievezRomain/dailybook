import { Modal, Pressable, View } from 'react-native';
import { Calendar, type CalendarProps, type DateData } from 'react-native-calendars';
import { componentTokens } from '../../../../theme/componentTokens';
import { alpha } from '../../../../theme/primitives';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Button } from '../actions';

export type CalendarSelectionMode = 'single' | 'range';
export interface CalendarPickerProps { open: boolean; mode?: CalendarSelectionMode; current?: string; selectedStart?: string; selectedEnd?: string; onSelectDay: (date: string) => void; onConfirm: () => void; onClose: () => void; markedDates?: CalendarProps['markedDates']; confirmLabel?: string; testID?: string }

export function CalendarPicker({ open, mode = 'single', current, selectedStart, selectedEnd, onSelectDay, onConfirm, onClose, markedDates, confirmLabel = 'Choisir la date', testID }: CalendarPickerProps) {
  const { colors } = useAppTheme();
  const selection = buildSelectionMarks(selectedStart, selectedEnd, mode, colors.primary, colors.primaryLight, colors.textOnPrimary);
  return <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}><Pressable onPress={onClose} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay }}><Pressable onPress={(event) => event.stopPropagation()} accessibilityRole="summary" accessibilityLabel="Choisir une date" testID={testID} style={{ width: '100%', maxWidth: componentTokens.picker.calendar.width, gap: 14, padding: spacing.md, paddingVertical: 20, borderRadius: radii.modal, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, shadowColor: alpha.black16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8 }}><Calendar current={current ?? selectedStart} firstDay={1} markingType={mode === 'range' ? 'period' : 'custom'} markedDates={{ ...markedDates, ...selection }} onDayPress={(day: DateData) => onSelectDay(day.dateString)} enableSwipeMonths theme={{ calendarBackground: colors.surface, backgroundColor: colors.surface, monthTextColor: colors.textPrimary, textSectionTitleColor: colors.textSecondary, dayTextColor: colors.textPrimary, todayTextColor: colors.primary, selectedDayBackgroundColor: colors.primary, selectedDayTextColor: colors.textOnPrimary, arrowColor: colors.textPrimary, textMonthFontFamily: typography.fonts.semiBold, textMonthFontSize: typography.sizes.lg, textDayFontFamily: typography.fonts.medium, textDayFontSize: typography.sizes.control, textDayHeaderFontFamily: typography.fonts.medium, textDayHeaderFontSize: typography.sizes.xs }} /><Button label={confirmLabel} fullWidth disabled={!selectedStart} onPress={onConfirm} /></Pressable></Pressable></Modal>;
}

function buildSelectionMarks(start: string | undefined, end: string | undefined, mode: CalendarSelectionMode, primary: string, range: string, text: string): NonNullable<CalendarProps['markedDates']> {
  if (!start) return {};
  if (mode === 'single' || !end) return { [start]: { selected: true, selectedColor: primary, selectedTextColor: text, startingDay: mode === 'range', endingDay: mode === 'range', color: primary, textColor: text } };
  const marks: NonNullable<CalendarProps['markedDates']> = {};
  const cursor = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  while (cursor <= last) { const key = cursor.toISOString().slice(0, 10); marks[key] = { color: key === start || key === end ? primary : range, textColor: key === start || key === end ? text : undefined, startingDay: key === start, endingDay: key === end }; cursor.setDate(cursor.getDate() + 1); }
  return marks;
}
