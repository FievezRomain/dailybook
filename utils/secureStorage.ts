/**
 * Adaptateur SecureStore compatible avec l'interface AsyncStorage.
 *
 * Permet de remplacer AsyncStorage par expo-secure-store dans :
 * - firebase.ts (getReactNativePersistence)
 * - zustand persist storage
 *
 * Les clés sont préfixées pour éviter les collisions.
 * Les valeurs volumineuses (token Firebase > 2048 octets) passent automatiquement
 * par SecureStore qui supporte jusqu'à ~10 Ko par clé sur iOS/Android.
 */
import * as SecureStore from 'expo-secure-store';

const KEY_PREFIX = 'mdb_';

function sanitizeKey(key: string): string {
  // SecureStore n'accepte que les caractères alphanumériques, -, _, .
  return (KEY_PREFIX + key).replace(/[^a-zA-Z0-9_\-.]/g, '_');
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(sanitizeKey(key));
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(sanitizeKey(key), value);
    } catch (err: unknown) {
      if (__DEV__) console.warn('[secureStorage] setItem failed', err);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(sanitizeKey(key));
    } catch (err: unknown) {
      if (__DEV__) console.warn('[secureStorage] removeItem failed', err);
    }
  },
};
