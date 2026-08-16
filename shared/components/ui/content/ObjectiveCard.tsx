import { View } from 'react-native';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { CardHeader, DomainBody, DomainCaption } from './DomainCardParts';
import { clampProgress } from './domainCardUtils';
import { LinkedAnimals } from './LinkedAnimals';
import type { LinkedAnimalData } from './linkedAnimalsUtils';

export type ObjectiveStatus = 'active' | 'completed' | 'overdue';
export interface ObjectiveCardProps { title: string; status: ObjectiveStatus; statusLabel: string; progress: number; endLabel: string; animals?: readonly LinkedAnimalData[]; onPress?: () => void; onMore?: () => void; testID?: string }
export function ObjectiveCard({ title, status, statusLabel, progress, endLabel, animals = [], onPress, onMore, testID }: ObjectiveCardProps) { const { colors } = useAppTheme(); const accent = status === 'overdue' ? colors.error : status === 'completed' ? colors.success : colors.primary; const percent = `${clampProgress(progress) * 100}%` as `${number}%`; return <Card onPress={onPress} accessibilityLabel={`${title}, ${statusLabel}`} testID={testID} style={{ width: '100%', maxWidth: 344, minHeight: 158, gap: 10, borderWidth: 1, borderColor: status === 'overdue' ? colors.error : colors.border }}><CardHeader title={title} onMore={onMore} /><DomainBody numberOfLines={1}><DomainCaption color={status === 'active' ? colors.textSecondary : accent}>{statusLabel}</DomainCaption></DomainBody><View style={{ width: '100%', height: 10, overflow: 'hidden', borderRadius: 5, backgroundColor: colors.surfaceVariant }}><View style={{ width: percent, height: 10, borderRadius: 5, backgroundColor: accent }} /></View><DomainCaption>{endLabel}</DomainCaption>{animals.length ? <LinkedAnimals animals={animals} /> : null}</Card>; }
