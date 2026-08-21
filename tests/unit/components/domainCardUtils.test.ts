import { clampProgress, resolveEventVisual } from '../../../shared/components/ui/content/domainCardUtils';
import { lightColors } from '../../../theme/semantic';

describe('domain card utilities', () => {
  it('maps every event type to its semantic color and icon', () => {
    expect(resolveEventVisual(lightColors, 'care')).toEqual({ color: lightColors.eventSoins, icon: 'medical' });
    expect(resolveEventVisual(lightColors, 'appointment')).toEqual({ color: lightColors.eventRdv, icon: 'calendar' });
    expect(resolveEventVisual(lightColors, 'walk')).toEqual({ color: lightColors.eventBalade, icon: 'animals' });
    expect(resolveEventVisual(lightColors, 'training')).toEqual({ color: lightColors.eventEntrainement, icon: 'tracking' });
    expect(resolveEventVisual(lightColors, 'competition')).toEqual({ color: lightColors.eventConcours, icon: 'trophy' });
    expect(resolveEventVisual(lightColors, 'expense')).toEqual({ color: lightColors.eventDepense, icon: 'expense' });
    expect(resolveEventVisual(lightColors, 'other')).toEqual({ color: lightColors.eventAutre, icon: 'more' });
  });
  it('clamps progress between zero and one', () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(0.6)).toBe(0.6);
    expect(clampProgress(2)).toBe(1);
  });
});
