import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import * as Sentry from '@sentry/react-native';
import { env } from './config/env';
import LoggerService from './services/logs/LoggerService';

// i18n must be imported before any component that uses translations
import './config/i18n';

// Sentry actif uniquement en production (__DEV__ = false)
if (!env.IS_DEV && env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    debug: false,
    tracesSampleRate: 0.2,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
    beforeSend(event) {
      if (__DEV__) return null;

      // Redact PII (emails, tokens, passwords) from messages, exceptions and request payloads
      const redactString = (s?: string): string | undefined => {
        if (!s) return s;
        return s
          .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
          .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [token]')
          .replace(/(password|pwd|secret|token|idToken)["':\s]+[^"',\s}]+/gi, '$1=[redacted]');
      };

      if (event.message) event.message = redactString(event.message)!;
      event.exception?.values?.forEach((v) => {
        if (v.value) v.value = redactString(v.value);
      });
      event.breadcrumbs?.forEach((b) => {
        if (b.message) b.message = redactString(b.message);
      });
      if (event.request?.data && typeof event.request.data === 'object') {
        const data = event.request.data as Record<string, unknown>;
        ['password', 'password_confirm', 'currentPassword', 'newPassword', 'confirmPassword', 'token', 'idToken']
          .forEach((k) => {
            if (k in data) data[k] = '[redacted]';
          });
      }
      return event;
    },
  });
}

import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { initTrackingActivity } from "./services/api/AuthService";
import { initSocialAuth } from './services/auth/initSocialAuth';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from './theme/tamagui.config';
import { lightTokens } from './theme/tokens';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Updates from 'expo-updates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import { RootNavigator } from './navigation/RootNavigator';
import { useOnboarding } from './features/onboarding/hooks/useOnboarding';
import OnboardingSpotlight from './features/onboarding/components/OnboardingSpotlight';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        const { parseApiError } = require('./utils/errorParser');
        const parsed = parseApiError(error);
        if (!parsed.isNetworkError && !parsed.isAuthError) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});

function ThemedApp() {
  const isDark = useThemeStore((s) => s.isDark);
  const themeName = isDark === true ? 'dark' : 'light';
  const user = useAuthStore((s) => s.user);
  const { isCompleted, complete, skip } = useOnboarding();
  const showOnboarding = !!user && isCompleted === false;

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <Theme name={themeName}>
        <BottomSheetModalProvider>
          <StatusBar style={isDark ? "light" : "dark"} translucent backgroundColor={lightTokens.overlays.transparent} />
          <RootNavigator />
          <OnboardingSpotlight visible={showOnboarding} onComplete={complete} onSkip={skip} />
        </BottomSheetModalProvider>
      </Theme>
    </TamaguiProvider>
  );
}

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    // Lance l'écoute Firebase auth state
    const unsubscribe = initAuth();

    const initializeApp = async () => {
      await loadFonts();
      setFontsLoaded(true);
      initTrackingActivity();
      initSocialAuth();

      if (!__DEV__) {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            setIsUpdating(true);
            await Updates.fetchUpdateAsync();
            Toast.show({
              type: 'info',
              position: 'top',
              text1: 'Mise à jour disponible',
              text2: "Une nouvelle version a été téléchargée. L'application va redémarrer.",
            });
            await Updates.reloadAsync();
          }
        } catch (error) {
          LoggerService.error('OTA update check failed', error, {
            feature: 'app',
            operation: 'ota_update_check',
          });
        } finally {
          setIsUpdating(false);
        }
      }
    };

    initializeApp();

    return unsubscribe;
  }, []);

  const loadFonts = () =>
    Font.loadAsync({
      'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
      'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
      'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
      'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
      'Quicksand-SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
    });

  const styles = StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: lightTokens.surface,
    },
    loaderText: {
      marginTop: lightTokens.spacing.sm,
      fontSize: lightTokens.fontSizes.md,
      color: lightTokens.textPrimary,
    },
  });

  if (!fontsLoaded || isUpdating) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={lightTokens.primary} />
        <Text style={styles.loaderText}>
          {isUpdating ? "Téléchargement de la mise à jour…" : "Chargement…"}
        </Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.appContainer}>
        <ThemedApp />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default !env.IS_DEV && env.SENTRY_DSN ? Sentry.wrap(App) : App;
