import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Image } from 'expo-image';
import { Badge, Divider } from 'react-native-paper';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getNotifications } from '../../../services/api/NotificationService';

interface TopTabProps {
  message1?: string;
  message2?: string;
  withBackground?: boolean;
  withLogo?: boolean;
}

const TopTab: React.FC<TopTabProps> = ({
  message1,
  message2,
  withBackground = false,
  withLogo = false,
}) => {
  const { colors, fonts } = useAppTheme();
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

  const styles = StyleSheet.create({
    topTabContainer: {
      paddingTop:
        Constants.platform?.ios
          ? (Constants.statusBarHeight ?? 0) + 10
          : (Constants.statusBarHeight ?? 0) + 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: withLogo ? 10 : 30,
      paddingRight: 30,
      paddingBottom: 10,
    },
    textContainer: { flex: 1 },
    imageContainer: {
      flex: 1,
      gap: 20,
      justifyContent: 'flex-end',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: { fontSize: 18 },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 30,
      borderColor: colors.accent,
      borderWidth: 0.5,
    },
    text: { color: withBackground || !withLogo ? colors.default_dark : colors.background },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <View>
      <View style={styles.topTabContainer}>
        <View style={styles.textContainer}>
          {withBackground || withLogo ? (
            withBackground ? (
              <View style={{ marginTop: -5 }}>
                <Text style={[styles.text, styles.textFontRegular]}>{message1}</Text>
                <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -5 }}>
                <Image source={require('../../assets/logo.png')} style={{ height: 45, width: 45 }} />
                <Text style={[styles.textFontMedium, { color: colors.accent, fontSize: 25 }]}>
                  VASCO
                </Text>
              </View>
            )
          ) : (
            <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
          )}
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification' as never)}>
            <Ionicons name="notifications" size={25} color={colors.default_dark} />
            {nbNotifications > 0 && (
              <Badge style={{ position: 'absolute', left: 15, bottom: 10 }} size={20} visible>
                {nbNotifications}
              </Badge>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)}>
            {firebaseUser &&
            firebaseUser.photoURL !== undefined &&
            firebaseUser.photoURL !== null ? (
              <Image
                style={styles.avatar}
                source={{ uri: `${firebaseUser.photoURL}` }}
                cachePolicy="disk"
              />
            ) : (
              <View style={{ paddingVertical: 10 }}>
                <FontAwesome5 size={20} color={colors.default_dark} name="user-alt" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {!withBackground && (
        <Divider style={{ height: 0.4, backgroundColor: colors.quaternary }} />
      )}
    </View>
  );
};

export default TopTab;
