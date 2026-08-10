import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { CardHeader, DomainBody, DomainCaption } from './DomainCardParts';

export interface NoteCardProps { title: string; excerpt: string; metadata: string; pinned?: boolean; onPress?: () => void; onMore?: () => void; testID?: string }
export function NoteCard({ title, excerpt, metadata, pinned = false, onPress, onMore, testID }: NoteCardProps) { const { colors } = useAppTheme(); return <Card onPress={onPress} accessibilityLabel={`${title}${pinned ? ', épinglée' : ''}`} testID={testID} style={{ width: '100%', maxWidth: 344 }}><CardHeader title={title} aside={pinned ? <DomainCaption color={colors.primaryDark}>Épinglée</DomainCaption> : undefined} onMore={onMore} /><DomainBody>{excerpt}</DomainBody><DomainCaption>{metadata}</DomainCaption></Card>; }
