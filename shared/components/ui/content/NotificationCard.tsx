import { View } from 'react-native';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainLabel } from './DomainCardParts';

export type NotificationType = 'reminder' | 'group' | 'system';
export interface NotificationCardProps { title: string; message: string; timestamp: string; type?: NotificationType; read?: boolean; onPress?: () => void; testID?: string }
export function NotificationCard({ title, message, timestamp, type = 'reminder', read = false, onPress, testID }: NotificationCardProps) { const { colors } = useAppTheme(); const avatarColor = type === 'group' ? colors.eventBalade : type === 'system' ? colors.surfaceDim : colors.primaryLight; return <Card onPress={onPress} accessibilityLabel={`${read ? '' : 'Non lue, '}${title}, ${message}`} testID={testID} style={{ width: '100%', maxWidth: 360, height: 104, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, backgroundColor: read ? colors.surface : colors.surfaceVariant, shadowOpacity: 0, elevation: 0 }}><View style={{ width: 44, height: 44, borderRadius: radii.full, backgroundColor: avatarColor }} /><View style={{ flex: 1, gap: 2 }}><DomainLabel>{title}</DomainLabel><DomainBody numberOfLines={1}>{message}</DomainBody><DomainCaption>{timestamp}</DomainCaption></View>{!read ? <View accessibilityLabel="Non lue" style={{ width: 9, height: 9, borderRadius: radii.full, backgroundColor: colors.primary }} /> : null}</Card>; }
