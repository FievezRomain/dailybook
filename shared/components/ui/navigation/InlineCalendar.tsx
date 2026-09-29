import { Calendar, LocaleConfig, type CalendarProps, type DateData } from "react-native-calendars";
import { Pressable, Text, View } from "react-native";
import { alpha } from "../../../../theme/primitives";
import { radii, spacing, typography } from "../../../../theme/scales";
import { useAppTheme } from "../../../../theme/useAppTheme";
import { Card } from "../content";

export interface InlineCalendarProps {
  current: string;
  selectedDate: string;
  markedDates?: CalendarProps["markedDates"];
  highlights?: Readonly<Record<string, readonly string[]>>;
  onSelectDate: (date: string) => void;
  onMonthChange?: (month: string) => void;
  testID?: string;
}

LocaleConfig.locales.fr = {
  monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  monthNamesShort: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."],
  dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd’hui",
};
LocaleConfig.defaultLocale = "fr";

export function InlineCalendar({ current, selectedDate, markedDates, highlights = {}, onSelectDate, onMonthChange, testID }: InlineCalendarProps) {
  const { colors } = useAppTheme();
  const selected = { ...(markedDates?.[selectedDate] ?? {}), selected: true, selectedColor: colors.primary, selectedTextColor: colors.textOnPrimary };
  const allMarks = { ...markedDates, [selectedDate]: selected };
  return (
    <Card accessibilityLabel="Calendrier" testID={testID} style={{ width: "100%", maxWidth: 360, minHeight: 337, padding: 0, borderRadius: radii.modal, shadowColor: alpha.black16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8, overflow: "hidden" }}>
      <Calendar
        current={current.slice(0, 10)}
        firstDay={1}
        enableSwipeMonths
        markingType="multi-dot"
        markedDates={allMarks}
        dayComponent={({ date, state, marking }: { date?: DateData; state?: string; marking?: { selected?: boolean; dots?: { key?: string; color?: string }[] } }) => {
          if (!date) return null;
          const highlightLabels = highlights[date.dateString] ?? [];
          const isSelected = Boolean(marking?.selected);
          const isDisabled = state === "disabled";
          const accessibilityLabel = `${new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date.dateString}T12:00:00`))}${highlightLabels.length ? `, événement marquant : ${highlightLabels.join(", ")}` : ""}`;
          return (
            <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={{ selected: isSelected, disabled: isDisabled }} disabled={isDisabled} onPress={() => onSelectDate(date.dateString)} style={{ width: 38, height: 40, alignItems: "center", justifyContent: "flex-start" }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: isSelected ? colors.primary : "transparent" }}>
                <Text style={{ color: isDisabled ? colors.textDisabled : isSelected ? colors.textOnPrimary : state === "today" ? colors.primary : colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control }}>{date.day}</Text>
                {highlightLabels.length ? <View pointerEvents="none" style={{ position: "absolute", right: 1, top: 1, width: 7, height: 7, borderRadius: radii.full, borderWidth: isSelected ? 1 : 0, borderColor: colors.surface, backgroundColor: colors.error }} /> : null}
                {marking?.dots?.length ? <View pointerEvents="none" style={{ position: "absolute", bottom: spacing.xs, flexDirection: "row", gap: 2 }}>{marking.dots.slice(0, 3).map((dot, index) => <View key={dot.key ?? index} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: dot.color ?? colors.textSecondary }} />)}</View> : null}
              </View>
            </Pressable>
          );
        }}
        onDayPress={(day: DateData) => onSelectDate(day.dateString)}
        onMonthChange={(month: DateData) => onMonthChange?.(month.dateString)}
        renderHeader={(value) => {
          const date = new Date(String(value));
          const label = Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
          return <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg }}>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>;
        }}
        theme={{ calendarBackground: colors.surface, backgroundColor: colors.surface, monthTextColor: colors.textPrimary, textSectionTitleColor: colors.textSecondary, dayTextColor: colors.textPrimary, todayTextColor: colors.primary, selectedDayBackgroundColor: colors.primary, selectedDayTextColor: colors.textOnPrimary, arrowColor: colors.textPrimary, textMonthFontFamily: typography.fonts.semiBold, textMonthFontSize: typography.sizes.lg, textDayFontFamily: typography.fonts.medium, textDayFontSize: typography.sizes.control, textDayHeaderFontFamily: typography.fonts.medium, textDayHeaderFontSize: typography.sizes.xs }}
      />
    </Card>
  );
}
