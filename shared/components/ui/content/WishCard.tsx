import { Pressable, View } from 'react-native';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainTitle } from './DomainCardParts';
import { Icon } from '../icons';

export type WishStatus = 'planned' | 'completed' | 'archived';
export interface WishCardProps { title: string; description: string; status: WishStatus; metadata: string; priceLabel?: string; onPress?: () => void; onMore?: () => void; testID?: string }
export function WishCard({ title, description, status, metadata, priceLabel, onPress, onMore, testID }: WishCardProps) { const { colors } = useAppTheme(); const label = status === 'completed' ? 'Réalisé' : status === 'archived' ? 'Archivé' : 'À organiser'; return <Card onPress={onPress} accessibilityLabel={`${title}, ${label}`} testID={testID} style={{ width: '100%', maxWidth: 344, gap: 7, opacity: status === 'archived' ? 0.62 : 1 }}><View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}><View style={{ flex: 1 }}><DomainTitle>{title}</DomainTitle></View><DomainCaption color={status === 'completed' ? colors.success : undefined}>{label}</DomainCaption></View><DomainBody>{description}</DomainBody>{priceLabel ? <DomainBody numberOfLines={1}>{priceLabel}</DomainBody> : null}<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><DomainCaption color={colors.primaryDark}>{metadata}</DomainCaption></View>{onMore ? <Pressable accessibilityRole="button" accessibilityLabel="Plus d’actions" onPress={onMore} hitSlop={10} style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}><Icon name="moreHorizontal" size="md" color={colors.primary} /></Pressable> : null}</View></Card>; }
