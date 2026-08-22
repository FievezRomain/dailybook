import fs from 'node:fs';
import path from 'node:path';

const read = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, '../../..', relativePath), 'utf8');

describe('Vasco authentication flow', () => {
  it('keeps authentication forms reachable and dismisses the keyboard', () => {
    const screen = read('features/auth/components/AuthScreen.tsx');
    expect(screen).toContain("require('../../../assets/wallpaper_login.png')");
    expect(screen).toContain('onPress={Keyboard.dismiss}');
    expect(screen).toContain("keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}");
    expect(read('features/auth/screens/ForgotPasswordScreen.tsx')).not.toContain('<AuthScreen scroll={false}');
    expect(read('features/auth/screens/RegisterIdentityScreen.tsx')).not.toContain('<AuthScreen scroll={false}');
  });

  it('routes unverified accounts to verification and refreshes on app resume', () => {
    const root = read('app/navigation/RootNavigator.tsx');
    const verification = read('features/auth/screens/VerifyEmailScreen.tsx');
    expect(root).toContain('!firebaseUser.emailVerified');
    expect(root).toContain('<AuthNavigator initialRouteName="VerifyEmail" />');
    expect(verification).toContain("AppState.addEventListener('change'");
    expect(verification).toContain('refreshFirebaseUser()');
    expect(verification).toContain('authService.sendEmailVerification()');
  });

  it('opens one backend session only for verified Firebase accounts', () => {
    const store = read('stores/useAuthStore.ts');
    const api = read('services/api/AuthService.ts');
    const registration = read('features/auth/screens/RegisterSecurityScreen.tsx');
    expect(store).toContain('if (authUser.emailVerified)');
    expect(api).toContain("httpClient.post('/auth/session'");
    expect(api).not.toContain('/auth/login');
    expect(api).not.toContain('/auth/register');
    expect(registration).not.toContain('await register(');
  });

  it('shows the animal icon without a creation action in the event empty state', () => {
    const animalsStep = read('features/events/screens/EventCreateAnimalsScreen.tsx');
    expect(animalsStep).toContain('icon="animals"');
    expect(animalsStep).not.toContain('actionLabel="Ajouter un animal"');
    expect(animalsStep).not.toContain('onCreateAnimal');
  });

  it('reauthenticates every supported provider before deleting the Firebase account', () => {
    const service = read('services/auth/FirebaseAuthService.ts');
    const settings = read('features/settings/screens/SettingsDetailScreens.tsx');
    expect(service).toContain("providerIds.includes('password')");
    expect(service).toContain("providerIds.includes('google.com')");
    expect(service).toContain("providerIds.includes('apple.com')");
    expect(service).toContain('reauthenticateWithCredential(user');
    expect(settings).toContain('await authService.reauthenticateCurrentUser');
    expect(settings).toContain('await authService.deleteCurrentUser()');
    expect(settings).toContain('Vos données applicatives seront conservées pour le moment.');
  });
});
