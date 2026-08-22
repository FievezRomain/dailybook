import { Pressable, Text, View } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { Card } from './Card';
import { DomainBody, DomainCaption } from './DomainCardParts';
import { eventTypePresentation, resolveEventVisual, type EventCardType } from './domainCardUtils';
import { LinkedAnimals } from './LinkedAnimals';
import { Checkbox } from '../selection/Checkbox';
import type { LinkedAnimalData } from './linkedAnimalsUtils';

export type EventCardStatus = 'overdue';
export interface EventCardProps { type: EventCardType; date: string; time?: string; duration?: string; title: string; description?: string; animals?: readonly LinkedAnimalData[]; status?: EventCardStatus; statusLabel?: string; completed?: boolean; completionPending?: boolean; onCompletedChange?: (completed: boolean) => void; onPress?: () => void; testID?: string }

export function EventCard({ type, date, time, duration, title, description, animals = [], status, statusLabel, completed, completionPending = false, onCompletedChange, onPress, testID }: EventCardProps) {
  const { colors } = useAppTheme(); const visual = resolveEventVisual(colors, type);
  const typeLabel = eventTypePresentation[type].label;
  const shownDate = date;
  const shownTime = time ?? duration;
  const label = `${typeLabel}, ${title}, ${shownDate}${shownTime ? `, ${shownTime}` : ''}${statusLabel ? `, ${statusLabel}` : ''}`;
  const content = <><View style={{ width: 5, height: 64, borderRadius: 3, backgroundColor: visual.color }} /><View style={{ width: 58 }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22 }}>{shownDate}</Text>{shownTime ? <DomainCaption>{shownTime}</DomainCaption> : null}</View><View style={{ flex: 1, gap: 2, opacity: completed ? 0.65 : 1 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}><Icon name={visual.icon} size="md" color={visual.color} /><Text numberOfLines={1} style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22 }}>{typeLabel}</Text></View><DomainBody numberOfLines={1}>{title}</DomainBody>{statusLabel ? <DomainCaption color={colors.error} numberOfLines={1}>{statusLabel}</DomainCaption> : description ? <DomainCaption numberOfLines={1}>{description}</DomainCaption> : null}{animals.length ? <LinkedAnimals animals={animals} /> : null}</View></>;
  if (onCompletedChange) return <Card testID={testID} style={{ width: '100%', maxWidth: 360, minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: 0, paddingRight: spacing.xs }}><Pressable accessibilityRole="button" accessibilityLabel={`Ouvrir ${label}`} onPress={onPress} style={{ minHeight: 110, flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: spacing.xs }}>{content}</Pressable><Checkbox value={Boolean(completed)} disabled={completionPending} accessibilityLabel={completed ? `Marquer ${title} comme non terminé` : `Marquer ${title} comme terminé`} onValueChange={onCompletedChange} testID={testID ? `${testID}-completion` : undefined} /></Card>;
  return <Card onPress={onPress} accessibilityLabel={label} testID={testID} style={{ width: '100%', maxWidth: 360, minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 0, paddingRight: 12, paddingVertical: 12 }}>{content}{onPress ? <View style={{ alignSelf: 'flex-start' }}><Icon name="next" size="md" color={colors.primaryDark} /></View> : null}</Card>;
}
