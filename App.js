import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { AuthenticatedUserProvider } from "./providers/AuthenticatedUserProvider";
import AuthStack from "./navigation/AuthStack";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
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
      'Quicksand-Regular': require('./assets/fonts/Quicksand-VariableFont_wght.ttf')
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  return (
    <NavigationContainer>
      <AuthenticatedUserProvider>
        <AuthStack/>
        <Toast />
      </AuthenticatedUserProvider>
    </NavigationContainer>
  );
};
