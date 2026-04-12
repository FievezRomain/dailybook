import httpClient from './httpClient';

export async function getContacts() {
  const response = await httpClient.get('/contacts');
  return response.data;
}

export async function createContact(body: Record<string, unknown>) {
  const response = await httpClient.post('/contacts', body);
  return response.data;
}

export async function updateContact(contactId: string, body: Record<string, unknown>) {
  const response = await httpClient.put(`/contacts/${contactId}`, body);
  return response.data;
}

export async function deleteContact(contactId: string) {
  const response = await httpClient.delete(`/contacts/${contactId}`);
  return response.data;
}

// ─── Backward-compatible service adapter ────────────────────────────────────
const contactsServiceInstance = {
  create: (body: any) => createContact(body),
  update: (body: any) => updateContact(body.id, body),
};
export default contactsServiceInstance;
