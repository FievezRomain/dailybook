import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  imageUri?: string | null;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  /** Height as a percentage string (e.g. '40%') or number in px. Default: '40%' */
  height?: number | string;
}

export default function AppHeader({
  title,
  subtitle,
  imageUri,
  onBack,
  rightAction,
  height = '40%',
}: AppHeaderProps) {
  const { colors, fonts, tokens } = useAppTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic height accepts string|number
  const heroStyle = { width: '100%' as const, height } as any;

  const inner = (
    <>
      <LinearGradient
        colors={[tokens.overlays.transparent, tokens.overlays.heroGradientTo]}
        style={[
          styles.gradient,
          {
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing.md,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.textOnPrimary,
              fontFamily: fonts.bodyLarge.fontFamily,
              fontSize: tokens.fontSizes.xxl,
              marginBottom: tokens.spacing.xs,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              {
                color: tokens.overlays.onImageMuted,
                fontFamily: fonts.default.fontFamily,
                fontSize: tokens.fontSizes.sm,
                marginBottom: tokens.spacing.xs / 2,
              },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </LinearGradient>

      {onBack ? (
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              left: tokens.spacing.md,
              backgroundColor: tokens.overlays.heroControl,
              borderRadius: tokens.radii.xl,
              padding: tokens.spacing.sm,
            },
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Entypo name="chevron-left" size={22} color={colors.textOnPrimary} />
        </TouchableOpacity>
      ) : null}

      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : null}
    </>
  );

  if (imageUri) {
    return (
      <ImageBackground source={{ uri: imageUri }} style={heroStyle} resizeMode="cover">
        {inner}
      </ImageBackground>
    );
  }

  return (
    <View style={[heroStyle, { overflow: 'hidden' }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 80, color: tokens.overlays.onImageStrong, fontFamily: fonts.bodyLarge.fontFamily }}>
          {title[0]?.toUpperCase()}
        </Text>
      </View>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
  },
  subtitle: {
  },
  backButton: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
  },
  rightAction: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
});
