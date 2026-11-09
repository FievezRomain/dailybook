import { useState } from 'react';
import { View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Banner, Button, FileItem } from '../../../shared/components/ui';
import type { EventWizardDocument } from '../../../stores/useEventWizardStore';
import { spacing } from '../../../theme/scales';

export interface EventDocumentPickerProps {
  documents: EventWizardDocument[];
  onChange: (documents: EventWizardDocument[]) => void;
  disabled?: boolean;
}

export type EventDocumentPickResult = {
  documents: EventWizardDocument[];
  warning?: string;
};

export async function pickEventPdfDocuments(): Promise<EventDocumentPickResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: true, copyToCacheDirectory: true });
    return {
      documents: result.canceled
        ? []
        : result.assets.map((asset) => ({ name: asset.name, localUri: asset.uri, mimeType: 'application/pdf', size: asset.size })),
    };
  } catch {
    throw new Error('Impossible d’ouvrir le sélecteur de fichiers. Réessayez.');
  }
}

export async function pickEventImageDocuments(): Promise<EventDocumentPickResult> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) throw new Error('Autorisez Vasco à accéder à vos photos pour joindre une image.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 1 });
    if (result.canceled) return { documents: [] };
    return {
      documents: result.assets.map((asset, index) => ({
        name: asset.fileName ?? `document-medical-${Date.now()}-${index}.jpg`,
        localUri: asset.uri,
        mimeType: inferImageMimeType(asset.mimeType, asset.fileName),
        size: asset.fileSize,
      })),
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Impossible d’ouvrir la photothèque. Réessayez.');
  }
}

function inferImageMimeType(mimeType?: string | null, fileName?: string | null): string {
  if (mimeType?.startsWith('image/')) return mimeType;
  const extension = fileName?.split('.').at(-1)?.toLocaleLowerCase('en-US');
  if (extension === 'heic') return 'image/heic';
  if (extension === 'heif') return 'image/heif';
  if (extension === 'avif') return 'image/avif';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'png') return 'image/png';
  return 'image/jpeg';
}

export function EventDocumentPicker({ documents, onChange, disabled = false }: EventDocumentPickerProps) {
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string>();
  const appendDocuments = (items: EventWizardDocument[]) => onChange([...documents, ...items]);

  const choosePdf = async () => {
    if (picking || disabled) return;
    setPicking(true);
    setError(undefined);
    try {
      const result = await pickEventPdfDocuments();
      appendDocuments(result.documents);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Impossible d’ouvrir le sélecteur de fichiers. Réessayez.');
    } finally {
      setPicking(false);
    }
  };

  const chooseImages = async () => {
    if (picking || disabled) return;
    setPicking(true);
    setError(undefined);
    try {
      const result = await pickEventImageDocuments();
      if (result.warning) setError(result.warning);
      appendDocuments(result.documents);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Impossible d’ouvrir la photothèque. Réessayez.');
    } finally {
      setPicking(false);
    }
  };

  return <View style={{ gap: spacing.sm }}>
    {documents.map((document, index) => <FileItem
      key={`${document.name}-${document.localUri ?? 'saved'}-${index}`}
      name={document.name}
      type={document.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'}
      state="uploaded"
      metadata={document.localUri ? 'Prêt à être envoyé' : 'Document enregistré'}
      onRemove={disabled ? undefined : () => onChange(documents.filter((_, itemIndex) => itemIndex !== index))}
    />)}
    {error ? <Banner tone="error" title="Fichier non ajouté" message={error} blocking onDismiss={() => setError(undefined)} /> : null}
    <Button label={picking ? 'Sélection en cours…' : 'Choisir des images'} icon="image" variant="secondary" fullWidth disabled={picking || disabled} onPress={() => void chooseImages()} />
    <Button label="Choisir des PDF" icon="filePdf" variant="secondary" fullWidth disabled={picking || disabled} onPress={() => void choosePdf()} />
  </View>;
}
