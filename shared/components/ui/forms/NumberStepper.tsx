import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { Field } from './Field';
import { stepNumber } from './numberUtils';

export interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function NumberStepper({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  helperText,
  errorMessage,
  disabled = false,
  formatValue = String,
  style,
  testID,
}: NumberStepperProps) {
  const { colors } = useAppTheme();
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;
  const statusColor = disabled ? colors.textDisabled : errorMessage ? colors.error : colors.textPrimary;

  const change = (direction: -1 | 1) => {
    onChange(stepNumber(value, direction, step, min, max));
  };

  return (
    <Field
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      disabled={disabled}
      filled
      style={[{ maxWidth: componentTokens.stepper.width }, style]}
      testID={testID}
    >
      <View
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value, text: formatValue(value) }}
        accessibilityState={{ disabled }}
        accessibilityActions={[{ name: 'decrement' }, { name: 'increment' }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === 'decrement' && canDecrement) change(-1);
          if (nativeEvent.actionName === 'increment' && canIncrement) change(1);
        }}
        style={{
          height: componentTokens.stepper.height,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          borderRadius: radii.md,
          borderWidth: errorMessage ? componentTokens.field.stroke.focus : componentTokens.field.stroke.default,
          borderColor: errorMessage ? colors.error : colors.border,
          backgroundColor: errorMessage ? colors.errorSurface : disabled ? colors.surfaceDim : colors.surface,
        }}
      >
        <StepperAction
          icon="remove"
          label={`Diminuer ${label}`}
          disabled={!canDecrement}
          color={statusColor}
          onPress={() => change(-1)}
        />
        <Text
          style={{
            color: statusColor,
            fontFamily: typography.fonts.medium,
            fontSize: typography.sizes.lg,
            lineHeight: typography.lineHeights.normal,
          }}
        >
          {formatValue(value)}
        </Text>
        <StepperAction
          icon="add"
          label={`Augmenter ${label}`}
          disabled={!canIncrement}
          color={statusColor}
          onPress={() => change(1)}
        />
      </View>
    </Field>
  );
}

function StepperAction({
  icon,
  label,
  disabled,
  color,
  onPress,
}: {
  icon: 'add' | 'remove';
  label: string;
  disabled: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={0}
      style={({ pressed }) => ({
        width: componentTokens.stepper.touchTarget,
        height: componentTokens.stepper.touchTarget,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : pressed ? 0.72 : 1,
      })}
    >
      <Icon name={icon} size="sm" color={color} />
    </Pressable>
  );
}
