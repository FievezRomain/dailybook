import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { AppOwnership } from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import type { LocationObject } from 'expo-location';
import frWalkGps from '../../translation/fr/walkGps.json';
import * as EventService from '../../services/api/EventService';
import type { WalkPoint, WalkSession } from './types';

const WALK_LOCATION_TASK = 'vasco-walk-location';
const ACTIVE_WALK_KEY = '@vasco/active-walk-v1';
const UPLOAD_CHUNK_SIZE = 100;

export const isExpoGoWalkTracking = Constants.appOwnership === AppOwnership.Expo;

let foregroundLocationSubscription: Location.LocationSubscription | undefined;

export type WalkTrackingMessages = {
  foregroundPermission: string;
  backgroundPermission: string;
  notificationTitle: string;
  notificationBody: string;
};

const DEFAULT_TRACKING_MESSAGES: WalkTrackingMessages = {
  foregroundPermission: frWalkGps.errors.foregroundPermission,
  backgroundPermission: frWalkGps.errors.backgroundPermission,
  notificationTitle: frWalkGps.tracking.notificationTitle,
  notificationBody: frWalkGps.tracking.notificationBody,
};

export type ActiveWalk = {
  eventId: number;
  sessionId: number;
  startedAt: string;
  sequence: number;
  uploadedCount: number;
  points: WalkPoint[];
};

function toWalkPoint(location: LocationObject): WalkPoint {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    recorded_at: new Date(location.timestamp).toISOString(),
    accuracy_m: Math.min(1_000, Math.max(0, location.coords.accuracy ?? 1_000)),
    altitude_m: location.coords.altitude == null ? undefined : Math.min(10_000, Math.max(-500, location.coords.altitude)),
    speed_mps: location.coords.speed == null || location.coords.speed < 0 ? undefined : Math.min(100, location.coords.speed),
  };
}

async function readActiveWalk() {
  const value = await AsyncStorage.getItem(ACTIVE_WALK_KEY);
  return value ? JSON.parse(value) as ActiveWalk : undefined;
}

async function writeActiveWalk(walk: ActiveWalk) {
  await AsyncStorage.setItem(ACTIVE_WALK_KEY, JSON.stringify(walk));
}

async function appendLocations(locations: LocationObject[]) {
  const active = await readActiveWalk();
  if (!active) return;
  active.points.push(...locations.map(toWalkPoint));
  await writeActiveWalk(active);
}

TaskManager.defineTask(WALK_LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return;
  await appendLocations((data as { locations: LocationObject[] }).locations ?? []);
});

async function requestLocationPermissions(messages: WalkTrackingMessages) {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') throw new Error(messages.foregroundPermission);
  if (isExpoGoWalkTracking) return;
  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== 'granted') throw new Error(messages.backgroundPermission);
}

async function startNativeUpdates(messages: WalkTrackingMessages) {
  if (isExpoGoWalkTracking) {
    if (foregroundLocationSubscription) return;
    foregroundLocationSubscription = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 5,
      timeInterval: 5000,
    }, (location) => { void appendLocations([location]); });
    return;
  }
  if (await Location.hasStartedLocationUpdatesAsync(WALK_LOCATION_TASK)) return;
  await Location.startLocationUpdatesAsync(WALK_LOCATION_TASK, {
    accuracy: Location.Accuracy.BestForNavigation,
    activityType: Location.ActivityType.Fitness,
    distanceInterval: 5,
    timeInterval: 5000,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: messages.notificationTitle,
      notificationBody: messages.notificationBody,
      notificationColor: '#496A5B',
    },
  });
}

async function stopNativeUpdates() {
  foregroundLocationSubscription?.remove();
  foregroundLocationSubscription = undefined;
  if (!isExpoGoWalkTracking && await Location.hasStartedLocationUpdatesAsync(WALK_LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(WALK_LOCATION_TASK);
  }
}

export async function startOrResumeWalk(eventId: number, messages = DEFAULT_TRACKING_MESSAGES): Promise<ActiveWalk> {
  const local = await readActiveWalk();
  if (local?.eventId === eventId) {
    await startNativeUpdates(messages);
    return local;
  }
  await requestLocationPermissions(messages);
  const startedAt = new Date().toISOString();
  const session = await EventService.startWalkSession(eventId, startedAt);
  const active: ActiveWalk = { eventId, sessionId: session.id, startedAt, sequence: 0, uploadedCount: 0, points: [] };
  await writeActiveWalk(active);
  const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
  await appendLocations([initial]);
  await startNativeUpdates(messages);
  return (await readActiveWalk()) ?? active;
}

export async function getActiveWalk(eventId?: number) {
  const active = await readActiveWalk();
  return eventId === undefined || active?.eventId === eventId ? active : undefined;
}

export async function flushWalkPoints(): Promise<ActiveWalk | undefined> {
  const active = await readActiveWalk();
  if (!active) return undefined;
  while (active.uploadedCount < active.points.length) {
    const points = active.points.slice(active.uploadedCount, active.uploadedCount + UPLOAD_CHUNK_SIZE);
    await EventService.appendWalkPoints(active.sessionId, active.sequence, points);
    active.uploadedCount += points.length;
    active.sequence += 1;
    await writeActiveWalk(active);
  }
  return active;
}

export async function finishWalk(noActiveWalkMessage = frWalkGps.errors.noActiveWalk): Promise<WalkSession> {
  await stopNativeUpdates();
  const active = await flushWalkPoints();
  if (!active) throw new Error(noActiveWalkMessage);
  const session = await EventService.finalizeWalkSession(active.sessionId, new Date().toISOString());
  await AsyncStorage.removeItem(ACTIVE_WALK_KEY);
  return session;
}

export async function deleteWalkTracking(eventId: number): Promise<void> {
  await EventService.deleteWalkSession(eventId);
  const active = await readActiveWalk();
  if (active?.eventId !== eventId) return;
  await stopNativeUpdates();
  await AsyncStorage.removeItem(ACTIVE_WALK_KEY);
}
