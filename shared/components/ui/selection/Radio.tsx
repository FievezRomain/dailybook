import { Pressable, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { selectionColors } from './selectionStyles';

export interface RadioProps {
  selected: boolean;
  onSelect: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  testID?: string;
}

export function Radio({ selected, onSelect, accessibilityLabel, disabled = false, testID }: RadioProps) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onSelect}
      testID={testID}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: selectionColors(colors, selected, disabled ? 'disabled' : pressed ? 'pressed' : 'default').halo,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {({ pressed }) => {
        const visual = selectionColors(colors, selected, disabled ? 'disabled' : pressed ? 'pressed' : 'default');
        return (
          <View
            style={{
              width: componentTokens.selection.visualSize,
              height: componentTokens.selection.visualSize,
              borderRadius: radii.full,
              borderWidth: 2,
              borderColor: selected ? visual.control : visual.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selected ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: visual.control }} /> : null}
          </View>
        );
      }}
    </Pressable>
  );
}
