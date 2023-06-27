import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AuthenticatedUserContext from "./providers/AuthenticatedUserProvider";
import AuthStack from "./navigation/AuthStack";

export default function App() {
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



  return (
    <NavigationContainer>
      <AuthenticatedUserContext>
        <AuthStack/>
        <Toast />
      </AuthenticatedUserContext>
    </NavigationContainer>
  );
};
