import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import * as Sentry from '@sentry/react-native';
import { env } from './config/env';

// Sentry actif uniquement en production (__DEV__ = false)
if (!env.IS_DEV && env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    debug: false,
  });
}

import { StatusBar } from 'expo-status-bar';
import { initTrackingActivity } from "./services/api/AuthService";
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { darkTheme, lightTheme } from "./theme/theme";
import * as Updates from 'expo-updates';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import { RootNavigator } from './navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // données considérées fraîches pendant 5 min
      retry: 2,
    },
  },
});

const IconComponent = (props: any) => <MaterialCommunityIcons {...props} />;

function ThemedApp() {
  const isDark = useThemeStore((s) => s.isDark);
  return (
    <PaperProvider
      theme={isDark ? darkTheme : lightTheme}
      settings={{ icon: IconComponent }}
    >
      <StatusBar style={isDark ? "light" : "dark"} translucent backgroundColor="rgba(0, 0, 0, 0)" />
      <RootNavigator />
    </PaperProvider>
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

      // Vérification et téléchargement des OTA
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdating(true);
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Mise à jour disponible",
            "Une nouvelle version a été téléchargée. L'application va redémarrer.",
            [{ text: "OK", onPress: async () => await Updates.reloadAsync() }],
          );
        }
      } catch (error) {
        console.log("Erreur lors de la vérification OTA:", error);
      } finally {
        setIsUpdating(false);
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
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    loaderText: {
      marginTop: 10,
      fontSize: 16,
      color: '#333',
    },
  });

  if (!fontsLoaded || isUpdating) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#956540" />
        <Text style={styles.loaderText}>
          {isUpdating ? "Téléchargement de la mise à jour…" : "Chargement…"}
        </Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <ThemedApp />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(App);
