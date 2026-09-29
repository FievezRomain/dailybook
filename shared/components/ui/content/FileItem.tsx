import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon, type VascoIconName } from '../icons';
import { clampUploadProgress, getFileStateLabel, type FileItemState, type FileItemType } from './fileItemUtils';
import { getCachedImageSource } from '../../../utils/mediaCache';

export interface FileItemProps {
  name: string;
  type: FileItemType;
  state?: FileItemState;
  metadata: string;
  progress?: number;
  previewUrl?: string | null;
  onOpen?: () => void;
  onMore?: () => void;
  onRetry?: () => void;
  testID?: string;
}

export function FileItem({ name, type, state = 'uploaded', metadata, progress = 0, previewUrl, onOpen, onMore, onRetry, testID }: FileItemProps) {
  const { colors } = useAppTheme();
  const error = state === 'error';
  const uploading = state === 'uploading';
  const stateLabel = getFileStateLabel(state, metadata, progress);
  const icon: VascoIconName = type === 'pdf' ? 'filePdf' : type === 'image' ? 'image' : 'file';
  const previewBackground = type === 'pdf' ? colors.errorSurface : type === 'image' ? colors.primaryLight : colors.surfaceVariant;
  const content = <View style={{ width: '100%', maxWidth: 360, height: componentTokens.content.fileItemHeight, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: error ? 2 : 1, borderColor: error ? colors.error : colors.border, borderRadius: radii.lg, backgroundColor: colors.surface }}><View style={{ width: componentTokens.content.filePreviewSize, height: componentTokens.content.filePreviewSize, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: previewBackground }}>{type === 'image' && previewUrl ? <Image source={getCachedImageSource(previewUrl)} cachePolicy="memory-disk" contentFit="cover" accessibilityLabel={`Aperçu de ${name}`} style={{ width: '100%', height: '100%' }} /> : <Icon name={icon} size="lg" color={error ? colors.error : colors.primaryDark} />}</View><View style={{ flex: 1, gap: 2 }}><Text numberOfLines={1} style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22, letterSpacing: 0.1 }}>{name}</Text><Text numberOfLines={1} style={{ color: error ? colors.error : colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{stateLabel}</Text>{uploading ? <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(clampUploadProgress(progress) * 100) }} style={{ width: '100%', height: 5, overflow: 'hidden', borderRadius: 3, backgroundColor: colors.surfaceVariant }}><View style={{ width: `${clampUploadProgress(progress) * 100}%` as `${number}%`, height: 5, borderRadius: 3, backgroundColor: colors.primary }} /></View> : null}</View>{error && onRetry ? <FileAction icon="retry" label="Réessayer le téléversement" color={colors.error} onPress={onRetry} /> : onMore ? <FileAction icon="moreHorizontal" label="Plus d’actions" color={colors.textPrimary} onPress={onMore} /> : null}</View>;
  if (!onOpen) return <View testID={testID}>{content}</View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={`${name}, ${stateLabel}`} onPress={onOpen} disabled={uploading} accessibilityState={{ disabled: uploading, busy: uploading }} testID={testID}>{content}</Pressable>;
}

function FileAction({ icon, label, color, onPress }: { icon: VascoIconName; label: string; color: string; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={10} style={{ width: 32, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size="md" color={color} /></Pressable>; }
