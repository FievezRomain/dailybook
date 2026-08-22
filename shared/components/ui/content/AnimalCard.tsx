import { Image } from 'expo-image';
import { getCachedImageSource } from '../../../utils/mediaCache';
import { View } from 'react-native';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainTitle } from './DomainCardParts';

export type AnimalCardLayout = 'compact' | 'featured';
export interface AnimalCardProps { name: string; details: string; nextAction?: string; imageUrl?: string | null; layout?: AnimalCardLayout; onPress?: () => void; testID?: string }
export function AnimalCard({ name, details, nextAction, imageUrl, layout = 'compact', onPress, testID }: AnimalCardProps) { const { colors } = useAppTheme(); const featured = layout === 'featured'; const photo = <View style={{ width: featured ? 140 : 80, height: featured ? 118 : 80, overflow: 'hidden', borderRadius: featured ? 14 : radii.lg, backgroundColor: colors.primaryLight }}>{imageUrl ? <Image source={getCachedImageSource(imageUrl)} cachePolicy="memory-disk" contentFit="cover" accessibilityLabel={`Photo de ${name}`} style={{ flex: 1 }} /> : null}</View>; return <Card onPress={onPress} accessibilityLabel={`${name}, ${details}`} testID={testID} style={{ width: featured ? 164 : '100%', maxWidth: featured ? 164 : 344, height: featured ? 220 : 104, flexDirection: featured ? 'column' : 'row', padding: 12, gap: 12 }}>{photo}<View style={{ flex: featured ? undefined : 1, gap: 3 }}><DomainTitle>{name}</DomainTitle><DomainBody numberOfLines={1}>{details}</DomainBody>{nextAction ? <DomainCaption color={colors.primaryDark}>{nextAction}</DomainCaption> : null}</View></Card>; }
