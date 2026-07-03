import httpClient from './httpClient';

export interface AiParseResult {
  nom?: string;
  dateevent?: string;
  eventtype?: string;
  lieu?: string;
  commentaire?: string;
  specialiste?: string;
  traitement?: string;
  depense?: number;
  titre?: string;
  note?: string;
  title?: string;
  description?: string;
  animaux?: number[];
  [key: string]: unknown;
}

export interface AiParseResponse {
  parsed: AiParseResult;
  raw_text: string;
}

export async function parseEvent(text: string): Promise<AiParseResponse> {
  return httpClient.post<AiParseResponse>('/ai/parse/event', { text }).then((r) => r.data);
}

export async function parseNote(text: string): Promise<AiParseResponse> {
  return httpClient.post<AiParseResponse>('/ai/parse/note', { text }).then((r) => r.data);
}

export async function parseObjectif(text: string): Promise<AiParseResponse> {
  return httpClient.post<AiParseResponse>('/ai/parse/objectif', { text }).then((r) => r.data);
}
