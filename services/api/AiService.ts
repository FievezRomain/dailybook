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
  const response = await httpClient.post<AiParseResult | AiParseResponse>('/ai/parse/event', { text });
  const data = response.data;
  if ('parsed' in data && data.parsed && typeof data.parsed === 'object') {
    return { parsed: data.parsed as AiParseResult, raw_text: typeof data.raw_text === 'string' ? data.raw_text : text };
  }
  return { parsed: data as AiParseResult, raw_text: text };
}

export async function parseNote(text: string): Promise<AiParseResponse> {
  return httpClient.post<AiParseResponse>('/ai/parse/note', { text }).then((r) => r.data);
}

export async function parseObjectif(text: string): Promise<AiParseResponse> {
  return httpClient.post<AiParseResponse>('/ai/parse/objectif', { text }).then((r) => r.data);
}
