import httpClient from '../httpClient';

function multipartConfig(body: unknown) {
  return body instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' as const }, transformRequest: (d: unknown) => d }
    : {};
}

/**
 * Génère les 4 opérations CRUD standard pour une ressource REST.
 *
 * @param basePath  Chemin de base, ex. '/contacts'
 *
 * Les méthodes create / update acceptent transparentement FormData (multipart)
 * ou un payload JSON. La détection se fait à l'exécution via instanceof FormData.
 */
export function createCrudService<TModel, TCreate, TUpdate>(basePath: string) {
  return {
    getAll: async (): Promise<TModel[]> => (await httpClient.get(basePath)).data,

    create: async (body: TCreate | FormData): Promise<TModel> =>
      (await httpClient.post(basePath, body, multipartConfig(body))).data,

    update: async (id: string, body: TUpdate | FormData): Promise<TModel> =>
      (await httpClient.put(`${basePath}/${id}`, body, multipartConfig(body))).data,

    remove: async (id: string): Promise<void> => { await httpClient.delete(`${basePath}/${id}`); },
  };
}
