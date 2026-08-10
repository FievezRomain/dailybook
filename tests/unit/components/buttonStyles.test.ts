import { darkColors, lightColors } from '../../../theme/semantic';
import {
  getButtonMetrics,
  resolveButtonVisualState,
} from '../../../shared/components/ui/actions/buttonStyles';

describe('Vasco Button contract', () => {
  it('matches the three Figma sizes', () => {
    expect(getButtonMetrics('small')).toEqual({ height: 44, paddingHorizontal: 12, fontSize: 12 });
    expect(getButtonMetrics('medium')).toEqual({ height: 48, paddingHorizontal: 16, fontSize: 14 });
    expect(getButtonMetrics('large')).toEqual({ height: 56, paddingHorizontal: 24, fontSize: 16 });
  });

  it('resolves primary default and pressed states', () => {
    expect(resolveButtonVisualState(lightColors, 'primary', false, false)).toEqual({
      backgroundColor: lightColors.primary,
      borderColor: lightColors.transparent,
      textColor: lightColors.textOnPrimary,
    });
    expect(resolveButtonVisualState(darkColors, 'primary', true, false).backgroundColor).toBe(darkColors.primaryDark);
  });

  it('resolves secondary and ghost without hardcoded colors', () => {
    expect(resolveButtonVisualState(lightColors, 'secondary', false, false).borderColor).toBe(lightColors.primary);
    expect(resolveButtonVisualState(lightColors, 'ghost', false, false).borderColor).toBe(lightColors.transparent);
    expect(resolveButtonVisualState(lightColors, 'ghost', true, false).backgroundColor).toBe(lightColors.surfaceVariant);
  });

  it('uses the common disabled treatment', () => {
    const disabled = resolveButtonVisualState(darkColors, 'secondary', false, true);
    expect(disabled.textColor).toBe(darkColors.textDisabled);
    expect(disabled.borderColor).toBe(darkColors.border);
  });
});
