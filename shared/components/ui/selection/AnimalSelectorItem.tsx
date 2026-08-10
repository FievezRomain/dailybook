import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';

export interface AnimalSelectorItemProps {
  name: string;
  imageUrl?: string | null;
  selected: boolean;
  onPress: () => void;
  selectionRole?: 'checkbox' | 'radio';
  disabled?: boolean;
  testID?: string;
}

export function AnimalSelectorItem({ name, imageUrl, selected, onPress, selectionRole = 'checkbox', disabled = false, testID }: AnimalSelectorItemProps) {
  const { colors } = useAppTheme();
  const metrics = componentTokens.content.animalSelector;
  const picture = <View style={{ width: metrics.imageSize, height: metrics.imageSize, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, backgroundColor: colors.primaryLight }}>{imageUrl ? <Image source={{ uri: imageUrl }} contentFit="cover" accessibilityElementsHidden style={{ width: '100%', height: '100%' }} /> : <Icon name="animals" size="lg" color={colors.primaryDark} />}</View>;
  const ring = selected ? <LinearGradient colors={[colors.primaryLight, colors.primary, colors.primaryDark]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={{ width: metrics.ringSize, height: metrics.ringSize, padding: 3, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full }}><View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, backgroundColor: colors.surface }}>{picture}</View></LinearGradient> : <View style={{ width: metrics.ringSize, height: metrics.ringSize, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, backgroundColor: colors.surfaceVariant }}>{picture}</View>;
  return <Pressable accessibilityRole={selectionRole} accessibilityLabel={name} accessibilityState={{ selected, checked: selected, disabled }} disabled={disabled} onPress={onPress} testID={testID} style={({ pressed }) => ({ width: metrics.width, minHeight: metrics.height, alignItems: 'center', gap: 10, opacity: disabled ? 0.45 : pressed ? 0.84 : 1 })}>{ring}<Text numberOfLines={1} style={{ width: metrics.width, color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20, letterSpacing: 0.1, textAlign: 'center' }}>{name}</Text></Pressable>;
}
