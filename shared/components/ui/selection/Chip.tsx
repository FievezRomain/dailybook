import { Pressable, Text } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons/Icon';
import type { VascoIconName } from '../icons/iconRegistry';

export type ChipSize = 'small' | 'medium';
export type ChipVariant = 'filled' | 'outlined' | 'tonal';

export interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: VascoIconName;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export function Chip({
  label,
  selected,
  onPress,
  variant = 'filled',
  size = 'small',
  icon,
  disabled = false,
  accessibilityLabel,
  testID,
}: ChipProps) {
  const { colors } = useAppTheme();
  const height = size === 'small' ? 44 : 48;
  const fontSize = size === 'small' ? 12 : 14;
  const paddingHorizontal = size === 'small' ? 12 : 16;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => {
        const isPressed = pressed && !disabled;
        let backgroundColor: string = colors.primaryLight;
        let borderColor: string = colors.transparent;

        if (disabled) backgroundColor = variant === 'outlined' ? colors.transparent : colors.surfaceDim;
        else if (selected) backgroundColor = variant === 'filled' ? colors.primaryDark : colors.primaryLight;
        else if (variant === 'outlined') backgroundColor = isPressed ? colors.surfaceVariant : colors.transparent;
        else if (variant === 'tonal') backgroundColor = isPressed ? colors.surfaceDim : colors.surfaceVariant;
        else if (isPressed) backgroundColor = colors.primary;

        if (variant === 'outlined') borderColor = selected ? colors.primary : isPressed ? colors.primaryDark : colors.border;
        else if (variant === 'tonal' && selected) borderColor = colors.borderFocus;
        else if (variant === 'filled' && selected) borderColor = colors.primaryDark;

        return {
          width: 112,
          height,
          minHeight: height,
          paddingHorizontal,
          borderRadius: radii.pill,
          borderWidth: componentTokens.button.stroke,
          borderColor,
          backgroundColor,
          flexDirection: 'row',
          gap: componentTokens.button.gap,
          alignItems: 'center',
          justifyContent: 'center',
        };
      }}
    >
      {({ pressed }) => {
        const textColor = disabled
          ? colors.textDisabled
          : variant === 'filled' && (selected || pressed)
            ? colors.textOnPrimary
            : variant === 'tonal' && !selected && !pressed
              ? colors.textPrimary
              : selected || pressed
                ? colors.primaryDark
                : colors.primary;
        return (
          <>
            {icon ? <Icon name={icon} size="sm" color={textColor} /> : null}
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={{ color: textColor, fontFamily: typography.fonts.medium, fontSize }}
            >
              {label}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}
