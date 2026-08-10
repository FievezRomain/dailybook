import { Image } from 'expo-image';
import { View } from 'react-native';
import { radii } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Card } from './Card';
import { DomainBody, DomainCaption, DomainTitle } from './DomainCardParts';

export interface ContactCardProps { name: string; details: string; phoneLabel: string; emergency?: boolean; imageUrl?: string | null; onPress?: () => void; onCall?: () => void; testID?: string }
export function ContactCard({ name, details, phoneLabel, emergency = false, imageUrl, onPress, onCall, testID }: ContactCardProps) { const { colors } = useAppTheme(); return <Card onPress={onPress ?? onCall} accessibilityLabel={`${name}, ${details}, ${phoneLabel}`} testID={testID} style={{ width: '100%', maxWidth: 344, height: 112, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: emergency ? 2 : 1, borderColor: emergency ? colors.error : colors.border }}><View style={{ width: 56, height: 56, overflow: 'hidden', borderRadius: 18, backgroundColor: emergency ? colors.errorSurface : colors.primaryLight }}>{imageUrl ? <Image source={{ uri: imageUrl }} contentFit="cover" style={{ flex: 1 }} /> : null}</View><View style={{ flex: 1, gap: 2 }}><DomainTitle>{name}</DomainTitle><DomainBody numberOfLines={1}>{details}</DomainBody><DomainCaption color={emergency ? colors.error : colors.primaryDark}>{phoneLabel} · Appeler</DomainCaption></View></Card>; }
