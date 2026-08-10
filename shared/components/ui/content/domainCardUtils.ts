import type { VascoColors } from '../../../../theme/semantic';
import type { VascoIconName } from '../icons';

export type EventCardType = 'care' | 'appointment' | 'walk' | 'training' | 'competition' | 'expense' | 'other';
export function resolveEventVisual(colors: VascoColors, type: EventCardType): { color: string; icon: VascoIconName } {
  const values = {
    care: { color: colors.eventSoins, icon: 'medical' }, appointment: { color: colors.eventRdv, icon: 'calendar' }, walk: { color: colors.eventBalade, icon: 'animals' }, training: { color: colors.eventEntrainement, icon: 'tracking' }, competition: { color: colors.eventConcours, icon: 'trophy' }, expense: { color: colors.eventDepense, icon: 'expense' }, other: { color: colors.eventAutre, icon: 'more' },
  } as const;
  return values[type];
}
export function clampProgress(value: number) { return Math.min(1, Math.max(0, value)); }
