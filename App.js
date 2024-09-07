import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { AuthenticatedUserProvider } from "./providers/AuthenticatedUserProvider";
import AuthStack from "./navigation/AuthStack";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';


function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  Sentry.init({
    dsn: 'https://f6cde365af7bd130a50a9fac22144580@o4507714688516096.ingest.de.sentry.io/4507714690809936', // Remplacez par votre DSN Sentry
    enableInExpoDevelopment: true,
    debug: true, // Passez à false en production
  });

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
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
          <NavigationContainer>
            <AuthenticatedUserProvider>
              <StatusBar style="dark" translucent backgroundColor="rgba(0, 0, 0, 0)" />
              <AuthStack/>
              <Toast />
            </AuthenticatedUserProvider>
          </NavigationContainer>
      :
      <ActivityIndicator size={10} />
    
    
  );
};

export default Sentry.wrap(App);
