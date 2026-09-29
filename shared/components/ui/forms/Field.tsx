import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface FieldProps {
  label: string;
  labelHidden?: boolean;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  focused?: boolean;
  filled?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Field({
  label,
  labelHidden = false,
  required = false,
  helperText,
  errorMessage,
  disabled = false,
  focused = false,
  filled = false,
  children,
  style,
  testID,
}: FieldProps) {
  const { colors } = useAppTheme();
  const statusColor = disabled
    ? colors.textDisabled
    : errorMessage
      ? colors.error
      : focused
        ? colors.primary
        : filled
          ? colors.textPrimary
          : colors.textSecondary;

  return (
    <View style={[{ gap: spacing.xs, width: '100%' }, style]} testID={testID}>
      {labelHidden ? null : <Text
        style={{
          color: statusColor,
          fontFamily: typography.fonts.medium,
          fontSize: typography.sizes.sm,
          lineHeight: typography.lineHeights.tight,
        }}
      >
        {label}{required ? ' *' : ''}
      </Text>}
      {children}
      {(errorMessage || helperText) ? (
        <Text
          accessibilityLiveRegion={errorMessage ? 'polite' : 'none'}
          style={{
            color: errorMessage ? colors.error : disabled ? colors.textDisabled : colors.textSecondary,
            fontFamily: typography.fonts.regular,
            fontSize: typography.sizes.xs,
            lineHeight: typography.lineHeights.tight,
          }}
        >
          {errorMessage ?? helperText}
        </Text>
      ) : null}
    </View>
  );
}
