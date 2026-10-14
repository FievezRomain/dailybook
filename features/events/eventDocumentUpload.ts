import { attachEventDocument } from '../../services/api/EventService';
import { FileService } from '../../services/api/FileService';
import type { EventWizardDocument } from '../../stores/useEventWizardStore';

export async function uploadEventDocument(eventId: number, document: EventWizardDocument): Promise<string> {
  if (!document.localUri) return document.name;
  const filename = await FileService.upload(
    document.localUri,
    document.name,
    document.mimeType ?? 'application/octet-stream',
    'event',
    eventId,
    document.size,
  );
  await attachEventDocument(String(eventId), filename);
  return filename;
}

export async function uploadPendingEventDocuments(
  eventId: number,
  documents: readonly EventWizardDocument[],
  onUploaded?: (document: EventWizardDocument, filename: string) => void,
) {
  const uploaded: string[] = [];
  for (const document of documents.filter((item) => item.localUri)) {
    const filename = await uploadEventDocument(eventId, document);
    uploaded.push(filename);
    onUploaded?.(document, filename);
  }
  return uploaded;
}
