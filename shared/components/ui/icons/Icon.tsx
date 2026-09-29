import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { materialTokens } from '../../../../theme/materials';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { iconRegistry, type VascoIconName } from './iconRegistry';

export type IconSize = keyof typeof materialTokens.size.icon;

export interface IconProps {
  name: VascoIconName;
  size?: IconSize;
  color?: string;
  decorative?: boolean;
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 'md',
  color,
  decorative = true,
  accessibilityLabel,
}: IconProps) {
  const { colors } = useAppTheme();
  const dimension = materialTokens.size.icon[size];

  if (!decorative && !accessibilityLabel) {
    throw new Error(`Vasco Icon "${name}" requires an accessibilityLabel when it is not decorative.`);
  }

  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      style={{ width: dimension, height: dimension, alignItems: 'center', justifyContent: 'center' }}
    >
      <MaterialCommunityIcons
        name={iconRegistry[name]}
        size={dimension}
        color={color ?? colors.textPrimary}
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}
