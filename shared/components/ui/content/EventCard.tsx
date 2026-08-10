import { Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { Card } from './Card';
import { DomainBody, DomainCaption } from './DomainCardParts';
import { resolveEventVisual, type EventCardType } from './domainCardUtils';
import { LinkedAnimals } from './LinkedAnimals';
import type { LinkedAnimalData } from './linkedAnimalsUtils';

export interface EventCardProps { type: EventCardType; time: string; duration?: string; title: string; description?: string; animals?: readonly LinkedAnimalData[]; onPress?: () => void; testID?: string }

export function EventCard({ type, time, duration, title, description, animals = [], onPress, testID }: EventCardProps) {
  const { colors } = useAppTheme(); const visual = resolveEventVisual(colors, type);
  return <Card onPress={onPress} accessibilityLabel={`${title}, ${time}`} testID={testID} style={{ width: '100%', maxWidth: 360, height: 112, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 0, paddingRight: 12, paddingVertical: 12 }}><View style={{ width: 5, height: 64, borderRadius: 3, backgroundColor: visual.color }} /><View style={{ width: 50 }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22 }}>{time}</Text>{duration ? <DomainCaption>{duration}</DomainCaption> : null}</View><View style={{ flex: 1, gap: 2 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}><Icon name={visual.icon} size="md" color={visual.color} /><Text numberOfLines={1} style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22 }}>{title}</Text></View>{description ? <DomainBody numberOfLines={1}>{description}</DomainBody> : null}{animals.length ? <LinkedAnimals animals={animals} /> : null}</View></Card>;
}
