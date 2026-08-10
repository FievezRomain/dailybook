import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { BrandLoader } from '../../shared/components/ui';
import { useAuthStore } from '../../stores/useAuthStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export function RootNavigator() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const requiresEmailVerification = Boolean(isAuthenticated && firebaseUser && !firebaseUser.emailVerified);
  return <NavigationContainer>{isLoading ? <View accessibilityState={{ busy: true }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><BrandLoader size="full" accessibilityLabel="Ouverture de Vasco" /></View> : requiresEmailVerification ? <AuthNavigator initialRouteName="VerifyEmail" /> : isAuthenticated ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
