import { NavigationContainer } from "@react-navigation/native";
import { AuthenticatedUserProvider } from "./contexts/AuthenticatedUserProvider";
import AuthStack from "./navigation/AuthStack";
import * as Font from 'expo-font';
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator } from "react-native";
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
  const authService = new AuthService;

  Sentry.init({
    dsn: 'https://f6cde365af7bd130a50a9fac22144580@o4507714688516096.ingest.de.sentry.io/4507714690809936', // Remplacez par votre DSN Sentry
    debug: false, // Passez à false en production
  });

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
    authService.initTrackingActivity();
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

  return (
    fontsLoaded ?
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
      :
      <ActivityIndicator size={10} />
    
    
  );
};

export default Sentry.wrap(App);
