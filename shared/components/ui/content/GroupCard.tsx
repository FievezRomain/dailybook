import { Image } from 'expo-image';
import { View } from 'react-native';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainTitle } from './DomainCardParts';

export type GroupRole = 'owner' | 'member' | 'invited';
export interface GroupCardProps { name: string; summary: string; role: GroupRole; imageUrl?: string | null; onPress?: () => void; testID?: string }
export function GroupCard({ name, summary, role, imageUrl, onPress, testID }: GroupCardProps) { const { colors } = useAppTheme(); const roleLabel = role === 'owner' ? 'Propriétaire' : role === 'member' ? 'Membre' : 'Invitation en attente'; return <Card onPress={onPress} accessibilityLabel={`${name}, ${roleLabel}`} testID={testID} style={{ width: '100%', maxWidth: 344, height: 116, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: role === 'invited' ? 2 : 1, borderColor: role === 'invited' ? colors.primary : colors.border }}><View style={{ width: 64, height: 64, overflow: 'hidden', borderRadius: 20, backgroundColor: colors.primaryLight }}>{imageUrl ? <Image source={{ uri: imageUrl }} contentFit="cover" style={{ flex: 1 }} /> : null}</View><View style={{ flex: 1, gap: 3 }}><DomainTitle>{name}</DomainTitle><DomainBody numberOfLines={1}>{summary}</DomainBody><DomainCaption color={role === 'invited' ? colors.primaryDark : undefined}>{roleLabel}</DomainCaption></View></Card>; }
