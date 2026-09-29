import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { normalizeProgress } from './progressUtils';

export interface ProgressStepsProps { current: number; total: 3 | 4; style?: StyleProp<ViewStyle>; testID?: string }
export function ProgressSteps({ current, total, style, testID }: ProgressStepsProps) {
  const { colors } = useAppTheme();
  const progress = normalizeProgress(current, total);
  return <View accessible accessibilityRole="progressbar" accessibilityLabel={`Étape ${progress.current} sur ${progress.total}`} accessibilityValue={{ min: 1, max: progress.total, now: progress.current }} style={[{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, style]} testID={testID}>{Array.from({ length: progress.total }, (_, offset) => { const step = offset + 1; const completed = step < progress.current; const active = step === progress.current; return <View key={step} style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ width: componentTokens.navigation.step.size, height: componentTokens.navigation.step.size, borderRadius: radii.full, borderWidth: active ? 2 : 1, borderColor: completed || active ? colors.primary : colors.border, backgroundColor: completed ? colors.primary : active ? colors.surface : colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: completed ? colors.textOnPrimary : active ? colors.primary : colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{step}</Text></View>{step < progress.total ? <View style={{ width: componentTokens.navigation.step.connectorMaxWidth, height: componentTokens.navigation.step.connectorHeight, borderRadius: radii.xs, backgroundColor: step < progress.current ? colors.primary : colors.surfaceDim }} /> : null}</View>; })}</View>;
}
