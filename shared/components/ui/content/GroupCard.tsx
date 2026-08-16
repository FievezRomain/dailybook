import { Text, View } from 'react-native';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainTitle } from './DomainCardParts';
import { Icon } from '../icons';

export type GroupRole = 'owner' | 'member' | 'invited';
export interface GroupCardProps { name: string; summary: string; description?: string | null; initials?: string; role: GroupRole; onPress?: () => void; testID?: string }
export function GroupCard({ name, summary, description, initials = '?', role, onPress, testID }: GroupCardProps) {
	const { colors } = useAppTheme();
	const roleLabel = role === 'owner' ? 'Gestionnaire' : role === 'member' ? 'Membre' : 'Invitation en attente';
	return <Card onPress={onPress} accessibilityLabel={`${name}, ${summary}, ${roleLabel}`} testID={testID} style={{ width: '100%', minHeight: 132, padding: 16, gap: 12, borderWidth: role === 'invited' ? 2 : 1, borderColor: role === 'invited' ? colors.primary : colors.border }}>
		<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
			<View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, backgroundColor: colors.primaryLight }}><Text style={{ color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{initials}</Text></View>
			<View style={{ flex: 1, gap: 3 }}><DomainTitle>{name}</DomainTitle><DomainCaption>{summary}</DomainCaption></View>
			<Icon name="next" size="md" color={colors.primaryDark} />
		</View>
		{description ? <DomainBody numberOfLines={2}>{description}</DomainBody> : null}
	</Card>;
}
