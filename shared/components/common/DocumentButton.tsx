import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { getEventDocumentUrl } from "../../../services/api/EventService";
import { getFileUrl, openDocumentWithCache } from "../../../services/aws/FileStorageService";
import { AppDivider } from '../ui';
import { FontAwesome } from "@expo/vector-icons";
import ModalEditGeneric from '../modals/common/ModalEditGeneric';
import { WebView } from "react-native-webview";
import { useAppTheme } from "../../../theme/useAppTheme";
import { Image } from "expo-image";

// ---------- TYPES ----------

type ActionType = "open" | "download";

type ModalSubMenuProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onAction: (action: ActionType) => void;
};

type DocumentButtonProps = {
  event: { id: number };
  item: { name: string };
};

type DocumentViewerProps = {
  visible: boolean;
  uri: string;
  onClose: () => void;
};

// ---------- DOCUMENT VIEWER ----------

const getExtension = (uri: string): string => {
  try {
    const cleanUri = uri.split('?')[0]; // enlève les paramètres
    return cleanUri.slice(cleanUri.lastIndexOf('.') + 1).toLowerCase();
  } catch {
    return '';
  }
};

const isImage = (uri: string): boolean => {
  const ext = getExtension(uri);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};

const isPdf = (uri: string): boolean => {
  const ext = getExtension(uri);
  return ext === 'pdf';
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ visible, uri, onClose }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { colors, fonts } = useAppTheme();

  return (
    <ModalEditGeneric isVisible={visible} setVisible={onClose} arrayHeight={["90%"]}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>

        {isImage(uri) ? (
          <Image
            source={{ uri }}
            style={{ flex: 1, width: screenWidth, height: screenHeight - 60 }}
            cachePolicy={"disk"}
            contentFit="contain"
          />
        ) : isPdf(uri) ? (
          <WebView
            source={{ uri }}
            style={{ flex: 1 }}
            startInLoadingState
            renderLoading={() => (
              <ActivityIndicator size="large" color={colors.default_dark} />
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 40, fontSize: 16, color: colors.default_dark, fontFamily: fonts.default.fontFamily}}>
            Format non supporté
          </Text>
        )}
      </View>
    </ModalEditGeneric>
  );
};

// ---------- MODAL SUBMENU ----------

const ModalSubMenu: React.FC<ModalSubMenuProps> = ({ visible, setVisible, onAction }) => {
  const { colors, fonts } = useAppTheme();

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 10,
    },
    actionButtonContainer: {
      width: "90%",
      borderRadius: 5,
      marginTop: 15,
      backgroundColor: colors.quaternary,
    },
    actionButton: { padding: 20 },
    card: { justifyContent: "space-evenly", alignItems: "center" },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={visible} setVisible={setVisible} arrayHeight={["30%"]}>
      <View style={styles.card}>
        <Text style={styles.textFontRegular}>Actions</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction("open")}>
            <View style={styles.informationsActionButton}>
              <FontAwesome name="eye" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                Visualiser le document
              </Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction("download")}>
            <View style={styles.informationsActionButton}>
              <FontAwesome name="download" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                Télécharger le document
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ModalEditGeneric>
  );
};

// ---------- DOCUMENT BUTTON ----------

const DocumentButton: React.FC<DocumentButtonProps> = ({ event, item }) => {
  const { colors } = useAppTheme();
  const [subMenuVisible, setSubMenuVisible] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openOrDownloadDocument = async (action: ActionType) => {
    setLoading(true);
    setSubMenuVisible(false);
    const url = await getEventDocumentUrl(String(event.id), item.name);

    if (action === "download") {
      await openDocumentWithCache(url, item.name);
    } else if (action === "open") {
      setDocumentUrl(url);
      setViewerVisible(true);
    }
    setLoading(false);
  };

  const shortenFileName = (fileName: string, maxBaseLength = 10): string => {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) return fileName;

    const base = fileName.slice(0, lastDotIndex);
    const ext = fileName.slice(lastDotIndex);

    if (base.length <= maxBaseLength) return fileName;

    return `${base.slice(0, maxBaseLength)}...${ext}`;
  };

  return (
    <>
      <ModalSubMenu
        setVisible={setSubMenuVisible}
        visible={subMenuVisible}
        onAction={openOrDownloadDocument}
      />

      <DocumentViewer
        visible={viewerVisible}
        uri={documentUrl ?? ""}
        onClose={() => {
          setViewerVisible(false);
          setDocumentUrl(null);
        }}
      />

      <View style={{ marginTop: 5, marginBottom: 10 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 50,
              backgroundColor: colors.quaternary,
            }}
            disabled={loading}
            onPress={() => setSubMenuVisible(true)}
          >
            {loading ?
              <ActivityIndicator size={"small"} />
            :
              <FontAwesome name="file" size={20} />
            }
            
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: colors.default_dark,
            maxWidth: 100,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {shortenFileName(item.name)}
        </Text>
      </View>
    </>
  );
};

export default DocumentButton;
