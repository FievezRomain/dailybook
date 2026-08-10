import { ActivityIndicator, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { useAppTheme } from '../../../../theme/useAppTheme';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerTone = 'primary' | 'onPrimary';

export interface SpinnerProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  accessibilityLabel?: string;
}

export function Spinner({ size = 'small', tone = 'primary', accessibilityLabel = 'Chargement' }: SpinnerProps) {
  const { colors } = useAppTheme();
  const dimension = componentTokens.spinner.size[size];
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={{ width: dimension, height: dimension, alignItems: 'center', justifyContent: 'center' }}
    >
      <ActivityIndicator size={size === 'large' ? 'large' : 'small'} color={tone === 'onPrimary' ? colors.textOnPrimary : colors.primary} />
    </View>
  );
}
