import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { MarkedDates } from 'react-native-calendars/src/types';
import { CalendarFilter } from '../models/CalendarFilter';
import { buildMarkedDates } from '../../../shared/utils/EventUtils';
import { useEventsQuery, EVENTS_KEY } from '../../../hooks/queries/useEventsQuery';
import { GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import type { Event } from '../../../models/Event';

type CalendarColors = {
  primary: string;
  accent: string;
  tertiary: string;
  text: string;
  neutral: string;
  error: string;
  quaternary: string;
  onSurface: string;
};

const INITIAL_DATE = new Date().toISOString().split('T')[0];

export type UseCalendarLogicReturn = {
  events: Event[];
  eventsCurrentDateSelected: Event[];
  filteredEvents: Event[];
  marked: MarkedDates;
  filter: CalendarFilter | null;
  selectedDate: string;
  refreshing: boolean;
  isLoadingEvents: boolean;
  isErrorEvents: boolean;
  setFilter: (filter: CalendarFilter | null) => void;
  setSelectedDate: (date: string) => void;
  onRefresh: () => Promise<void>;
  retryEvents: () => void;
  onDayPress: (date: string) => void;
  handleSearch: (query: string) => void;
  deleteSearchText: () => void;
};

export function useCalendarLogic(colors: CalendarColors): UseCalendarLogicReturn {
  const queryClient = useQueryClient();
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    refetch: refetchEvents,
  } = useEventsQuery();
  const [eventsCurrentDateSelected, setEventsCurrentDateSelected] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [marked, setMarked] = useState<MarkedDates>({});
  const [filter, setFilter] = useState<CalendarFilter | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(INITIAL_DATE);
  const [refreshing, setRefreshing] = useState(false);

  const changeEventsCurrentDateSelected = useCallback((date: string) => {
    setEventsCurrentDateSelected(events.filter((item) => item.dateevent === date));
  }, [events]);

  useEffect(() => {
    setMarked(buildMarkedDates(events, selectedDate, colors, true) as MarkedDates);
    changeEventsCurrentDateSelected(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  useEffect(() => {
    if (filter) setFilteredEvents(filter.filter(events));
  }, [filter, events]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    await queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
    setRefreshing(false);
  }, [queryClient]);

  const retryEvents = useCallback(() => {
    void refetchEvents();
  }, [refetchEvents]);

  const onDayPress = useCallback((day: string) => {
    setFilter(null);
    setSelectedDate(day);
    setMarked((prev) => {
      const next: MarkedDates = { ...prev };
      Object.values(next).forEach((v) => {
        if (v) (v as { selected?: boolean }).selected = false;
      });
      if (!next[day]) {
        next[day] = {
          selected: true,
          disableTouchEvent: false,
          selectedColor: colors.primary,
          selectedTextColor: 'white',
          dots: [],
        };
      } else {
        (next[day] as { selected?: boolean }).selected = true;
      }
      return next;
    });
    setEventsCurrentDateSelected(events.filter((item) => item.dateevent === day));
  }, [colors.primary, events]);

  const handleSearch = useCallback((query: string) => {
    setFilter((current) => {
      if (current) return new CalendarFilter(current.date, current.animals, current.eventType, query);
      return new CalendarFilter(undefined, undefined, undefined, query);
    });
  }, []);

  const deleteSearchText = useCallback(() => {
    setFilter((current) => {
      if (!current) return current;
      if (!current.date && !current.animals && !current.eventType) return null;
      return new CalendarFilter(current.date, current.animals, current.eventType, undefined);
    });
  }, []);

  return {
    events,
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
  };
}

export { INITIAL_DATE };
