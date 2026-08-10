import { Pressable, Text } from 'react-native';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

export function TextLink({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} testID={testID} style={{ minHeight: 44, paddingHorizontal: spacing.xs, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.primary, fontFamily: typography.fonts.medium, fontSize: 12, textDecorationLine: 'underline' }}>{label}</Text></Pressable>;
}
