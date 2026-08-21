import { Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { IconButton } from '../actions';

export interface PeriodRangeNavigatorProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  testID?: string;
}

export function PeriodRangeNavigator({ label, onPrevious, onNext, nextDisabled = false, testID }: PeriodRangeNavigatorProps) {
  const { colors } = useAppTheme();
  return <View testID={testID} accessibilityLabel={`Période affichée : ${label}`} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
    <IconButton icon="previous" accessibilityLabel="Période précédente" variant="ghost" size="small" onPress={onPrevious} />
    <Text style={{ minWidth: 128, flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, textAlign: 'center', textTransform: 'capitalize' }}>{label}</Text>
    <IconButton icon="next" accessibilityLabel="Période suivante" variant="ghost" size="small" disabled={nextDisabled} onPress={onNext} />
  </View>;
}
