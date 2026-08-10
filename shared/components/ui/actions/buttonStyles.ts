import { componentTokens } from '../../../../theme/componentTokens';
import type { VascoColors } from '../../../../theme/semantic';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export const buttonTypography = {
  small: 12,
  medium: 14,
  large: 16,
} as const;

export interface ButtonVisualState {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export const getButtonMetrics = (size: ButtonSize) => ({
  height: componentTokens.button.height[size],
  paddingHorizontal: componentTokens.button.paddingX[size],
  fontSize: buttonTypography[size],
});

export function resolveButtonVisualState(
  colors: VascoColors,
  variant: ButtonVariant,
  pressed: boolean,
  disabled: boolean,
): ButtonVisualState {
  if (disabled) {
    return {
      backgroundColor: variant === 'primary' || variant === 'destructive' ? colors.surfaceDim : colors.transparent,
      borderColor: variant === 'secondary' ? colors.border : colors.transparent,
      textColor: colors.textDisabled,
    };
  }

  if (variant === 'primary') {
    return {
      backgroundColor: pressed ? colors.primaryDark : colors.primary,
      borderColor: colors.transparent,
      textColor: colors.textOnPrimary,
    };
  }

  if (variant === 'destructive') {
    return {
      backgroundColor: pressed ? colors.primaryDark : colors.error,
      borderColor: colors.transparent,
      textColor: colors.textOnPrimary,
    };
  }

  return {
    backgroundColor: pressed ? colors.surfaceVariant : colors.transparent,
    borderColor: variant === 'secondary' ? (pressed ? colors.primaryDark : colors.primary) : colors.transparent,
    textColor: pressed ? colors.primaryDark : colors.primary,
  };
}
