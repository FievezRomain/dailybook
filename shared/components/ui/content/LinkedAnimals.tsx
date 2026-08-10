import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Avatar } from './Avatar';
import { getLinkedAnimalsPresentation, type LinkedAnimalData } from './linkedAnimalsUtils';

export interface LinkedAnimalsProps { animals: readonly LinkedAnimalData[]; maxVisible?: number; style?: StyleProp<ViewStyle>; testID?: string }

export function LinkedAnimals({ animals, maxVisible = 2, style, testID }: LinkedAnimalsProps) {
  const { colors } = useAppTheme();
  const { visible, remaining, label, accessibilityLabel } = getLinkedAnimalsPresentation(animals, maxVisible);
  if (!animals.length) return null;
  return <View accessible accessibilityRole="summary" accessibilityLabel={accessibilityLabel} testID={testID} style={[{ minHeight: 22, flexDirection: 'row', alignItems: 'center', gap: 6 }, style]}><View accessibilityElementsHidden style={{ flexDirection: 'row', alignItems: 'center' }}>{visible.map((animal, index) => <View key={animal.id} style={{ marginLeft: index ? -componentTokens.content.linkedAnimalOverlap : 0, zIndex: index }}><Avatar initials={animal.initials ?? ''} imageUrl={animal.imageUrl} accessibilityLabel={animal.name} decorative size={componentTokens.content.linkedAnimalSize} backgroundColor={animal.color} borderColor={colors.surface} /></View>)}{remaining > 0 ? <View style={{ width: componentTokens.content.linkedAnimalSize, height: componentTokens.content.linkedAnimalSize, marginLeft: -componentTokens.content.linkedAnimalOverlap, zIndex: visible.length, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.surface, borderRadius: radii.full, backgroundColor: colors.surfaceVariant }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16 }}>+{remaining}</Text></View> : null}</View><Text numberOfLines={1} style={{ flexShrink: 1, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, lineHeight: 16, letterSpacing: 0.1 }}>{label}</Text></View>;
}
