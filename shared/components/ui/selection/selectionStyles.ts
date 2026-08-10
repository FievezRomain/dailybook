import type { VascoColors } from '../../../../theme/semantic';

export type SelectionState = 'default' | 'pressed' | 'disabled';

export function selectionColors(colors: VascoColors, selected: boolean, state: SelectionState) {
  if (state === 'disabled') {
    return {
      control: colors.surfaceDim,
      border: colors.border,
      mark: colors.textDisabled,
      halo: colors.transparent,
    };
  }
  return {
    control: selected ? (state === 'pressed' ? colors.primaryDark : colors.primary) : colors.transparent,
    border: selected ? colors.primary : colors.border,
    mark: colors.textOnPrimary,
    halo: state === 'pressed' ? colors.surfaceVariant : colors.transparent,
  };
}
