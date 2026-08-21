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
});
