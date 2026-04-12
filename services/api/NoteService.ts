import httpClient from './httpClient';

export async function getNotes() {
  const response = await httpClient.get('/notes');
  return response.data;
}

export async function createNote(body: Record<string, unknown>) {
  const response = await httpClient.post('/notes', body);
  return response.data;
}

export async function updateNote(noteId: string, body: Record<string, unknown>) {
  const response = await httpClient.put(`/notes/${noteId}`, body);
  return response.data;
}

export async function deleteNote(noteId: string) {
  const response = await httpClient.delete(`/notes/${noteId}`);
  return response.data;
}

// ─── Backward-compatible service adapter ────────────────────────────────────
const notesServiceInstance = {
  create: (body: any) => createNote(body),
  update: (body: any) => updateNote(body.id, body),
};
export default notesServiceInstance;
