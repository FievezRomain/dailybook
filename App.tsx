import { NavigationContainer } from "@react-navigation/native";
import { AuthenticatedUserProvider } from "./contexts/AuthenticatedUserProvider";
import AuthStack from "./navigation/AuthStack";
import * as Font from 'expo-font';
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';
import AuthService from "./services/api/AuthService";
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider, ThemeContext } from './contexts/ThemeProvider';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimauxProvider } from "./contexts/AnimauxProvider";
import { EventsProvider } from "./contexts/EventsProvider";
import { ObjectifsProvider } from "./contexts/ObjectifsProvider";
import { NotesProvider } from "./contexts/NotesProvider";
import { ContactsProvider } from "./contexts/ContactsProvider";
import { WishProvider } from "./contexts/WishProvider";
import { GroupProvider } from "./contexts/GroupProvider";
import { darkTheme, lightTheme } from "./theme/theme";
import * as Updates from 'expo-updates';

function ThemedApp() {
  const { isDarkTheme } = useContext(ThemeContext);
  return (
    <PaperProvider theme={isDarkTheme ? darkTheme : lightTheme}> 
      <NavigationContainer>
          <StatusBar style={isDarkTheme ? "light" : "dark"} translucent backgroundColor="rgba(0, 0, 0, 0)" />
          <AuthStack />
      </NavigationContainer>
    </PaperProvider>
  );
}

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const authService = new AuthService;

  Sentry.init({
    dsn: 'https://f6cde365af7bd130a50a9fac22144580@o4507714688516096.ingest.de.sentry.io/4507714690809936', // Remplacez par votre DSN Sentry
    debug: false, // Passez à false en production
  });

  useEffect(() => {

    const initializeApp = async () => {
      await loadFonts();
      setFontsLoaded(true);
      authService.initTrackingActivity();

      // Vérification et téléchargement des OTA
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdating(true);
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Mise à jour disponible",
            "Une nouvelle version a été téléchargée. L'application va redémarrer.",
            [
              {
                text: "OK",
                onPress: async () => {
                  await Updates.reloadAsync();
                }
              }
            ]
          );
        }
      } catch (error) {
        console.log("Erreur lors de la vérification OTA:", error);
      } finally {
        setIsUpdating(false);
      }
    }

    initializeApp();
    
  }, []);

  /*const navigation = useNavigation();
  const authService = new AuthService;
  const { setUser } = useContext(AuthenticatedUserProvider);

  useEffect( async () => {
    const unsubscribe = navigation.addListener("state", () => {
      authService.getUser().then((myUser) => {
        setUser(myUser);
      })
    });
    return unsubscribe;
  }, [navigation]) */

  const loadFonts = () => {
    return Font.loadAsync({
      'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
      'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
      'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
      'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
      'Quicksand-SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf')
    });
  };

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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>
          {isUpdating ? "Téléchargement de la mise à jour…" : "Chargement…"}
        </Text>
      </View>
    );
  }

  return (
    <>
      <GroupProvider>
        <AnimauxProvider>
          <EventsProvider>
            <ObjectifsProvider>
              <NotesProvider>
                <ContactsProvider>
                  <WishProvider>
                    <AuthenticatedUserProvider>
                      <GestureHandlerRootView>
                        <ThemeProvider>
                          <ThemedApp />
                        </ThemeProvider>
                      </GestureHandlerRootView>
                    </AuthenticatedUserProvider>
                  </WishProvider>
                </ContactsProvider>
              </NotesProvider>
            </ObjectifsProvider>
          </EventsProvider>
        </AnimauxProvider>
      </GroupProvider>
    </>
  );
};

export default Sentry.wrap(App);
