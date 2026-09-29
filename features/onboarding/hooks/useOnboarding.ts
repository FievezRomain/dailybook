import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'onboarding_completed';

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((value) => setIsCompleted(value === 'true'))
      .catch(() => setIsCompleted(true));
  }, []);

  const complete = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true').catch(() => undefined);
    setIsCompleted(true);
  }, []);

  const skip = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true').catch(() => undefined);
    setIsCompleted(true);
  }, []);

  const reset = useCallback(async () => {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY).catch(() => undefined);
    setIsCompleted(false);
  }, []);

  return { isCompleted, complete, skip, reset };
}
