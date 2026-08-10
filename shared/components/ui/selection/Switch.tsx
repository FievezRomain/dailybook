import { Pressable, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { selectionColors } from './selectionStyles';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
  testID?: string;
}

export function Switch({ value, onValueChange, accessibilityLabel, disabled = false, testID }: SwitchProps) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      testID={testID}
      style={{ width: 52, height: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      {({ pressed }) => {
        const visual = selectionColors(colors, value, disabled ? 'disabled' : pressed ? 'pressed' : 'default');
        return (
          <View
            style={{
              width: componentTokens.switch.trackWidth,
              height: componentTokens.switch.trackHeight,
              borderRadius: radii.pill,
              borderWidth: 1,
              borderColor: visual.border,
              backgroundColor: value || disabled ? visual.control : colors.surfaceVariant,
              padding: 1,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: componentTokens.switch.thumbSize,
                height: componentTokens.switch.thumbSize,
                borderRadius: radii.pill,
                backgroundColor: value ? colors.textOnPrimary : disabled ? colors.textDisabled : colors.surface,
                alignSelf: value ? 'flex-end' : 'flex-start',
              }}
            />
          </View>
        );
      }}
    </Pressable>
  );
}
