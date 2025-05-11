import { NavigationContainer } from "@react-navigation/native";
import { AuthenticatedUserProvider } from "./providers/AuthenticatedUserProvider";
import AuthStack from "./navigation/AuthStack";
import * as Font from 'expo-font';
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator } from "react-native";
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';
import AuthService from "./services/AuthService";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import variables from './components/styles/Variables';
import { ThemeProvider, ThemeContext } from './providers/ThemeProvider';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimauxProvider } from "./providers/AnimauxProvider";
import { EventsProvider } from "./providers/EventsProvider";
import { ObjectifsProvider } from "./providers/ObjectifsProvider";
import { NotesProvider } from "./providers/NotesProvider";
import { ContactsProvider } from "./providers/ContactsProvider";
import { WishProvider } from "./providers/WishProvider";
import { GroupProvider } from "./providers/GroupProvider";

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: variables.alezan,
    secondary: variables.gris,
    tertiary: variables.aubere,
    quaternary: variables.rouan,
    outline: variables.rouan,
    neutral: variables.isabelle,
    minor: variables.palomino,
    accent: variables.bai,
    secondaryContainer: variables.bai,
    text: variables.bai_brun,
    error: variables.bai_cerise, 
    background: variables.blanc,
    onSurface: variables.default,
    default_dark: variables.default_dark,
  },
  fonts: {
    default: { fontFamily: variables.fontRegular },
    bodyMedium: { fontFamily: variables.fontMedium },
    bodySmall: { fontFamily: variables.fontLight },
    bodyLarge: { fontFamily: variables.fontBold },
    labelMedium: { fontFamily: variables.fontMedium },
    labelLarge: { fontFamily: variables.fontBold },
    headlineSmall: { fontFamily: variables.fontRegular },
  },
};

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: variables.alezan,
    secondary: variables.gris,
    tertiary: variables.aubere,
    quaternary: variables.rouan,
    outline: variables.rouan,
    neutral: variables.isabelle,
    minor: variables.palomino,
    accent: variables.bai,
    secondaryContainer: variables.bai,
    text: variables.bai_brun,
    error: variables.bai_cerise, 
    background: variables.noir,
    onSurface: variables.default_dark,
    default_dark: variables.blanc,
  },
  fonts: {
    default: { fontFamily: variables.fontRegular },
    bodyMedium: { fontFamily: variables.fontMedium },
    bodySmall: { fontFamily: variables.fontLight },
    bodyLarge: { fontFamily: variables.fontBold },
    labelMedium: { fontFamily: variables.fontMedium },
    labelLarge: { fontFamily: variables.fontBold },
    headlineSmall: { fontFamily: variables.fontRegular },
  },
};

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
    //dsn: 'https://f6cde365af7bd130a50a9fac22144580@o4507714688516096.ingest.de.sentry.io/4507714690809936', // Remplacez par votre DSN Sentry
    enableInExpoDevelopment: false,
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
