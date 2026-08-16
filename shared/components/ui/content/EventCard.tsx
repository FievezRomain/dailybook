import { Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { Card } from './Card';
import { DomainBody, DomainCaption } from './DomainCardParts';
import { resolveEventVisual, type EventCardType } from './domainCardUtils';
import { LinkedAnimals } from './LinkedAnimals';
import type { LinkedAnimalData } from './linkedAnimalsUtils';

export interface EventCardProps { type: EventCardType; date?: string; time?: string; duration?: string; title: string; description?: string; animals?: readonly LinkedAnimalData[]; onPress?: () => void; testID?: string }

export function EventCard({ type, date, time, duration, title, description, animals = [], onPress, testID }: EventCardProps) {
  const { colors } = useAppTheme(); const visual = resolveEventVisual(colors, type);
  const typeLabel: Record<EventCardType, string> = { care: 'Soins', appointment: 'Rendez-vous', walk: 'Balade', training: 'Entraînement', competition: 'Concours', expense: 'Dépense', other: 'Autre' };
  const shownDate = date ?? time ?? '';
  const shownTime = date ? time : duration;
  return <Card onPress={onPress} accessibilityLabel={`${typeLabel[type]}, ${title}, ${shownDate}${shownTime ? `, ${shownTime}` : ''}`} testID={testID} style={{ width: '100%', maxWidth: 360, minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 0, paddingRight: 12, paddingVertical: 12 }}><View style={{ width: 5, height: 64, borderRadius: 3, backgroundColor: visual.color }} /><View style={{ width: 58 }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22 }}>{shownDate}</Text>{shownTime ? <DomainCaption>{shownTime}</DomainCaption> : null}</View><View style={{ flex: 1, gap: 2 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}><Icon name={visual.icon} size="md" color={visual.color} /><Text numberOfLines={1} style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22 }}>Type · {typeLabel[type]}</Text></View><DomainBody numberOfLines={1}>{title}</DomainBody>{description ? <DomainCaption numberOfLines={1}>{description}</DomainCaption> : null}{animals.length ? <LinkedAnimals animals={animals} /> : null}</View></Card>;
}
