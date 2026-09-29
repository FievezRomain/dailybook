import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons/Icon';
import type { VascoIconName } from '../icons/iconRegistry';
import { getButtonMetrics, resolveButtonVisualState, type ButtonSize } from './buttonStyles';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface IconButtonProps {
  icon: VascoIconName;
  accessibilityLabel: string;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  testID,
}: IconButtonProps) {
  const { colors } = useAppTheme();
  const dimension = getButtonMetrics(size).height;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => {
        const visual = resolveButtonVisualState(colors, variant, pressed, disabled);
        return [
          {
            width: dimension,
            height: dimension,
            minWidth: dimension,
            minHeight: dimension,
            borderRadius: radii.pill,
            borderWidth: componentTokens.button.stroke,
            borderColor: visual.borderColor,
            backgroundColor: visual.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const visual = resolveButtonVisualState(colors, variant, pressed, disabled);
        return <Icon name={icon} size="md" color={visual.textColor} />;
      }}
    </Pressable>
  );
}
