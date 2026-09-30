import './config/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Appearance, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';
import { RootNavigator } from './app/navigation/RootNavigator';
import { initSocialAuth } from './services/auth/initSocialAuth';
import { initTrackingActivity } from './services/api/AuthService';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import tamaguiConfig from './theme/tamagui.config';
import { darkTokens, lightTokens } from './theme/tokens';
import { parseApiError } from './utils/errorParser';
import { NotificationRuntime } from './services/notifications/NotificationRuntime';
import { env } from './config/env';

const sentryEnabled = !env.IS_DEV && Boolean(env.SENTRY_DSN);

if (sentryEnabled) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    enabled: true,
    environment: Updates.channel ?? 'production',
    release: Updates.runtimeVersion ? `vasco@${Updates.runtimeVersion}` : undefined,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        const parsed = parseApiError(error);
        return (parsed.isNetworkError || parsed.isAuthError) && failureCount < 2;
      },
    },
    mutations: { retry: 0 },
  },
});

function VascoApplication() {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const syncSystemTheme = useThemeStore((state) => state.syncSystemTheme);
  const tokens = resolvedTheme === 'dark' ? darkTokens : lightTokens;

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => syncSystemTheme(colorScheme));
    return () => subscription.remove();
  }, [syncSystemTheme]);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={resolvedTheme}>
      <Theme name={resolvedTheme}>
        <View style={{ flex: 1, backgroundColor: tokens.surface }}>
          <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
          <RootNavigator />
        </View>
      </Theme>
    </TamaguiProvider>
  );
}

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    void Font.loadAsync({
      'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
      'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
      'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
      'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
      'Quicksand-SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
    }).then(() => setFontsLoaded(true));
    initTrackingActivity();
    initSocialAuth();
    return unsubscribe;
  }, [initAuth]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationRuntime />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <VascoApplication />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default sentryEnabled ? Sentry.wrap(App) : App;
