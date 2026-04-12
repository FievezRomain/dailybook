import httpClient from './httpClient';

export async function getWishes() {
  const response = await httpClient.get('/wishes');
  return response.data;
}

export async function createWish(body: FormData | Record<string, unknown>) {
  const isMultipart = body instanceof FormData;
  const response = await httpClient.post('/wishes', body, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
    transformRequest: isMultipart ? (data) => data : undefined,
  });
  return response.data;
}

export async function updateWish(wishId: string, body: FormData | Record<string, unknown>) {
  const isMultipart = body instanceof FormData;
  const response = await httpClient.put(`/wishes/${wishId}`, body, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
    transformRequest: isMultipart ? (data) => data : undefined,
  });
  return response.data;
}

export async function deleteWish(wishId: string) {
  const response = await httpClient.delete(`/wishes/${wishId}`);
  return response.data;
}

// ─── Backward-compatible service adapter ────────────────────────────────────
const wishsServiceInstance = {
  create: (body: any) => createWish(body),
  update: (body: any) => updateWish(body.id, body),
};
export default wishsServiceInstance;
