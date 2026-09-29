type EventColors = {
  accent: string;
  tertiary: string;
  primary: string;
  text: string;
  neutral: string;
  error: string;
  quaternary: string;
  onSurface: string;
};

export function getEventTypeDot(eventType: string, colors: EventColors): { color: string } {
  const map: Record<string, string> = {
    balade: colors.accent,
    entrainement: colors.tertiary,
    concours: colors.primary,
    rdv: colors.text,
    soins: colors.neutral,
    autre: colors.error,
    depense: colors.quaternary,
  };
  return { color: map[eventType] ?? colors.onSurface };
}

export function convertDateToText(date: string): string {
  const dateObject = new Date(date);
  if (isNaN(dateObject.getTime())) return 'Date invalide';
  const text = dateObject.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildMarkedDates(
  events: Array<{ dateevent: string; eventtype: string }>,
  selectedDate: string,
  colors: EventColors,
  isInit: boolean,
): Record<string, unknown> {
  const newMarked: Record<string, any> = {};
  events.forEach((item) => {
    const dateString = item.dateevent;
    const dot = getEventTypeDot(item.eventtype, colors);
    if (newMarked[dateString]) {
      if (!newMarked[dateString].dots.some((d: any) => d.color === dot.color)) {
        newMarked[dateString].dots.push(dot);
      }
    } else {
      newMarked[dateString] = {
        selected: false,
        disableTouchEvent: false,
        selectedColor: colors.accent,
        selectedTextColor: 'white',
        dots: [dot],
      };
    }
  });
  if (isInit) {
    if (!newMarked[selectedDate]) {
      newMarked[selectedDate] = {
        selected: true,
        disableTouchEvent: false,
        selectedColor: colors.accent,
        selectedTextColor: 'white',
        dots: [],
      };
    } else {
      newMarked[selectedDate].selected = true;
    }
  }
  return newMarked;
}
