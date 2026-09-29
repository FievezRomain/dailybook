import type { IAIService, ParseEventResult, ParseNoteResult, ParseObjectifResult } from './IAIService';
import httpClient from '../api/httpClient';

/**
 * Implémentation de IAIService via l'API backend.
 * Le parsing IA est effectué côté serveur (FastAPI) pour ne jamais exposer
 * les clés d'API IA côté client.
 *
 * Phase 5 complétera les endpoints backend correspondants.
 */
export class BackendAIService implements IAIService {
  async parseEvent(text: string): Promise<Partial<ParseEventResult>> {
    const response = await httpClient.post<{ success: true; data: Partial<ParseEventResult> }>(
      '/ai/parse/event',
      { text },
    );
    return response.data.data;
  }

  async parseNote(text: string): Promise<Partial<ParseNoteResult>> {
    const response = await httpClient.post<{ success: true; data: Partial<ParseNoteResult> }>(
      '/ai/parse/note',
      { text },
    );
    return response.data.data;
  }

  async parseObjectif(text: string): Promise<Partial<ParseObjectifResult>> {
    const response = await httpClient.post<{ success: true; data: Partial<ParseObjectifResult> }>(
      '/ai/parse/objectif',
      { text },
    );
    return response.data.data;
  }
}

export const aiService: IAIService = new BackendAIService();
