import httpClient from './httpClient';
import { LoginPayload, RegisterPayload, UpdateUserPayload } from '../../features/auth/types';
import { UserProfile } from '../../models/User';
import * as Notifications from 'expo-notifications';
import * as TrackingTransparency from 'expo-tracking-transparency';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function login(data: LoginPayload): Promise<UserProfile> {
  const response = await httpClient.post('/auth/login', data);
  return response.data;
}

export async function register(body: RegisterPayload): Promise<UserProfile> {
  const response = await httpClient.post('/auth/register', body);
  return response.data;
}

export async function getMe(): Promise<UserProfile> {
  const response = await httpClient.get('/users/me');
  return response.data;
}

export async function updateMe(user: UpdateUserPayload): Promise<UserProfile> {
  const response = await httpClient.patch('/users/me', user);
  return response.data;
}

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return undefined;
  }

  const expoToken = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return expoToken;
}

export async function getUserInformations() {
  const expoToken = await registerForPushNotificationsAsync();
  const calendars = await Localization.getCalendars();
  let userTimezone = 'Europe/Warsaw';

  if (calendars.length > 0 && calendars[0].timeZone) {
    userTimezone = calendars[0].timeZone;
    await AsyncStorage.setItem('userTimezone', JSON.stringify(userTimezone));
  }

  if (expoToken) {
    await AsyncStorage.setItem('userExpoToken', JSON.stringify(expoToken));
  }

  return login({ timezone: userTimezone, expotoken: expoToken });
}

export async function initTrackingActivity() {
  if (Platform.OS === 'ios') {
    const { status } = await TrackingTransparency.getTrackingPermissionsAsync();
    if (status !== 'granted') {
      await TrackingTransparency.requestTrackingPermissionsAsync();
    }
  }
}
