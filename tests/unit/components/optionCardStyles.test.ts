import { resolveOptionCardVisual } from '../../../shared/components/ui/forms/optionCardStyles';
import { lightColors } from '../../../theme/semantic';

describe('resolveOptionCardVisual', () => {
  it('uses the selected surface and focus border', () => {
    expect(resolveOptionCardVisual(lightColors, true, false, false)).toMatchObject({
      backgroundColor: lightColors.surfaceVariant,
      borderColor: lightColors.borderFocus,
      controlColor: lightColors.primary,
    });
  });

  it('uses disabled colors before interaction states', () => {
    expect(resolveOptionCardVisual(lightColors, true, true, true)).toMatchObject({
      backgroundColor: lightColors.surfaceDim,
      textColor: lightColors.textDisabled,
      subtitleColor: lightColors.textDisabled,
      controlColor: lightColors.textDisabled,
    });
  });
});
