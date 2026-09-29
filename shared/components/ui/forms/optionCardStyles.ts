import type { VascoColors } from '../../../../theme/semantic';

export function resolveOptionCardVisual(
  colors: VascoColors,
  selected: boolean,
  pressed: boolean,
  disabled: boolean,
) {
  return {
    backgroundColor: disabled
      ? colors.surfaceDim
      : selected || pressed
        ? colors.surfaceVariant
        : colors.surface,
    borderColor: selected ? colors.borderFocus : colors.border,
    textColor: disabled ? colors.textDisabled : colors.textPrimary,
    subtitleColor: disabled ? colors.textDisabled : colors.textSecondary,
    controlColor: disabled ? colors.textDisabled : colors.primary,
  } as const;
}
