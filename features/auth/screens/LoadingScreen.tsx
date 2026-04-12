import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import Constants from 'expo-constants';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import type { AuthStackScreenProps } from '../../../navigation/types';

export default function LoadingScreen({ navigation }: AuthStackScreenProps<'Loading'>) {
  const { colors, fonts } = useAppTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const { data: animaux } = useAnimalsQuery();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !firebaseUser) {
      navigation.navigate('Home');
      return;
    }

    if (firebaseUser && !firebaseUser.emailVerified) {
      navigation.navigate('VerifyEmail');
      return;
    }

    if (firebaseUser.emailVerified) {
      if (Array.isArray(animaux) && animaux.length > 0) {
        navigation.navigate('App', { screen: 'Tab', params: { screen: 'Accueil' } });
      } else if (animaux !== undefined) {
        // Only navigate when query has finished (animaux not undefined)
        (navigation as any).navigate('FirstPageAddAnimal');
      }
    }
  }, [isLoading, isAuthenticated, firebaseUser, animaux, navigation]);

  const styles = StyleSheet.create({
    loaderEvent: { width: 150, height: 150 },
    loadingEvent: {
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  });

  return (
    <View style={styles.loadingEvent}>
      <Image style={styles.loaderEvent} source={require('../../../assets/loader.gif')} />
      <View style={{ position: 'absolute', bottom: 0, marginBottom: 50 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[{ color: colors.quaternary, fontSize: 22 }, styles.textFontRegular]}>From</Text>
          <Text style={[{ color: colors.neutral, fontSize: 22 }, styles.textFontRegular]}> Vasco & Co</Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={[styles.textFontRegular, { color: colors.neutral, textAlign: 'center' }]}>
            {Constants.expoConfig?.version}
          </Text>
        </View>
      </View>
    </View>
  );
}
