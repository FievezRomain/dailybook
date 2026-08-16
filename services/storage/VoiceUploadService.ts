import { File } from 'expo-file-system';

import type { VoiceNoteUploadTicket, VoiceRecording } from '@features/notes/types';

export const VoiceUploadService = {
  async upload(ticket: VoiceNoteUploadTicket, recording: VoiceRecording): Promise<void> {
    const file = new File(recording.uri);
    if (!file.exists || file.size !== recording.sizeBytes) {
      throw new Error("Le fichier audio n'est plus disponible.");
    }

    const form = new FormData();
    Object.entries(ticket.fields).forEach(([name, value]) => form.append(name, value));
    form.append('file', file, file.name || 'voice-note.m4a');

    const response = await fetch(ticket.url, { method: 'POST', body: form });
    if (!response.ok) {
      throw new Error("L'envoi de la note vocale a échoué.");
    }
  },

  deleteLocal(uri: string): void {
    const file = new File(uri);
    if (file.exists) file.delete();
  },
};