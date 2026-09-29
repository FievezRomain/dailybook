import { Text, View } from 'react-native';
import { palette } from '../../../../theme/primitives';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface ChartTooltipProps { label: string; value: string; testID?: string }
export function ChartTooltip({ label, value, testID }: ChartTooltipProps) { const { colors } = useAppTheme(); return <View accessible accessibilityRole="summary" accessibilityLabel={`${label}, ${value}`} testID={testID} style={{ alignSelf: 'flex-end', gap: 2, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.textPrimary, shadowColor: palette.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 }}><Text style={{ color: colors.backgroundPaper, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>{label}</Text><Text style={{ color: colors.backgroundPaper, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20 }}>{value}</Text></View>; }
