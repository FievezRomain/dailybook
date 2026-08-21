import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Button } from '../actions';
import { Icon, type VascoIconName } from '../icons';

export type EmptyStateType = 'generic' | 'search' | 'offline' | 'permission';
const defaults: Record<EmptyStateType, { icon: VascoIconName; title: string; message: string; actionLabel: string }> = {
  generic: { icon: 'empty', title: 'Rien à afficher', message: 'Le contenu apparaîtra ici dès qu’il sera disponible.', actionLabel: 'Ajouter' },
  search: { icon: 'search', title: 'Aucun résultat', message: 'Essayez un autre terme ou modifiez les filtres.', actionLabel: 'Effacer les filtres' },
  offline: { icon: 'warning', title: 'Connexion indisponible', message: 'Vérifiez votre connexion puis réessayez.', actionLabel: 'Réessayer' },
  permission: { icon: 'info', title: 'Autorisation nécessaire', message: 'Autorisez l’accès dans les réglages pour continuer.', actionLabel: 'Ouvrir les réglages' },
};

export interface EmptyStateProps { type?: EmptyStateType; icon?: VascoIconName; title?: string; message?: string; actionLabel?: string; onAction?: () => void; style?: StyleProp<ViewStyle>; testID?: string }
export function EmptyState({ type = 'generic', icon, title, message, actionLabel, onAction, style, testID }: EmptyStateProps) { const content = defaults[type]; return <StateMessage icon={icon ?? content.icon} title={title ?? content.title} message={message ?? content.message} actionLabel={actionLabel ?? content.actionLabel} onAction={onAction} style={style} testID={testID} />; }

export interface ErrorStateProps { title?: string; message?: string; actionLabel?: string; onRetry?: () => void; style?: StyleProp<ViewStyle>; testID?: string }
export function ErrorState({ title = 'Une erreur est survenue', message = 'Impossible de charger le contenu. Réessayez dans un instant.', actionLabel = 'Réessayer', onRetry, style, testID }: ErrorStateProps) { return <StateMessage icon="error" title={title} message={message} actionLabel={actionLabel} onAction={onRetry} iconTone="error" style={style} testID={testID} />; }

function StateMessage({ icon, title, message, actionLabel, onAction, iconTone, style, testID }: { icon: VascoIconName; title: string; message: string; actionLabel: string; onAction?: () => void; iconTone?: 'error'; style?: StyleProp<ViewStyle>; testID?: string }) {
  const { colors } = useAppTheme();
  return <View accessibilityRole="summary" testID={testID} style={[{ width: '100%', maxWidth: componentTokens.feedback.width, minHeight: componentTokens.feedback.stateHeight, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl }, style]}><Icon name={icon} size="xl" color={iconTone === 'error' ? colors.error : colors.primary} /><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xl, textAlign: 'center' }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: typography.lineHeights.normal, textAlign: 'center' }}>{message}</Text>{onAction ? <Button label={actionLabel} onPress={onAction} style={{ alignSelf: 'center' }} /> : null}</View>;
}
