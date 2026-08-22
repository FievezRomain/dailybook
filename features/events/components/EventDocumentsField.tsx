import { useState } from 'react';
import { View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Banner, Button, Field, FileItem, PremiumGate } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { spacing } from '../../../theme/scales';

const EMPTY_DOCUMENTS: NonNullable<ReturnType<typeof useEventWizardStore.getState>['formData']['documents']> = [];

export function EventDocumentsField({ onComparePlans }: { onComparePlans: () => void }) {
  const premium = String(useAuthStore((state) => state.user?.subscription)).trim().toLocaleLowerCase('fr-FR') === 'premium';
  const documents = useEventWizardStore((state) => state.formData.documents ?? EMPTY_DOCUMENTS);
  const setField = useEventWizardStore((state) => state.setField);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string>();
  const appendDocuments = (items: typeof documents) => setField('documents', [...documents, ...items]);

  const choosePdf = async () => {
    if (picking) return;
    setPicking(true);
    setError(undefined);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: true, copyToCacheDirectory: true });
      if (!result.canceled) appendDocuments(result.assets.map((asset) => ({ name: asset.name, localUri: asset.uri, mimeType: 'application/pdf', size: asset.size })));
    } finally {
      setPicking(false);
    }
  };

  const chooseImages = async () => {
    if (picking) return;
    setPicking(true);
    setError(undefined);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Autorisez Vasco à accéder à vos photos pour joindre une image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 1 });
      if (result.canceled) return;
      const supported = result.assets.filter((asset) => asset.mimeType === 'image/jpeg' || asset.mimeType === 'image/png');
      if (supported.length !== result.assets.length) setError('Seules les images JPEG et PNG sont acceptées.');
      appendDocuments(supported.map((asset, index) => ({
        name: asset.fileName ?? `document-medical-${Date.now()}-${index}.${asset.mimeType === 'image/png' ? 'png' : 'jpg'}`,
        localUri: asset.uri,
        mimeType: asset.mimeType!,
        size: asset.fileSize,
      })));
    } finally {
      setPicking(false);
    }
  };

  return <Field label="Documents médicaux" filled={documents.length > 0}>
    <View style={{ gap: spacing.sm }}>
      {documents.map((document, index) => <FileItem key={`${document.name}-${index}`} name={document.name} type={document.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'} state={document.localUri ? 'uploading' : 'uploaded'} metadata={document.localUri ? 'Prêt à être envoyé' : 'Document enregistré'} progress={document.localUri ? 0 : 1} onMore={() => setField('documents', documents.filter((_, itemIndex) => itemIndex !== index))} />)}
      {error ? <Banner tone="error" title="Fichier non ajouté" message={error} blocking onDismiss={() => setError(undefined)} /> : null}
      {premium ? <>
        <Button label={picking ? 'Sélection en cours…' : 'Choisir des images'} icon="image" variant="secondary" fullWidth disabled={picking} onPress={() => void chooseImages()} />
        <Button label="Choisir des PDF" icon="filePdf" variant="secondary" fullWidth disabled={picking} onPress={() => void choosePdf()} />
      </> : <PremiumGate title="Documents médicaux Premium" message="L’ajout d’un document médical nécessite un abonnement Premium." onComparePlans={onComparePlans} testID="event-documents-premium" />}
    </View>
  </Field>;
}
