import { Image } from 'expo-image';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon, type VascoIconName } from '../icons';

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
  return (
    <Modal visible={open} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <SafeAreaView testID={testID} style={{ flex: 1, backgroundColor: colors.overlay }}>
        {controlsVisible ? <View style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md }}><ViewerButton icon="close" label="Fermer" onPress={onClose} /><Text numberOfLines={1} style={{ flex: 1, color: colors.textOnPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, textAlign: 'center' }}>{title}</Text><View style={{ width: 44 }} /></View> : null}
        <Pressable accessibilityRole="button" accessibilityLabel={controlsVisible ? 'Masquer les contrôles' : 'Afficher les contrôles'} onPress={onToggleControls} disabled={!onToggleControls} style={{ flex: 1, justifyContent: 'center', padding: spacing.md }}>
          <View style={{ flex: 1, maxHeight: '100%', overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.backgroundPaper }}>
            {type === 'image' ? <Image source={{ uri }} contentFit="contain" accessibilityLabel={title} style={{ flex: 1 }} /> : <WebView source={{ uri }} style={{ flex: 1, backgroundColor: colors.backgroundPaper }} accessibilityLabel={title} />}
          </View>
        </Pressable>
        {controlsVisible && (onShare || onDownload || onDeleteRequest) ? <View style={{ minHeight: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: spacing.md }}>{onShare ? <ViewerButton icon="share" label="Partager" onPress={onShare} /> : null}{onDownload ? <ViewerButton icon="download" label="Télécharger" onPress={onDownload} /> : null}{onDeleteRequest ? <ViewerButton icon="delete" label="Supprimer" onPress={onDeleteRequest} destructive /> : null}</View> : null}
      </SafeAreaView>
    </Modal>
  );
}

function ViewerButton({ icon, label, onPress, destructive = false }: { icon: VascoIconName; label: string; onPress: () => void; destructive?: boolean }) {
  const { colors } = useAppTheme();
  const color = destructive ? colors.error : colors.textOnPrimary;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ minWidth: 64, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, opacity: pressed ? 0.7 : 1 })}><Icon name={icon} size="md" color={color} /><Text style={{ color, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{label}</Text></Pressable>;
}
