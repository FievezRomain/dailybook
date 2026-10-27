import { Text, View } from 'react-native';
import { Card, Icon } from '../../../shared/components/ui';
import { componentTokens } from '../../../theme/componentTokens';
import type { Material } from '../../../theme/materials';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';

interface StatisticTileProps {
  label: string;
  value: string;
  supporting: string;
  accent: string;
  material?: Material;
  onPress?: () => void;
  testID?: string;
}

export function StatisticTile({ label, value, supporting, accent, material = 'solid', onPress, testID }: StatisticTileProps) {
  const { colors } = useAppTheme();
  return <Card material={material} accessibilityLabel={`${label}, ${value}, ${supporting}`} accessibilityHint={onPress ? `Ouvre le détail des statistiques ${label.toLocaleLowerCase('fr-FR')}` : undefined} onPress={onPress} testID={testID} style={{ width: '100%', height: componentTokens.content.statisticCard.overviewHeight, gap: 7 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><View style={{ width: 10, height: 10, borderRadius: radii.full, backgroundColor: accent }} /><Text numberOfLines={1} style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{label}</Text>{onPress ? <Icon name="next" size="sm" color={colors.textSecondary} /> : null}</View>
    <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: 19, lineHeight: 27 }}>{value}</Text>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs, lineHeight: 15 }}>{supporting}</Text>
  </Card>;
}
