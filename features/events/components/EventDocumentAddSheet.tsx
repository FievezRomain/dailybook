import { useState } from 'react';
import { Banner, Field, FormSheet } from '../../../shared/components/ui';
import type { EventWizardDocument } from '../../../stores/useEventWizardStore';
import { uploadEventDocument } from '../eventDocumentUpload';
import { EventDocumentPicker } from './EventDocumentPicker';

export function EventDocumentAddSheet({ eventId, onClose, onAdded }: { eventId: number; onClose: () => void; onAdded: () => Promise<void> }) {
  const [documents, setDocuments] = useState<EventWizardDocument[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const upload = async () => {
    if (!documents.length || pending) return;
    setPending(true);
    setError(false);
    try {
      for (const document of documents) {
        await uploadEventDocument(eventId, document);
        setDocuments((current) => current.filter((item) => item !== document));
      }
      await onAdded();
      onClose();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return <FormSheet
    title="Ajouter des documents"
    onBack={onClose}
    onClose={onClose}
    dirty={documents.length > 0}
    confirmBackWhenDirty
    footerLabel="Ajouter à l’événement"
    footerDisabled={!documents.length}
    footerLoading={pending}
    onFooterPress={() => void upload()}
    testID="event-document-add-sheet"
  >
    {error ? <Banner tone="error" title="Envoi impossible" message="Le fichier n’a pas pu être ajouté. Il est conservé pour vous permettre de réessayer." blocking onDismiss={() => setError(false)} /> : null}
    <Field label="Images et PDF" filled={documents.length > 0}>
      <EventDocumentPicker documents={documents} onChange={setDocuments} disabled={pending} />
    </Field>
  </FormSheet>;
}
