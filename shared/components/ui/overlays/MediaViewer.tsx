import { Image } from 'expo-image';
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon, type VascoIconName } from '../icons';
import { getCachedImageSource } from '../../../utils/mediaCache';

export type MediaViewerType = 'image' | 'document';

export interface MediaViewerProps {
  open: boolean;
  uri: string;
  title: string;
  type?: MediaViewerType;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  /** Must open an explicit confirmation before the parent performs deletion. */
  onDeleteRequest?: () => void;
  controlsVisible?: boolean;
  onToggleControls?: () => void;
  testID?: string;
}

export function MediaViewer({ open, uri, title, type = 'image', onClose, onShare, onDownload, onDeleteRequest, controlsVisible = true, onToggleControls, testID }: MediaViewerProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const previewHeight = Math.min(componentTokens.mediaViewer.maxHeight, height * componentTokens.mediaViewer.heightRatio);
  return (
    <Modal visible={open} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <SafeAreaView edges={['left', 'right', 'bottom']} testID={testID} style={{ flex: 1, paddingTop: Math.max(insets.top, spacing.sm), backgroundColor: colors.overlay }}>
        {controlsVisible ? <View style={{ minHeight: componentTokens.mediaViewer.headerHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}><ViewerCloseButton onPress={onClose} /><Text numberOfLines={2} style={{ flex: 1, color: colors.textOnPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22, textAlign: 'center' }}>{title}</Text><View style={{ width: 48, height: 48 }} /></View> : null}
        <Pressable accessibilityRole="button" accessibilityLabel={controlsVisible ? 'Masquer les contrôles' : 'Afficher les contrôles'} onPress={onToggleControls} disabled={!onToggleControls} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.lg }}>
          <View style={{ width: '100%', maxWidth: componentTokens.mediaViewer.maxWidth, height: previewHeight, overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.backgroundPaper }}>
            {type === 'image' ? <Image source={getCachedImageSource(uri)} cachePolicy="memory-disk" contentFit="contain" accessibilityLabel={title} style={{ flex: 1 }} /> : <WebView source={{ uri }} cacheEnabled style={{ flex: 1, backgroundColor: colors.backgroundPaper }} accessibilityLabel={title} />}
          </View>
        </Pressable>
        {controlsVisible && (onShare || onDownload || onDeleteRequest) ? <View style={{ minHeight: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: spacing.md }}>{onShare ? <ViewerButton icon="share" label="Partager" onPress={onShare} /> : null}{onDownload ? <ViewerButton icon="download" label="Télécharger" onPress={onDownload} /> : null}{onDeleteRequest ? <ViewerButton icon="delete" label="Supprimer" onPress={onDeleteRequest} destructive /> : null}</View> : null}
      </SafeAreaView>
    </Modal>
  );
}

function ViewerCloseButton({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel="Fermer" hitSlop={spacing.sm} onPress={onPress} style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, backgroundColor: colors.overlay, opacity: pressed ? 0.7 : 1 })}><Icon name="close" size="lg" color={colors.textOnPrimary} /></Pressable>;
}

function ViewerButton({ icon, label, onPress, destructive = false }: { icon: VascoIconName; label: string; onPress: () => void; destructive?: boolean }) {
  const { colors } = useAppTheme();
  const color = destructive ? colors.error : colors.textOnPrimary;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ minWidth: 64, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, opacity: pressed ? 0.7 : 1 })}><Icon name={icon} size="md" color={color} /><Text style={{ color, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{label}</Text></Pressable>;
}
