import { View } from 'react-native';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Avatar } from '../content/Avatar';
import { Icon } from '../icons';

interface AnimalProvenanceAvatarProps {
  name: string;
  imageUrl?: string | null;
  sharedFromGroup?: boolean;
  size?: number;
}

export function AnimalProvenanceAvatar({ name, imageUrl, sharedFromGroup = false, size = 40 }: AnimalProvenanceAvatarProps) {
  const { colors } = useAppTheme();
  return <View>
    <Avatar initials={name} imageUrl={imageUrl} accessibilityLabel={`Photo de ${name}`} size={size} decorative />
    {sharedFromGroup ? <View accessibilityElementsHidden style={{ position: 'absolute', right: -3, bottom: -1, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, borderWidth: 2, borderColor: colors.surface, backgroundColor: colors.primaryDark }}><Icon name="group" size="sm" color={colors.textOnPrimary} /></View> : null}
  </View>;
}
