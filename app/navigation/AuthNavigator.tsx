import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ForgotPasswordScreen, RegisterIdentityScreen, RegisterMethodScreen, RegisterSecurityScreen, SignInScreen, VerifyEmailScreen, WelcomeScreen, type AuthStackParamList } from '../../features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator({ initialRouteName = 'Welcome' }: { initialRouteName?: keyof AuthStackParamList }) {
  return <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="Welcome" component={WelcomeScreen} /><Stack.Screen name="SignIn" component={SignInScreen} /><Stack.Screen name="RegisterMethod" component={RegisterMethodScreen} /><Stack.Screen name="RegisterIdentity" component={RegisterIdentityScreen} /><Stack.Screen name="RegisterSecurity" component={RegisterSecurityScreen} /><Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} /><Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /></Stack.Navigator>;
}
