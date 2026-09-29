import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { parseApiError } from '../utils/errorParser';
import { AppErrorCode } from '../types/AppErrorCode';

export function useErrorToast() {
  const showError = useCallback((error: unknown, onRetry?: () => void) => {
    const parsed = parseApiError(error);

    // VALIDATION_ERROR → inline on fields, never toast
    if (parsed.code === AppErrorCode.VALIDATION_ERROR) return;

    // QUOTA_EXCEEDED → handled separately (upgrade prompt)
    if (parsed.isQuotaError) {
      Toast.show({
        type: 'info',
        position: 'top',
        text1: 'Limite atteinte',
        text2: parsed.message,
      });
      return;
    }

    Toast.show({
      type: 'error',
      position: 'top',
      text1: parsed.isNetworkError ? 'Connexion perdue' : 'Une erreur est survenue',
      text2: parsed.message,
      ...(onRetry && {
        onPress: onRetry,
        text2: `${parsed.message} — Appuyer pour réessayer`,
      }),
    });
  }, []);

  return { showError };
}
