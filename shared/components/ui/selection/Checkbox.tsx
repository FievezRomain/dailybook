import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { selectionColors } from './selectionStyles';

export type CheckboxValue = boolean | 'indeterminate';

export interface CheckboxProps {
  value: CheckboxValue;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
  testID?: string;
}

export function Checkbox({ value, onValueChange, accessibilityLabel, disabled = false, testID }: CheckboxProps) {
  const { colors } = useAppTheme();
  const selected = value === true || value === 'indeterminate';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value === 'indeterminate' ? 'mixed' : value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(value !== true)}
      testID={testID}
      style={({ pressed }) => {
        const visual = selectionColors(colors, selected, disabled ? 'disabled' : pressed ? 'pressed' : 'default');
        return {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: visual.halo,
          alignItems: 'center',
          justifyContent: 'center',
        };
      }}
    >
      {({ pressed }) => {
        const visual = selectionColors(colors, selected, disabled ? 'disabled' : pressed ? 'pressed' : 'default');
        return (
          <View
            style={{
              width: componentTokens.selection.visualSize,
              height: componentTokens.selection.visualSize,
              borderRadius: radii.xs,
              borderWidth: 2,
              borderColor: visual.border,
              backgroundColor: visual.control,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selected ? (
              <MaterialCommunityIcons
                name={value === 'indeterminate' ? 'minus' : 'check'}
                size={12}
                color={visual.mark}
              />
            ) : null}
          </View>
        );
      }}
    </Pressable>
  );
}
