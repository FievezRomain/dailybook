import { Pressable, View } from 'react-native';
import type { Material } from '../../../../theme/materials';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainTitle } from './DomainCardParts';
import { Icon } from '../icons';

export type WishStatus = 'planned' | 'completed' | 'archived';
export interface WishCardProps { title: string; description?: string; status: WishStatus; metadata?: string; priceLabel?: string; material?: Material; onPress?: () => void; onMore?: () => void; testID?: string }
export function WishCard({ title, description, status, metadata, priceLabel, material = 'solid', onPress, onMore, testID }: WishCardProps) {
  const { colors } = useAppTheme(); const label = status === 'completed' ? 'Réalisé' : status === 'archived' ? 'Archivé' : 'À organiser';
  return <Card material={material} onPress={onPress} accessibilityLabel={`${title}, ${label}`} testID={testID} style={{ width: '100%', gap: 7, opacity: status === 'archived' ? 0.62 : 1 }}><View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}><View style={{ flexGrow: 1, flexShrink: 1, minWidth: 72 }}><DomainTitle numberOfLines={0}>{title}</DomainTitle></View><DomainCaption numberOfLines={0} color={status === 'completed' ? colors.success : undefined}>{label}</DomainCaption></View>{description ? <DomainBody numberOfLines={0}>{description}</DomainBody> : null}{priceLabel ? <DomainBody numberOfLines={0}>{priceLabel}</DomainBody> : null}{metadata || onMore ? <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start' }}><View style={{ flex: 1 }}>{metadata ? <DomainCaption numberOfLines={0} color={colors.primaryDark}>{metadata}</DomainCaption> : null}</View>{onMore ? <Pressable accessibilityRole="button" accessibilityLabel="Plus d’actions" onPress={onMore} hitSlop={10} style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}><Icon name="moreHorizontal" size="md" color={colors.primary} /></Pressable> : null}</View> : null}</Card>;
}
