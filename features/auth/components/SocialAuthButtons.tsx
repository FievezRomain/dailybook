/**
 * Boutons d'authentification sociale (Google + Apple).
 *
 * - Google : disponible sur iOS + Android (nécessite `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`)
 * - Apple : iOS uniquement (vérifié à l'exécution via `expo-apple-authentication`)
 *
 * Délègue à `authService.signInWithGoogle()` / `signInWithApple()`.
 * Affiche un toast d'erreur en cas d'échec ; ignore silencieusement les annulations.
 */
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { isGoogleSigninAvailable } from '../../../services/auth/googleSigninModule';
import { useAppTheme } from '../../../theme/useAppTheme';
import LoggerService from '../../../services/logs/LoggerService';

type Provider = 'google' | 'apple';

interface SocialAuthButtonsProps {
  /** Callback appelé après un succès de connexion (ex : navigation vers Loading). */
  onSuccess?: () => void;
}

export default function SocialAuthButtons({ onSuccess }: SocialAuthButtonsProps) {
  const { colors, fonts, tokens } = useAppTheme();
  const { t } = useTranslation('auth');
  const [loading, setLoading] = useState<Provider | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const googleAvailable = isGoogleSigninAvailable();

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);

  const handlePress = async (provider: Provider) => {
    setLoading(provider);
    try {
      if (provider === 'google') {
        await authService.signInWithGoogle();
      } else {
        await authService.signInWithApple();
      }
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'unknown';
      // Annulation silencieuse
      if (/cancel|annul/i.test(msg)) return;
      LoggerService.log(`SocialAuth(${provider}) error: ${msg}`);
      Toast.show({ type: 'error', position: 'top', text1: t('socialAuthError') });
    } finally {
      setLoading(null);
    }
  };

  const baseButton = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: tokens.spacing.sm + 2,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radii.pill,
    gap: tokens.spacing.sm,
    width: '100%' as const,
  };

  const showApple = Platform.OS === 'ios' && appleAvailable;
  if (!googleAvailable && !showApple) return null;

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.default.fontFamily, paddingHorizontal: tokens.spacing.sm }}>
          {t('orDivider')}
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      {googleAvailable && (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('continueWithGoogle')}
        disabled={loading !== null}
        onPress={() => handlePress('google')}
        style={[
          baseButton,
          {
            backgroundColor: colors.surface,
            borderWidth: tokens.borderHairline * 2,
            borderColor: colors.border,
            opacity: loading !== null && loading !== 'google' ? 0.5 : 1,
          },
        ]}
      >
        {loading === 'google' ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <FontAwesome name="google" size={18} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.medium.fontFamily, fontSize: tokens.fontSizes.md }}>
              {t('continueWithGoogle')}
            </Text>
          </>
        )}
      </TouchableOpacity>
      )}

      {showApple && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('continueWithApple')}
          disabled={loading !== null}
          onPress={() => handlePress('apple')}
          style={[
            baseButton,
            {
              backgroundColor: colors.textPrimary,
              marginTop: tokens.spacing.sm,
              opacity: loading !== null && loading !== 'apple' ? 0.5 : 1,
            },
          ]}
        >
          {loading === 'apple' ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <FontAwesome name="apple" size={18} color={colors.background} />
              <Text style={{ color: colors.background, fontFamily: fonts.medium.fontFamily, fontSize: tokens.fontSizes.md }}>
                {t('continueWithApple')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', paddingHorizontal: 24, marginTop: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 12 },
  dividerLine: { flex: 1, height: 1 },
});
