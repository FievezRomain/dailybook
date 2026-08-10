import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Spinner } from '../feedback';
import { Icon, type VascoIconName } from '../icons';
import { isMediaUploadActionable, resolveMediaUploadVisual, type MediaUploadState } from './mediaUploadStyles';

type StateCopy = { title: string; description: string };

export interface MediaUploadProps {
  state: MediaUploadState;
  onPress?: () => void;
  empty?: StateCopy;
  uploading?: StateCopy;
  success?: StateCopy;
  error?: StateCopy;
  disabled?: StateCopy;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const defaultCopy: Record<MediaUploadState, StateCopy> = {
  empty: { title: 'Ajouter une photo', description: 'JPG, PNG ou PDF · 10 Mo maximum' },
  uploading: { title: 'Import en cours…', description: 'Ne fermez pas l’application' },
  success: { title: 'Fichier importé', description: 'Import terminé' },
  error: { title: 'Échec de l’import', description: 'Réessayer ou choisir un autre fichier' },
  disabled: { title: 'Ajout indisponible', description: 'Cette action n’est pas disponible' },
};

const stateIcon: Partial<Record<MediaUploadState, VascoIconName>> = {
  empty: 'upload',
  success: 'success',
  error: 'close',
  disabled: 'upload',
};

export function MediaUpload({
  state,
  onPress,
  empty,
  uploading,
  success,
  error,
  disabled,
  accessibilityLabel,
  style,
  testID,
}: MediaUploadProps) {
  const { colors } = useAppTheme();
  const copy = { empty, uploading, success, error, disabled }[state] ?? defaultCopy[state];
  const visual = resolveMediaUploadVisual(colors, state);
  const actionable = isMediaUploadActionable(state) && Boolean(onPress);
  const icon = stateIcon[state];
  const textColor = state === 'error' || state === 'disabled' ? visual.contentColor : colors.textPrimary;
  const descriptionColor = state === 'error' || state === 'disabled' ? visual.contentColor : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole={actionable ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? copy.title}
      accessibilityHint={actionable ? copy.description : undefined}
      accessibilityState={{ disabled: !actionable, busy: state === 'uploading' }}
      disabled={!actionable}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        {
          width: '100%',
          minHeight: componentTokens.mediaUpload.height,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.md,
          borderRadius: radii.lg,
          borderWidth: componentTokens.mediaUpload.stroke,
          borderStyle: 'dashed',
          borderColor: visual.borderColor,
          backgroundColor: visual.backgroundColor,
          opacity: pressed ? 0.84 : 1,
        },
        style,
      ]}
    >
      {state === 'uploading' ? <Spinner size="large" tone="primary" /> : null}
      {icon ? <Icon name={icon} size="md" color={visual.contentColor} /> : null}
      <View style={{ alignItems: 'center', gap: spacing.xs }}>
        <Text
          numberOfLines={1}
          style={{
            color: textColor,
            fontFamily: typography.fonts.medium,
            fontSize: typography.sizes.control,
            lineHeight: typography.lineHeights.normal,
            textAlign: 'center',
          }}
        >
          {copy.title}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            color: descriptionColor,
            fontFamily: typography.fonts.regular,
            fontSize: typography.sizes.xs,
            lineHeight: typography.lineHeights.tight,
            textAlign: 'center',
          }}
        >
          {copy.description}
        </Text>
      </View>
    </Pressable>
  );
}
