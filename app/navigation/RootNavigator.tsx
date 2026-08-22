import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import { BrandLoader } from '../../shared/components/ui';
import { useAuthStore } from '../../stores/useAuthStore';
import { spacing, typography } from '../../theme/scales';
import { useAppTheme } from '../../theme/useAppTheme';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export function RootNavigator() {
  const { colors } = useAppTheme();
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const requiresEmailVerification = Boolean(isAuthenticated && firebaseUser && !firebaseUser.emailVerified);
  return <NavigationContainer>{isLoading ? <View accessibilityState={{ busy: true }} style={{ flex: 1, alignItems: 'center', paddingBottom: spacing.xl }}><View style={{ flex: 1, justifyContent: 'center' }}><BrandLoader size="display" accessibilityLabel="Ouverture de Vasco" /></View><View style={{ alignItems: 'center', gap: spacing.xs }}><Text style={{ color: colors.primary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, letterSpacing: 0.8 }}>from VASCO AND CO</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>Version {Constants.expoConfig?.version ?? ''}</Text></View></View> : requiresEmailVerification ? <AuthNavigator initialRouteName="VerifyEmail" /> : isAuthenticated ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
