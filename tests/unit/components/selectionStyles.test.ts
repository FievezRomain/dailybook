import { darkColors, lightColors } from '../../../theme/semantic';
import { selectionColors } from '../../../shared/components/ui/selection/selectionStyles';

describe('Vasco selection controls', () => {
  it('uses the primary token when selected', () => {
    expect(selectionColors(lightColors, true, 'default').control).toBe(lightColors.primary);
  });

  it('uses a visible pressed halo', () => {
    expect(selectionColors(darkColors, false, 'pressed').halo).toBe(darkColors.surfaceVariant);
  });

  it('uses disabled semantic colors', () => {
    const disabled = selectionColors(lightColors, true, 'disabled');
    expect(disabled.control).toBe(lightColors.surfaceDim);
    expect(disabled.mark).toBe(lightColors.textDisabled);
  });
});
