/**
 * Hook de gestion de la langue de l'app.
 *
 * - Charge la langue persistée depuis SecureStore au démarrage (`hydrate`)
 * - Expose `language`, `setLanguage(code)`, `availableLanguages`
 * - Persistance via `secureStorage` (clé : `app_language`)
 */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secureStorage } from '../utils/secureStorage';
import LoggerService from '../services/logs/LoggerService';

export type AppLanguage = 'fr' | 'en';

export const SUPPORTED_LANGUAGES: { code: AppLanguage; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const STORAGE_KEY = 'app_language';

export function isSupportedLanguage(value: string | null | undefined): value is AppLanguage {
  return value === 'fr' || value === 'en';
}

export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<AppLanguage>(
    isSupportedLanguage(i18n.language) ? i18n.language : 'fr',
  );

  // Hydrate au montage : applique la préférence persistée si elle existe.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await secureStorage.getItem(STORAGE_KEY);
      if (!mounted || !isSupportedLanguage(stored)) return;
      if (stored !== i18n.language) {
        await i18n.changeLanguage(stored);
      }
      setLanguageState(stored);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = useCallback(
    async (code: AppLanguage): Promise<void> => {
      try {
        await i18n.changeLanguage(code);
        await secureStorage.setItem(STORAGE_KEY, code);
        setLanguageState(code);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'unknown error';
        LoggerService.log('useLanguage.setLanguage failed: ' + msg);
      }
    },
    [i18n],
  );

  return {
    language,
    setLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
  } as const;
}
