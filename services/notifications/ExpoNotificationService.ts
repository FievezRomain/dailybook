import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { INotificationService } from './INotificationService';

/**
 * Implémentation Expo Notifications de INotificationService.
 * Encapsule toute la dépendance à expo-notifications.
 */
export class ExpoNotificationService implements INotificationService {
  async registerForPush(): Promise<string | undefined> {
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
        projectId: Constants.expoConfig?.extra?.eas?.projectId as string | undefined,
      })
    ).data;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#B07161',
      });
    }

    return expoToken;
  }

  async getToken(): Promise<string | undefined> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return undefined;
    return (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId as string | undefined,
      })
    ).data;
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  addReceivedListener(listener: () => void): () => void {
    const subscription = Notifications.addNotificationReceivedListener(listener);
    return () => subscription.remove();
  }

  addResponseListener(listener: () => void): () => void {
    const subscription = Notifications.addNotificationResponseReceivedListener(listener);
    return () => subscription.remove();
  }

  async hasLastResponse(): Promise<boolean> {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) await Notifications.clearLastNotificationResponseAsync();
    return Boolean(response);
  }

  async scheduleLocal(options: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    triggerSeconds: number;
  }): Promise<string> {
    return Notifications.scheduleNotificationAsync({
      content: { title: options.title, body: options.body, data: options.data },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: options.triggerSeconds },
    });
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const notificationService: INotificationService = new ExpoNotificationService();
