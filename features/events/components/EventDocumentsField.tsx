import { useState } from 'react';
import { View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Button, Field, FileItem, PremiumGate } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { spacing } from '../../../theme/scales';

const EMPTY_DOCUMENTS: NonNullable<ReturnType<typeof useEventWizardStore.getState>['formData']['documents']> = [];

export function EventDocumentsField({ onComparePlans }: { onComparePlans: () => void }) {
  const premium = String(useAuthStore((state) => state.user?.subscription)).trim().toLocaleLowerCase('fr-FR') === 'premium';
  const documents = useEventWizardStore((state) => state.formData.documents ?? EMPTY_DOCUMENTS);
  const setField = useEventWizardStore((state) => state.setField);
  const [picking, setPicking] = useState(false);
  const chooseDocuments = async () => {
    if (picking) return;
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], multiple: true, copyToCacheDirectory: true });
      if (!result.canceled) setField('documents', [...documents, ...result.assets.map((asset) => ({ name: asset.name, localUri: asset.uri, mimeType: asset.mimeType ?? 'application/octet-stream', size: asset.size }))]);
    } finally {
      setPicking(false);
    }
  };
  return <Field label="Documents médicaux" filled={documents.length > 0}>
    <View style={{ gap: spacing.sm }}>
    {documents.map((document, index) => <FileItem key={`${document.name}-${index}`} name={document.name} type={document.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'} state={document.localUri ? 'uploading' : 'uploaded'} metadata={document.localUri ? 'Prêt à être envoyé' : 'Document enregistré'} progress={document.localUri ? 0 : 1} onMore={() => setField('documents', documents.filter((_, itemIndex) => itemIndex !== index))} />)}
    {premium ? <Button label={picking ? 'Sélection en cours…' : 'Ajouter des documents'} icon="add" variant="secondary" fullWidth disabled={picking} onPress={() => void chooseDocuments()} /> : <PremiumGate title="Documents médicaux Premium" message="L’ajout d’un document médical nécessite un abonnement Premium." onComparePlans={onComparePlans} testID="event-documents-premium" />}
    </View>
  </Field>;
}
