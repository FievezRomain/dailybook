import type { VascoColors } from '../../../../theme/semantic';
import type { VascoIconName } from '../icons';

export type EventCardType = 'care' | 'appointment' | 'walk' | 'training' | 'competition' | 'expense' | 'other';
export const eventTypePresentation = {
  care: { label: 'Soins', color: 'eventSoins', icon: 'medical' },
  appointment: { label: 'Rendez-vous médical', color: 'eventRdv', icon: 'stethoscope' },
  walk: { label: 'Balade', color: 'eventBalade', icon: 'compass' },
  training: { label: 'Entraînement', color: 'eventEntrainement', icon: 'tracking' },
  competition: { label: 'Concours', color: 'eventConcours', icon: 'trophy' },
  expense: { label: 'Dépense', color: 'eventDepense', icon: 'expense' },
  other: { label: 'Autre', color: 'eventAutre', icon: 'circleCheck' },
} as const satisfies Record<EventCardType, { label: string; color: keyof VascoColors; icon: VascoIconName }>;
export function resolveEventVisual(colors: VascoColors, type: EventCardType): { color: string; icon: VascoIconName } {
  const presentation = eventTypePresentation[type];
  return { color: colors[presentation.color], icon: presentation.icon };
}
export function clampProgress(value: number) { return Math.min(1, Math.max(0, value)); }
