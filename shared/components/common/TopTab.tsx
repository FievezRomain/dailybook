import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Image } from 'expo-image';
import { AppBadge } from '../ui';
import { useAppTheme } from '../../../theme/useAppTheme';
import { fontSizes, fonts as fontTokens } from '../../../theme/tokens';
import { getNotifications } from '../../../services/api/NotificationService';

interface TopTabProps {
  message1?: string;
  message2?: string;
  withBackground?: boolean;
  withLogo?: boolean;
  largeTitle?: boolean;
}

const TopTab: React.FC<TopTabProps> = ({
  message1,
  message2,
  withBackground = false,
  withLogo = false,
  largeTitle = false,
}) => {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { firebaseUser } = useAuthStore();
  const [nbNotifications, setNbNotifications] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getNotificationsNumber();
    }, []),
  );

  const getNotificationsNumber = async () => {
    const response = await getNotifications();
    setNbNotifications(response.unreadCount);
  };

  const textColor = withBackground || !withLogo ? colors.primaryDark : colors.background;

  return (
    <BlurView
      intensity={withBackground ? 0 : 20}
      tint={isDark ? 'dark' : 'light'}
      style={[
        styles.container,
        {
          paddingTop: insets.top + 10,
          borderBottomColor: colors.border,
          backgroundColor: withBackground ? colors.background : 'transparent',
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.textContainer}>
          {withLogo ? (
            <View style={styles.logoRow}>
              <Image source={require('../../../assets/logo.png')} style={styles.logo} />
              <Text style={[styles.logoText, { color: colors.primary }]}>VASCO</Text>
            </View>
          ) : largeTitle ? (
            <View style={{ marginTop: -4 }}>
              {message1 ? (
                <Text style={[styles.subtitle, { color: textColor }]}>{message1}</Text>
              ) : null}
              <Text style={[styles.largeTitleText, { color: textColor }]}>{message2}</Text>
            </View>
          ) : (
            <Text style={[styles.title, { color: textColor }]}>{message2}</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification' as never)}>
            <Ionicons name="notifications" size={25} color={textColor} />
            {nbNotifications > 0 && (
              <AppBadge
                label={String(nbNotifications)}
                variant="primary"
                style={{ position: 'absolute', left: 15, bottom: 10 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)} style={{ marginLeft: 16 }}>
            {firebaseUser?.photoURL ? (
              <Image style={styles.avatar} source={{ uri: firebaseUser.photoURL }} cachePolicy="disk" />
            ) : (
              <View style={{ paddingVertical: 10 }}>
                <FontAwesome5 size={20} color={textColor} name="user-alt" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: { flex: 1 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fontTokens.bold,
  },
  largeTitleText: {
    fontSize: fontSizes.xl,
    fontFamily: fontTokens.bold,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontTokens.regular,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  logo: { height: 45, width: 45 },
  logoText: {
    fontFamily: fontTokens.semiBold,
    fontSize: 25,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default TopTab;
