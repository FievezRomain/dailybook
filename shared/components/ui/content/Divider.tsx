import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export function Divider({ orientation = 'horizontal', style }: DividerProps) {
  const { colors } = useAppTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        orientation === 'horizontal'
          ? { width: '100%', height: 1, backgroundColor: colors.border }
          : { width: 1, height: '100%', backgroundColor: colors.border },
        style,
      ]}
    />
  );
}
