/**
 * Instance Axios centralisée.
 *
 * - baseURL : résolution automatique dev/prod via config/env.ts
 * - Intercepteur request : injection du token Firebase dans x-access-token
 * - Intercepteur response : unbox de l'enveloppe { success, data, meta } → retourne data directement
 * - Gestion d'erreurs centralisée : 401 signOut, 403 et 500 rejetés avec messages lisibles
 *
 * Aucun autre fichier ne doit créer d'instance axios ni définir axios.defaults.
 */

import type axiosType from 'axios';
import { authService } from '../auth/FirebaseAuthService';
// useAuthStore importé en lazy dans l'intercepteur 401 pour casser le cycle :
// AuthService → httpClient → useAuthStore → AuthService
import { env } from '../../config/env';

type AxiosModule = typeof axiosType & { default?: typeof axiosType };
const axiosModule = require('axios') as AxiosModule;
const axios = axiosModule.default ?? axiosModule;

const httpClient = axios.create({
  baseURL: env.API_URL,
});

// ─── Request : injection automatique du token Firebase ───────────────────────
httpClient.interceptors.request.use(async (config) => {
  const token = await authService.getIdToken();
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

// ─── Response : unbox { success, data, meta } et gestion d'erreurs ───────────
httpClient.interceptors.response.use(
  (response) => {
    // Le back renvoie toujours { success: true, data: ..., meta: ... }
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data
    ) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // require() lazy : évalué uniquement à l'appel, jamais au chargement du module
      const { useAuthStore } = require('../../stores/useAuthStore') as typeof import('../../stores/useAuthStore');
      useAuthStore.getState().signOutUser();
      return Promise.reject(
        new Error("Session expirée. Veuillez vous reconnecter."),
      );
    }

    if (status === 403) {
      return Promise.reject(
        new Error("Vous ne disposez pas des droits pour effectuer cette action."),
      );
    }

    if (status === 500) {
      return Promise.reject(
        new Error("Un problème est survenu sur le serveur."),
      );
    }

    return Promise.reject(error);
  },
);

export default httpClient;
