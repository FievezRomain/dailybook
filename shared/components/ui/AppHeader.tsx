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
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        style={styles.gradient}
      >
        <Text
          style={[styles.title, { fontFamily: fonts.bodyLarge.fontFamily }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { fontFamily: fonts.default.fontFamily }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </LinearGradient>

      {onBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Entypo name="chevron-left" size={22} color="#fff" />
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
        <Text style={{ fontSize: 80, color: 'rgba(255,255,255,0.9)', fontFamily: fonts.bodyLarge.fontFamily }}>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  rightAction: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
});
