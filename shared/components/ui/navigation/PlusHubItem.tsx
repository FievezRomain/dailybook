import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Material } from '../../../../theme/materials';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from '../content/Card';
import { Icon, type VascoIconName } from '../icons';

export interface PlusHubItemProps {
  title: string;
  description: string;
  icon: VascoIconName;
  onPress: () => void;
  material?: Material;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function PlusHubItem({ title, description, icon, onPress, material = 'solid', style, testID }: PlusHubItemProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={description} onPress={onPress} testID={testID} style={[{ flexBasis: '47%', flexGrow: 1, minWidth: 150, maxWidth: 171 }, style]}>
      <Card material={material} style={{ height: 148, padding: spacing.md, justifyContent: 'flex-start', gap: spacing.sm }}>
        <View style={{ width: 44, height: 44, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}>
          <Icon name={icon} size="lg" color={colors.primaryDark} />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 18 }}>{description}</Text>
        </View>
      </Card>
    </Pressable>
  );
}